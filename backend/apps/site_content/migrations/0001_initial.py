from django.db import migrations, models


def seed_pages(apps, schema_editor):
    SitePage = apps.get_model("site_content", "SitePage")
    pages = [
        {"slug": "about", "eyebrow": "Our Company", "title": "Property should feel like more.", "lead": "We are a property company built around the belief that a home should offer more than an address.", "body": "From the locations we choose to the spaces we bring to life, we approach property with intention. We look for opportunities with character, quality, and lasting value, creating experiences that feel considered from the very first encounter.\n\nOur story began with a simple belief: better spaces create better lives. That belief guides how we select, develop, and present every property.\n\nWe value exceptional locations, thoughtful design, quality craftsmanship, trusted expertise, and personal service. Our team is here to help clients understand their options and make property decisions with clarity and confidence."},
        {"slug": "privacy", "eyebrow": "Legal · Starter Draft", "title": "Privacy Policy", "lead": "This editable starter draft describes how information submitted through this website may be handled. Confirm the actual practices and applicable requirements before publication.", "body": "1. Information you provide\nWhen you submit an inquiry, request a site visit, or contact our team, the website may collect the details you choose to provide, such as your name, email address, telephone number, and message.\n\n2. How information may be used\nInformation may be used to respond to requests, coordinate property viewings, provide requested information, and operate and improve the website.\n\n3. Sharing and storage\nConfirm the service providers, retention periods, security measures, and any cross-border transfers that apply to your business before this policy is approved.\n\n4. Cookies and analytics\nDescribe the cookies, analytics, and tracking technologies actually used by this website, including any choices available to visitors.\n\n5. Your choices and contact\nAdd the rights, request process, responsible contact, effective date, and any disclosures required by the laws applicable to your business.\n\nThis policy is a starter draft and is not legal advice. Have it reviewed and completed by your business and a qualified legal professional before publication."},
        {"slug": "terms", "eyebrow": "Legal · Starter Draft", "title": "Terms & Conditions", "lead": "These editable starter terms describe general website use. Complete and review them against your actual services and applicable requirements before publication.", "body": "1. Website information\nProperty availability, prices, descriptions, specifications, and images are provided for general information and may change. Confirm current details with the team before making a decision.\n\n2. Inquiries and visits\nAn inquiry or site visit request submitted through this website is not a purchase agreement, reservation, lease, or confirmation. Arrangements remain subject to confirmation by our team.\n\n3. Website use\nUse this website lawfully and do not interfere with its operation, security, or availability. Identify any additional permitted-use rules that apply to your services.\n\n4. Third-party services and content\nDescribe any relevant third-party links, intellectual property ownership, disclaimers, liability limits, governing law, dispute process, and contact details with qualified legal advice.\n\n5. Changes and contact\nAdd the effective date, business contact details, and the process for notifying visitors about changes.\n\nThese terms are a starter draft and are not legal advice. Have them reviewed and completed by your business and a qualified legal professional before publication."},
    ]
    for page in pages:
        SitePage.objects.update_or_create(slug=page["slug"], defaults=page)


class Migration(migrations.Migration):
    initial = True
    dependencies = []
    operations = [
        migrations.CreateModel(
            name="SitePage",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("slug", models.SlugField(choices=[("about", "About Us"), ("privacy", "Privacy Policy"), ("terms", "Terms & Conditions")], max_length=40, unique=True)),
                ("eyebrow", models.CharField(blank=True, max_length=120)),
                ("title", models.CharField(max_length=240)),
                ("lead", models.TextField(blank=True)),
                ("body", models.TextField(blank=True, help_text="Editable page copy. Use a blank line between paragraphs.")),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={"ordering": ("slug",)},
        ),
        migrations.RunPython(seed_pages, migrations.RunPython.noop),
    ]
