from django.contrib import admin

from .models import SitePage


@admin.register(SitePage)
class SitePageAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "updated_at")
    list_filter = ("slug",)
    search_fields = ("title", "lead", "body")
    readonly_fields = ("updated_at",)
    fieldsets = ((None, {"fields": ("slug", "eyebrow", "title", "lead", "body", "updated_at")}),)
