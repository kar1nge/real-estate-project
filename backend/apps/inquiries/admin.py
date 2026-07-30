from django.contrib import admin
from .models import Inquiry


@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "subject",
        "property",
        "status",
        "created_at",
    )

    list_filter = (
        "status",
        "created_at",
    )

    search_fields = (
        "name",
        "email",
        "subject",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    fields = (
        "property",
        "name",
        "email",
        "phone",
        "subject",
        "message",
        "response",
        "status",
        "created_at",
        "updated_at",
    )

    ordering = (
        "-created_at",
    )