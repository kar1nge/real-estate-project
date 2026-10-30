from django.contrib import admin

from .models import CmsAccountProfile


@admin.register(CmsAccountProfile)
class CmsAccountProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "theme", "claimed_at", "invitation_expires_at")
    list_filter = ("theme",)
    search_fields = ("user__username", "user__email")
    readonly_fields = ("invitation_token_hash",)
