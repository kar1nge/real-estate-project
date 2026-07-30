from django.contrib import admin
from .models import (
    SiteVisitSchedule,
    SiteVisitBooking,
)


@admin.register(SiteVisitSchedule)
class SiteVisitScheduleAdmin(admin.ModelAdmin):
    list_display = (
        "real_estate_property",
        "date",
        "start_time",
        "end_time",
        "max_bookings",
        "active",
        "remaining_slots",
    )

    list_filter = (
        "active",
        "date",
    )

    search_fields = (
        "real_estate_property__title",
    )


@admin.register(SiteVisitBooking)
class SiteVisitBookingAdmin(admin.ModelAdmin):
    list_display = (
        "visitor_name",
        "visitor_email",
        "visitor_phone",
        "schedule",
        "attendance_status",
        "created_at",
    )

    list_filter = (
        "attendance_status",
    )

    search_fields = (
        "visitor_name",
        "visitor_email",
    )