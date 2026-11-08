"""Public health, frontend, and persistent-media endpoints for deployment."""

import mimetypes
import re
from pathlib import Path

from django.conf import settings
from django.db import connection
from django.http import FileResponse, Http404, HttpResponse, JsonResponse


def health_check(request):
    """Return healthy only when the application can reach its database."""
    with connection.cursor() as cursor:
        cursor.execute("SELECT 1")
    return JsonResponse({"status": "ok"})


def robots_txt(request):
    robots_path = settings.FRONTEND_DIST_DIR / "robots.txt"
    if robots_path.is_file():
        return FileResponse(robots_path.open("rb"), content_type="text/plain")
    return HttpResponse("User-agent: *\nDisallow: /\n", content_type="text/plain")


def frontend_index(request):
    """Serve the built React application for BrowserRouter deep links."""
    index_path = settings.FRONTEND_DIST_DIR / "index.html"
    if not index_path.is_file():
        raise Http404("The frontend has not been built for this deployment.")
    html = index_path.read_text(encoding="utf-8")
    preview_image_url = request.build_absolute_uri("/static/og-image.jpg")
    html = html.replace(
        'property="og:image" content="/static/og-image.jpg"',
        f'property="og:image" content="{preview_image_url}"',
    )
    path = request.path_info.rstrip("/") or "/"
    known_paths = {
        "/", "/properties", "/about", "/faqs", "/inquiry",
        "/book-site-visit", "/contact", "/privacy", "/terms",
        "/manage", "/manage/login", "/manage/activate",
        "/manage/company-settings", "/manage/hero", "/manage/properties",
        "/manage/content", "/manage/employees", "/manage/my-account",
        "/manage/accounts",
    }
    is_known_path = path in known_paths or bool(re.fullmatch(r"/activate/[^/]+", path))

    if not is_known_path:
        property_match = re.fullmatch(r"/properties/([^/]+)", path)
        if property_match:
            from apps.properties.models import Property

            is_known_path = Property.objects.filter(slug=property_match.group(1)).exists()

    response = HttpResponse(html, content_type="text/html; charset=utf-8")
    if not is_known_path:
        response.status_code = 404
    return response


def persistent_media_file(request, path):
    """Stream uploaded media from the Render disk without allowing path traversal."""
    media_root = Path(settings.MEDIA_ROOT).resolve()
    media_path = (media_root / path).resolve()
    try:
        media_path.relative_to(media_root)
    except ValueError as exc:
        raise Http404("Media file not found.") from exc

    if not media_path.is_file():
        raise Http404("Media file not found.")

    content_type, _ = mimetypes.guess_type(media_path.name)
    if not content_type or not content_type.startswith("image/"):
        raise Http404("Media file not found.")

    response = FileResponse(
        media_path.open("rb"),
        content_type=content_type,
    )
    response["Cache-Control"] = "public, max-age=86400"
    response["X-Content-Type-Options"] = "nosniff"
    return response
