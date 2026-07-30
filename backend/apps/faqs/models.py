from django.db import models


class FAQ(models.Model):

    CATEGORY_CHOICES = [
        ("general", "General"),
        ("buying", "Buying"),
        ("renting", "Renting"),
        ("site_visits", "Site Visits"),
        ("properties", "Properties"),
        ("legal", "Legal"),
        ("support", "Support"),
    ]

    question = models.CharField(
        max_length=500
    )

    answer = models.TextField()

    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES,
        default="general",
    )

    display_order = models.PositiveIntegerField(
        default=1
    )

    is_featured = models.BooleanField(
        default=False
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
            "question",
        ]

    def __str__(self):
        return self.question