"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth import get_user_model, update_session_auth_hash
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.views.decorators.csrf import csrf_protect
from config.deployment_views import (
    frontend_index,
    health_check,
    persistent_media_file,
    robots_txt,
    sitemap_xml,
)
from apps.cms_accounts.models import CmsAccountProfile, hash_invitation_token
from rest_framework.decorators import api_view, throttle_classes
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from datetime import timedelta
import secrets
import json

@ensure_csrf_cookie
def csrf_token_view(request):
    return JsonResponse({"csrfToken": get_token(request)})


@require_http_methods(["GET", "DELETE"])
def cms_session_view(request):
    """Expose the current staff session and provide CMS login/logout."""
    if request.method == "GET":
        user = request.user
        if not user.is_authenticated or not user.is_staff:
            return JsonResponse({"authenticated": False}, status=401)
        return JsonResponse({
            "authenticated": True,
            "user": cms_user_payload(user),
        })

    logout(request)
    return JsonResponse({"authenticated": False})


def cms_login_throttle_scope(view_function):
    view_function.cls.throttle_scope = "cms_login"
    return view_function


@cms_login_throttle_scope
@api_view(["POST"])
@throttle_classes([ScopedRateThrottle])
def cms_login_view(request):
    user = authenticate(
        request,
        username=str(request.data.get("username", "")).strip(),
        password=str(request.data.get("password", "")),
    )
    if user is None or not user.is_active or not user.is_staff:
        return Response({"detail": "Invalid username or password."}, status=401)
    login(request, user)
    return Response({"authenticated": True, "user": cms_user_payload(user)})


def cms_user_payload(user):
    profile, _ = CmsAccountProfile.objects.get_or_create(user=user)
    return {
        "id": user.pk,
        "username": user.get_username(),
        "email": user.email,
        "is_superuser": user.is_superuser,
        "theme": profile.theme,
    }


def cms_admin_required(request):
    return request.user.is_authenticated and request.user.is_superuser


@require_http_methods(["POST"])
def cms_activate_account_view(request):
    try:
        payload = json.loads(request.body or b"{}")
    except (TypeError, ValueError):
        return JsonResponse({"detail": "Invalid request body."}, status=400)
    token = str(payload.get("token", ""))
    password = str(payload.get("password", ""))
    if len(password) < 10:
        return JsonResponse({"detail": "Use a password with at least 10 characters."}, status=400)
    profile = CmsAccountProfile.objects.select_related("user").filter(
        invitation_token_hash=hash_invitation_token(token),
        claimed_at__isnull=True,
        invitation_expires_at__gt=timezone.now(),
    ).first()
    if profile is None:
        return JsonResponse({"detail": "This invitation is invalid, expired, or already used."}, status=400)
    user = profile.user
    user.set_password(password)
    user.is_active = True
    user.save(update_fields=["password", "is_active"])
    profile.claimed_at = timezone.now()
    profile.invitation_token_hash = ""
    profile.invitation_expires_at = None
    profile.save(update_fields=["claimed_at", "invitation_token_hash", "invitation_expires_at"])
    login(request, user)
    return JsonResponse({"authenticated": True, "user": cms_user_payload(user)})


@require_http_methods(["GET", "POST"])
def cms_accounts_view(request):
    if not cms_admin_required(request):
        return JsonResponse({"detail": "Administrator access required."}, status=403)
    User = get_user_model()
    if request.method == "GET":
        results = []
        for user in User.objects.filter(is_staff=True).order_by("username"):
            profile, _ = CmsAccountProfile.objects.get_or_create(user=user)
            results.append({
                "id": user.pk, "username": user.username, "email": user.email,
                "is_active": user.is_active, "is_superuser": user.is_superuser,
                "theme": profile.theme, "claimed": profile.claimed_at is not None,
            })
        return JsonResponse({"results": results})

    try:
        payload = json.loads(request.body or b"{}")
    except (TypeError, ValueError):
        return JsonResponse({"detail": "Invalid request body."}, status=400)
    username = str(payload.get("username", "")).strip()
    email = str(payload.get("email", "")).strip().lower()
    if not username or not email:
        return JsonResponse({"detail": "Username and email are required."}, status=400)
    if User.objects.filter(username__iexact=username).exists():
        return JsonResponse({"detail": "That username is already in use."}, status=400)
    if User.objects.filter(email__iexact=email).exists():
        return JsonResponse({"detail": "That email address is already in use."}, status=400)
    user = User.objects.create_user(username=username, email=email, is_active=False, is_staff=True)
    user.set_unusable_password()
    user.save(update_fields=["password"])
    # 128 bits of randomness keeps the invitation code compact while remaining
    # impractical to guess. Only its SHA-256 hash is stored in the database.
    raw_token = secrets.token_urlsafe(16)
    profile = CmsAccountProfile.objects.create(
        user=user,
        invitation_token_hash=hash_invitation_token(raw_token),
        invitation_expires_at=timezone.now() + timedelta(days=7),
    )
    return JsonResponse({
        "id": user.pk, "username": user.username, "email": user.email,
        "theme": profile.theme, "activation_token": raw_token,
        "invitation_expires_at": profile.invitation_expires_at,
    }, status=201)


@require_http_methods(["PATCH"])
def cms_account_detail_view(request, user_id):
    if not cms_admin_required(request):
        return JsonResponse({"detail": "Administrator access required."}, status=403)
    User = get_user_model()
    user = User.objects.filter(pk=user_id, is_staff=True).first()
    if user is None:
        return JsonResponse({"detail": "Account not found."}, status=404)
    try:
        payload = json.loads(request.body or b"{}")
    except (TypeError, ValueError):
        return JsonResponse({"detail": "Invalid request body."}, status=400)
    profile, _ = CmsAccountProfile.objects.get_or_create(user=user)
    if "theme" in payload:
        if payload["theme"] not in CmsAccountProfile.Theme.values:
            return JsonResponse({"detail": "Theme must be light or dark."}, status=400)
        profile.theme = payload["theme"]
        profile.save(update_fields=["theme"])
    if "is_active" in payload:
        if user.pk == request.user.pk and payload["is_active"] is False:
            return JsonResponse({"detail": "You cannot disable your own account."}, status=400)
        if not isinstance(payload["is_active"], bool):
            return JsonResponse({"detail": "is_active must be true or false."}, status=400)
        if payload["is_active"] and profile.claimed_at is None:
            return JsonResponse({"detail": "This user must activate their invitation before access can be enabled."}, status=400)
        user.is_active = payload["is_active"]
        user.save(update_fields=["is_active"])
    return JsonResponse({"id": user.pk, "username": user.username, "is_active": user.is_active, "theme": profile.theme})


@require_http_methods(["POST"])
def cms_account_invite_view(request, user_id):
    if not cms_admin_required(request):
        return JsonResponse({"detail": "Administrator access required."}, status=403)
    User = get_user_model()
    user = User.objects.filter(pk=user_id, is_staff=True, is_active=False).first()
    if user is None:
        return JsonResponse({"detail": "Pending account not found."}, status=404)
    profile, _ = CmsAccountProfile.objects.get_or_create(user=user)
    if profile.claimed_at is not None:
        return JsonResponse({"detail": "This invitation has already been claimed."}, status=400)
    raw_token = secrets.token_urlsafe(16)
    profile.invitation_token_hash = hash_invitation_token(raw_token)
    profile.invitation_expires_at = timezone.now() + timedelta(days=7)
    profile.claimed_at = None
    profile.save(update_fields=["invitation_token_hash", "invitation_expires_at", "claimed_at"])
    return JsonResponse({
        "activation_token": raw_token,
        "invitation_expires_at": profile.invitation_expires_at,
    })


@require_http_methods(["PATCH"])
def cms_preferences_view(request):
    if not request.user.is_authenticated or not request.user.is_staff:
        return JsonResponse({"detail": "Sign in to the CMS first."}, status=401)
    try:
        payload = json.loads(request.body or b"{}")
    except (TypeError, ValueError):
        return JsonResponse({"detail": "Invalid request body."}, status=400)
    theme = payload.get("theme")
    if theme not in CmsAccountProfile.Theme.values:
        return JsonResponse({"detail": "Theme must be light or dark."}, status=400)
    profile, _ = CmsAccountProfile.objects.get_or_create(user=request.user)
    profile.theme = theme
    profile.save(update_fields=["theme"])
    return JsonResponse({"theme": profile.theme})


@require_http_methods(["GET", "PATCH"])
def cms_my_account_view(request):
    user = request.user
    if not user.is_authenticated or not user.is_staff:
        return JsonResponse({"detail": "Sign in to the CMS first."}, status=401)
    profile, _ = CmsAccountProfile.objects.get_or_create(user=user)
    if request.method == "GET":
        return JsonResponse({
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "theme": profile.theme,
        })

    try:
        payload = json.loads(request.body or b"{}")
    except (TypeError, ValueError):
        return JsonResponse({"detail": "Invalid request body."}, status=400)
    if not isinstance(payload, dict):
        return JsonResponse({"detail": "Invalid request body."}, status=400)
    if "theme" in payload:
        if payload["theme"] not in CmsAccountProfile.Theme.values:
            return JsonResponse({"detail": "Theme must be light or dark."}, status=400)

    password_fields = {"current_password", "new_password", "confirm_password"}
    provided_password_fields = password_fields.intersection(payload)
    if provided_password_fields:
        if provided_password_fields != password_fields:
            return JsonResponse({"detail": "Enter your current password and both new password fields."}, status=400)
        current_password = str(payload["current_password"])
        new_password = str(payload["new_password"])
        if not user.check_password(current_password):
            return JsonResponse({"detail": "Your current password is incorrect."}, status=400)
        if len(new_password) < 10:
            return JsonResponse({"detail": "Use a password with at least 10 characters."}, status=400)
        if new_password != str(payload["confirm_password"]):
            return JsonResponse({"detail": "The new passwords do not match."}, status=400)

    if "email" in payload:
        email = str(payload["email"]).strip().lower()
        try:
            validate_email(email)
        except ValidationError:
            return JsonResponse({"detail": "Enter a valid email address."}, status=400)
        if get_user_model().objects.filter(email__iexact=email).exclude(pk=user.pk).exists():
            return JsonResponse({"detail": "That email address is already in use."}, status=400)
        user.email = email
    if "first_name" in payload:
        user.first_name = str(payload["first_name"]).strip()[:150]
    if "last_name" in payload:
        user.last_name = str(payload["last_name"]).strip()[:150]
    user.save(update_fields=["first_name", "last_name", "email"])

    if "theme" in payload:
        profile.theme = payload["theme"]
        profile.save(update_fields=["theme"])

    if provided_password_fields:
        user.set_password(new_password)
        user.save(update_fields=["password"])
        update_session_auth_hash(request, user)

    return JsonResponse({
        "username": user.username,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "theme": profile.theme,
    })


urlpatterns = [
    path("api/health/", health_check, name="health-check"),
    path("robots.txt", robots_txt, name="robots-txt"),
    path("sitemap.xml", sitemap_xml, name="sitemap-xml"),
    path("api/csrf/", csrf_token_view, name="csrf-token"),
    path("api/cms/session/", cms_session_view, name="cms-session"),
    path("api/cms/login/", csrf_protect(cms_login_view), name="cms-login"),
    path("api/cms/activate/", csrf_protect(cms_activate_account_view), name="cms-activate"),
    path("api/cms/accounts/", cms_accounts_view, name="cms-accounts"),
    path("api/cms/accounts/<int:user_id>/", cms_account_detail_view, name="cms-account-detail"),
    path("api/cms/accounts/<int:user_id>/invite/", cms_account_invite_view, name="cms-account-invite"),
    path("api/cms/preferences/", cms_preferences_view, name="cms-preferences"),
    path("api/cms/my-account/", cms_my_account_view, name="cms-my-account"),
    path('admin/', admin.site.urls),
    path('api/properties/', include('apps.properties.urls')),
    path('api/site-visits/', include('apps.site_visits.urls')),
    path('api/inquiries/', include('apps.inquiries.urls')),
    path('api/team/', include('apps.team.urls')),
    path('api/testimonials/', include('apps.testimonials.urls')),
    path('api/faqs/', include('apps.faqs.urls')),
    path('api/hero/', include('apps.hero.urls')),
    path('api/contacts/', include('apps.contacts.urls')),
    path('api/statistics/', include('apps.site_statistics.urls')),
    path('api/site-content/', include('apps.site_content.urls')),
    path('api/schema', SpectacularAPIView.as_view(),name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui',),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'),name='redoc',),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )
elif settings.MEDIA_STORAGE_BACKEND in {"render_disk", "local"}:
    urlpatterns += [
        re_path(r"^media/(?P<path>.+)$", persistent_media_file, name="uploaded-media"),
    ]

urlpatterns += [
    re_path(r"^(?!api/|admin/|static/).*$", frontend_index, name="frontend-index"),
]




