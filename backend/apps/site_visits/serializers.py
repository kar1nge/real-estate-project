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

            if value.remaining_slots <= 0:
                raise serializers.ValidationError(
            "This site visit is fully booked."
            )

            return value