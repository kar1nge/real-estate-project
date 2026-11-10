from django.db import models
from apps.properties.models import Property
from apps.faqs.models import FAQ


class Inquiry(models.Model):

    STATUS_CHOICES = [
    ("new", "New"),
    ("in_progress", "In Progress"),
    ("answered", "Answered"),
    ("closed", "Closed"),
    ]


    property = models.ForeignKey(
        Property,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="inquiries",
    )

    name = models.CharField(max_length=255)

    email = models.EmailField()

    phone = models.CharField(
        max_length=20
    )

    subject = models.CharField(
        max_length=255
    )

    message = models.TextField()

    faq_category = models.CharField(
        max_length=50,
        choices=FAQ.CATEGORY_CHOICES,
        default="general",
    )

    response = models.TextField(
    blank=True,
    null=True
    )

    response_sent = models.BooleanField(
    default=False
    )

    publish_to_faq = models.BooleanField(default=False)

    published_faq = models.ForeignKey(
        FAQ,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="source_inquiries",
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="new",
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Inquiry"
        verbose_name_plural = "Inquiries"

    def __str__(self):
        return (
            f"{self.name} - "
            f"{self.subject}"
        )
