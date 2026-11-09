from rest_framework import serializers

from .models import (
    SiteVisitSchedule,
    SiteVisitBooking,
)


class SiteVisitScheduleSerializer(serializers.ModelSerializer):

    property_title = serializers.CharField(
        source="real_estate_property.title",
        read_only=True
    )

    remaining_slots = serializers.IntegerField(
        read_only=True
    )

    class Meta:
        model = SiteVisitSchedule
        fields = [
            "id",
            "property_title",
            "date",
            "start_time",
            "end_time",
            "max_bookings",
            "remaining_slots",
            "active",
            "notes",
        ]


class SiteVisitBookingSerializer(serializers.ModelSerializer):

    class Meta:
        model = SiteVisitBooking
        fields = [
            "id",
            "schedule",
            "visitor_name",
            "visitor_email",
            "visitor_phone",
            "number_of_visitors",
            "message",
            "attendance_status",
            "created_at",
        ]

        read_only_fields = [
            "attendance_status",
            "created_at",
        ]

    def validate_schedule(self, value):

        if not value.active:
            raise serializers.ValidationError(
                "This site visit is no longer available for booking."
            )

        if value.remaining_slots <= 0:
            raise serializers.ValidationError(
                "This site visit is fully booked."
            )

        return value


class SiteVisitScheduleManagementSerializer(serializers.ModelSerializer):
    property_title = serializers.CharField(
        source="real_estate_property.title", read_only=True
    )
    remaining_slots = serializers.IntegerField(read_only=True)

    class Meta:
        model = SiteVisitSchedule
        fields = [
            "id", "real_estate_property", "property_title", "date",
            "start_time", "end_time", "max_bookings", "remaining_slots",
            "active", "notes", "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class SiteVisitBookingManagementSerializer(serializers.ModelSerializer):
    property_title = serializers.CharField(
        source="schedule.real_estate_property.title", read_only=True
    )
    visit_date = serializers.DateField(source="schedule.date", read_only=True)
    start_time = serializers.TimeField(source="schedule.start_time", read_only=True)
    end_time = serializers.TimeField(source="schedule.end_time", read_only=True)

    class Meta:
        model = SiteVisitBooking
        fields = [
            "id", "schedule", "property_title", "visit_date", "start_time",
            "end_time", "visitor_name", "visitor_email", "visitor_phone",
            "number_of_visitors", "message", "status", "attendance_status",
            "confirmation_sent", "created_at", "updated_at",
        ]
        read_only_fields = [
            "id", "property_title", "visit_date", "start_time", "end_time",
            "confirmation_sent", "created_at", "updated_at",
        ]

    def validate_number_of_visitors(self, value):
        if value < 1 or value > 3:
            raise serializers.ValidationError(
                "A booking can include between 1 and 3 visitors."
            )
        return value
