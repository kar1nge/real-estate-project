from django.contrib import admin

from .models import FAQ


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):

    list_display = (
        "question",
        "category",
        "is_featured",
        "is_active",
        "created_at",
    )

    list_filter = (
        "category",
        "is_featured",
        "is_active",
    )

    search_fields = (
        "question",
        "answer",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    ordering = (
        "display_order",
        "question",
    )