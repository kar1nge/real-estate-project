from django.contrib import admin
from .models import TeamMember


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "position",
        "display_order",
        "is_active",
        "created_at",
    )

    list_filter = (
        "position",
        "is_active",
        "created_at",
    )

    search_fields = (
        "name",
        "email",
        "phone",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    ordering = (
        "display_order",
        "name",
    )

    fields = (
        "name",
        "position",
        "bio",
        "email",
        "phone",
        "photo",
        "linkedin_url",
        "display_order",
        "is_active",
        "created_at",
        "updated_at",
    )