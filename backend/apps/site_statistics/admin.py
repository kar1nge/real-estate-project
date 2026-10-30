from django.contrib import admin

from .models import Statistic


@admin.register(Statistic)
class StatisticAdmin(admin.ModelAdmin):
    list_display = ("label", "value", "suffix", "display_order", "is_active")
    list_editable = ("value", "suffix", "display_order", "is_active")
    list_filter = ("is_active",)
    search_fields = ("label",)
    ordering = ("display_order", "id")
