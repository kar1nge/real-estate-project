from django.db import models


class HeroSlide(models.Model):

    title = models.CharField(
        max_length=255
    )

    subtitle = models.TextField()

    image = models.ImageField(
        upload_to="hero/"
    )

    button_text = models.CharField(
        max_length=100
    )

    button_link = models.CharField(
        max_length=255
    )

    order = models.PositiveIntegerField(
        default=1
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.title