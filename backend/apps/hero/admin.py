from django.contrib import admin

from .models import HeroSlide


@admin.register(HeroSlide)
class HeroSlideAdmin(admin.ModelAdmin):

    list_display = (
        "title",
        "order",
        "is_active",
        "starts_at",
        "ends_at",
        "created_at",
    )

    list_filter = (
        "is_active",
        "starts_at",
        "ends_at",
    )

    ordering = (
        "order",
    )

    search_fields = (
        "title",
    )
