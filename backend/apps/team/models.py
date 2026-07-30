from django.db import models


class TeamMember(models.Model):

    POSITION_CHOICES = [
        ("managing_director", "Managing Director"),
        ("sales_manager", "Sales Manager"),
        ("property_consultant", "Property Consultant"),
        ("marketing_lead", "Marketing Lead"),
        ("customer_relations", "Customer Relations Officer"),
        ("operations_manager", "Operations Manager"),
    ]

    name = models.CharField(
        max_length=255
    )

    position = models.CharField(
        max_length=50,
        choices=POSITION_CHOICES,
    )

    bio = models.TextField()

    email = models.EmailField(
        blank=True,
        null=True,
    )

    phone = models.CharField(
        max_length=20,
        blank=True,
        null=True,
    )

    photo = models.ImageField(
        upload_to="team/",
        blank=True,
        null=True,
    )

    linkedin_url = models.URLField(
        blank=True,
        null=True,
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
        ordering = ["display_order", "name"]

    def __str__(self):
        return f"{self.name} - {self.get_position_display()}"