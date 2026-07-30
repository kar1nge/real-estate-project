from django.contrib import admin

from .models import Testimonial


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):

    list_display = (
        "client_name",
        "rating",
        "property",
        "is_featured",
        "is_active",
        "created_at",
    )

    list_filter = (
        "rating",
        "is_featured",
        "is_active",
        "created_at",
    )

    search_fields = (
        "client_name",
        "testimonial",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    ordering = (
        "display_order",
        "-created_at",
    )

    fields = (
        "client_name",
        "testimonial",
        "rating",
        "property",
        "is_featured",
        "display_order",
        "is_active",
        "created_at",
        "updated_at",
    )