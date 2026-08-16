from django.db import models


class ContactSettings(models.Model):
    name = models.CharField(max_length=255)

    email = models.EmailField()
    phone = models.CharField(max_length=50)
    whatsapp = models.CharField(max_length=50)

    address = models.CharField(max_length=255)
    google_maps = models.URLField(blank=True)

    instagram = models.URLField(blank=True)
    facebook = models.URLField(blank=True)
    twitter = models.URLField(blank=True)
    tiktok = models.URLField(blank=True)
    youtube = models.URLField(blank=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Contact Settings"
        verbose_name_plural = "Contact Settings"

    def __str__(self):
        return self.name