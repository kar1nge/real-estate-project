import hashlib

from django.conf import settings
from django.db import models


def hash_invitation_token(token):
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


class CmsAccountProfile(models.Model):
    class Theme(models.TextChoices):
        LIGHT = "light", "Light"
        DARK = "dark", "Dark"

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="cms_profile",
    )
    theme = models.CharField(max_length=10, choices=Theme.choices, default=Theme.LIGHT)
    invitation_token_hash = models.CharField(max_length=64, blank=True)
    invitation_expires_at = models.DateTimeField(null=True, blank=True)
    claimed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"CMS preferences for {self.user.get_username()}"


class CmsCacheEntry(models.Model):
    """Database table backing Django's shared cache and API rate limits."""

    cache_key = models.CharField(max_length=255, primary_key=True)
    value = models.TextField()
    expires = models.DateTimeField(db_index=True)

    class Meta:
        db_table = "cms_cache"
        verbose_name = "CMS cache entry"
        verbose_name_plural = "CMS cache entries"
