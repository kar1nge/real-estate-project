from django.contrib import admin

from .models import HeroSlide


@admin.register(HeroSlide)
class HeroSlideAdmin(admin.ModelAdmin):

    list_display = (
        "title",
        "order",
        "is_active",
        "created_at",
    )

    list_filter = (
        "is_active",
    )

    ordering = (
        "order",
    )

    search_fields = (
        "title",
    )