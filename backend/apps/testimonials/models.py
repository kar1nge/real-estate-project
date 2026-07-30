from django.db import models

from apps.properties.models import Property


class Testimonial(models.Model):

    RATING_CHOICES = [
        (1, "1 Star"),
        (2, "2 Stars"),
        (3, "3 Stars"),
        (4, "4 Stars"),
        (5, "5 Stars"),
    ]

    client_name = models.CharField(
        max_length=255
    )

    testimonial = models.TextField()

    rating = models.PositiveSmallIntegerField(
        choices=RATING_CHOICES,
        default=5,
    )

    property = models.ForeignKey(
        Property,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="testimonials",
    )

    is_featured = models.BooleanField(
        default=False
    )

    display_order = models.PositiveIntegerField(
        default=1
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:

        ordering = [
            "display_order",
            "-created_at",
        ]

    def __str__(self):

        return (
            f"{self.client_name} "
            f"({self.rating}/5)"
        )