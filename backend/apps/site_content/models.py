from django.db import models


class SitePage(models.Model):
    class Slug(models.TextChoices):
        ABOUT = "about", "About Us"
        PRIVACY = "privacy", "Privacy Policy"
        TERMS = "terms", "Terms & Conditions"

    slug = models.SlugField(max_length=40, choices=Slug.choices, unique=True)
    eyebrow = models.CharField(max_length=120, blank=True)
    title = models.CharField(max_length=240)
    lead = models.TextField(blank=True)
    body = models.TextField(blank=True, help_text="Editable page copy. Use a blank line between paragraphs.")
    sections = models.JSONField(
        default=list,
        blank=True,
        help_text="Structured legal sections, each with a heading and body.",
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("slug",)

    def __str__(self):
        return self.get_slug_display()
