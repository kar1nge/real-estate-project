"""Public health, frontend, and persistent-media endpoints for deployment."""

import mimetypes
import json
import re
from pathlib import Path
from html import escape

from django.conf import settings
from django.db import connection
from django.http import FileResponse, Http404, HttpResponse, JsonResponse
from django.utils import timezone


def health_check(request):
    """Return healthy only when the application can reach its database."""
    with connection.cursor() as cursor:
        cursor.execute("SELECT 1")
    return JsonResponse({"status": "ok"})


def robots_txt(request):
    robots_path = settings.FRONTEND_DIST_DIR / "robots.txt"
    if robots_path.is_file():
        content = robots_path.read_text(encoding="utf-8")
        content += f"\nSitemap: {request.build_absolute_uri('/sitemap.xml')}\n"
        return HttpResponse(content, content_type="text/plain")
    return HttpResponse("User-agent: *\nDisallow: /\n", content_type="text/plain")


def google_site_verification(request):
    """Serve Google's ownership verification file from the public site root."""
    verification_file = (
        settings.FRONTEND_DIST_DIR / "googleb81864fafb851b0a.html"
    )
    if not verification_file.is_file():
        raise Http404("Google verification file is not present in this deployment.")
    return HttpResponse(
        verification_file.read_text(encoding="utf-8"),
        content_type="text/html; charset=utf-8",
    )


def frontend_index(request):
    """Serve the built React application for BrowserRouter deep links."""
    index_path = settings.FRONTEND_DIST_DIR / "index.html"
    if not index_path.is_file():
        raise Http404("The frontend has not been built for this deployment.")
    html = index_path.read_text(encoding="utf-8")
    path = request.path_info.rstrip("/") or "/"
    preview_image_url = request.build_absolute_uri("/static/og-image.jpg")
    html = html.replace(
        'property="og:image" content="/static/og-image.jpg"',
        f'property="og:image" content="{preview_image_url}"',
    )
    property_match = re.fullmatch(r"/properties/([^/]+)", path)
    page_metadata = {
        "/": ("NduKaWa Properties | Premium Real Estate", "Discover premium homes and property opportunities with NduKaWa Properties. Explore listings and arrange a viewing with our Nairobi team."),
        "/properties": ("Properties for Sale | NduKaWa Properties", "Browse homes and property opportunities across Nairobi. Explore listings by location, property type, and price."),
        "/about": ("About NduKaWa Properties | Our Team and Experience", "Meet the people and learn about the experience behind NduKaWa Properties."),
        "/faqs": ("Property FAQs | NduKaWa Properties", "Find answers about buying property, viewings, and working with NduKaWa Properties."),
        "/contact": ("Contact NduKaWa Properties | Nairobi", "Contact the NduKaWa Properties team for help with a property or viewing."),
        "/inquiry": ("Property Inquiry | NduKaWa Properties", "Send a property inquiry to the NduKaWa Properties team."),
        "/book-site-visit": ("Book a Property Viewing | NduKaWa Properties", "Choose an available property viewing time with NduKaWa Properties."),
        "/privacy": ("Privacy Policy | NduKaWa Properties", "Read the NduKaWa Properties privacy policy."),
        "/terms": ("Terms and Conditions | NduKaWa Properties", "Read the NduKaWa Properties website terms and conditions."),
    }
    title, description = page_metadata.get(path, page_metadata["/"])
    property_obj = None
    if property_match:
        from apps.properties.models import Property

        property_obj = Property.objects.filter(
            slug=property_match.group(1), publication_status="published"
        ).select_related("location", "property_type", "status").prefetch_related("images").first()
        if property_obj:
            title = f"{property_obj.title} | NduKaWa Properties"
            description = property_obj.short_description or property_obj.description[:155]
            image = property_obj.images.filter(is_active=True).order_by("display_order").first()
            image_url = request.build_absolute_uri(image.image.url) if image else preview_image_url
        else:
            description = page_metadata.get(path, page_metadata["/"])[1]

    html = re.sub(r'<title>.*?</title>', lambda _: f'<title>{escape(title)}</title>', html, count=1, flags=re.S)
    values = (("description", description, "name"), ("og:title", title, "property"), ("og:description", description, "property"))
    for key, value, attr in values:
        html = re.sub(
            rf'<meta\s+{attr}="{re.escape(key)}"\s+content="[^"]*"\s*/?>',
            lambda _: f'<meta {attr}="{key}" content="{escape(value, quote=True)}" />', html, count=1,
        )
    image = property_obj.images.filter(is_active=True).order_by("display_order").first() if property_obj else None
    image_url = request.build_absolute_uri(image.image.url) if image else preview_image_url
    canonical_url = request.build_absolute_uri(path.rstrip("/") + "/" if path != "/" else "/")
    for key, value, attr in (("og:image", image_url, "property"), ("og:image:alt", f"{property_obj.title} property listing" if property_obj else "A featured home from NduKaWa Properties", "property"), ("og:type", "product" if property_obj else "website", "property"), ("og:url", canonical_url, "property"), ("twitter:title", title, "name"), ("twitter:description", description, "name"), ("twitter:image", image_url, "name")):
        html = re.sub(
            rf'<meta\s+{attr}="{re.escape(key)}"\s+content="[^"]*"\s*/?>',
            lambda _: f'<meta {attr}="{key}" content="{escape(value, quote=True)}" />', html, count=1,
        )
    if path not in {"/manage", "/manage/login"} and not path.startswith("/manage/") and not path.startswith("/activate/"):
        html = html.replace("</head>", f'<link rel="canonical" href="{escape(canonical_url, quote=True)}" />\n</head>')
    try:
        from apps.contacts.models import ContactSettings
        company = ContactSettings.objects.first()
        if company:
            structured = {"@context": "https://schema.org", "@type": "RealEstateAgent", "name": company.name, "url": request.build_absolute_uri("/"), "email": company.email, "telephone": company.phone}
            if company.address:
                structured["address"] = {"@type": "PostalAddress", "streetAddress": company.address, "addressCountry": "KE"}
            schema_tag = '<script type="application/ld+json">' + json.dumps(structured).replace("</", "<\\/") + "</script>"
            html = html.replace("</head>", f"{schema_tag}\n</head>")
    except Exception:
        pass

    known_paths = {
        "/", "/properties", "/about", "/faqs", "/inquiry",
        "/book-site-visit", "/contact", "/privacy", "/terms",
        "/manage", "/manage/login", "/manage/activate",
        "/manage/company-settings", "/manage/hero", "/manage/properties",
        "/manage/content", "/manage/employees", "/manage/my-account",
        "/manage/accounts",
        "/manage/site-visits",
    }
    is_known_path = path in known_paths or bool(re.fullmatch(r"/activate/[^/]+", path))

    if not is_known_path:
        if property_match:
            is_known_path = bool(property_obj)

    response = HttpResponse(html, content_type="text/html; charset=utf-8")
    if not is_known_path:
        response.status_code = 404
    return response


def sitemap_xml(request):
    from django.utils.xmlutils import SimplerXMLGenerator
    from apps.properties.models import Property

    urls = ["/", "/properties/", "/about/", "/faqs/", "/contact/", "/privacy/", "/terms/"]
    urls.extend(
        f"/properties/{slug}/"
        for slug in Property.objects.filter(publication_status="published").values_list("slug", flat=True)
    )
    response = HttpResponse(content_type="application/xml; charset=utf-8")
    xml = SimplerXMLGenerator(response, "utf-8")
    xml.startDocument()
    xml.startElement("urlset", {"xmlns": "http://www.sitemaps.org/schemas/sitemap/0.9"})
    for path in urls:
        xml.startElement("url", {})
        xml.startElement("loc", {})
        xml.characters(request.build_absolute_uri(path))
        xml.endElement("loc")
        xml.startElement("lastmod", {})
        xml.characters(timezone.now().date().isoformat())
        xml.endElement("lastmod")
        xml.endElement("url")
    xml.endElement("urlset")
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
