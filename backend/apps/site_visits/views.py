import logging

from django.db import transaction
from rest_framework import generics
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAdminUser
from rest_framework.throttling import ScopedRateThrottle

from .models import (
    SiteVisitSchedule,
    SiteVisitBooking,
)

from .serializers import (
    SiteVisitScheduleSerializer,
    SiteVisitBookingSerializer,
    SiteVisitScheduleManagementSerializer,
    SiteVisitBookingManagementSerializer,
)

class SiteVisitScheduleListAPIView(
    generics.ListAPIView
):
    serializer_class = SiteVisitScheduleSerializer

    def get_queryset(self):
        return SiteVisitSchedule.objects.filter(
            active=True
        ).select_related(
            "real_estate_property"
        )


class SiteVisitScheduleManagementListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = SiteVisitScheduleManagementSerializer
    permission_classes = [IsAdminUser]
    queryset = SiteVisitSchedule.objects.select_related("real_estate_property")


class SiteVisitScheduleManagementDetailAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = SiteVisitScheduleManagementSerializer
    permission_classes = [IsAdminUser]
    queryset = SiteVisitSchedule.objects.select_related("real_estate_property")


class SiteVisitBookingManagementListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = SiteVisitBookingManagementSerializer
    permission_classes = [IsAdminUser]
    queryset = SiteVisitBooking.objects.select_related(
        "schedule", "schedule__real_estate_property"
    )

    def perform_create(self, serializer):
        schedule_id = serializer.validated_data["schedule"].pk
        with transaction.atomic():
            schedule = SiteVisitSchedule.objects.select_for_update().get(pk=schedule_id)
            if not schedule.active or schedule.remaining_slots <= 0:
                raise ValidationError({"schedule": "This viewing time is unavailable or fully booked."})
            serializer.save(schedule=schedule)


class SiteVisitBookingManagementDetailAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = SiteVisitBookingManagementSerializer
    permission_classes = [IsAdminUser]
    queryset = SiteVisitBooking.objects.select_related(
        "schedule", "schedule__real_estate_property"
    )


from .services import (
    send_site_visit_notification,
    send_site_visit_confirmation,
)

logger = logging.getLogger(__name__)


class SiteVisitBookingCreateAPIView(
    generics.CreateAPIView
):
    queryset = SiteVisitBooking.objects.all()
    serializer_class = SiteVisitBookingSerializer
    # Public bookings are independent of any CMS session in the browser.
    authentication_classes = []
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "site_visit_booking"

    def perform_create(self, serializer):
        schedule_id = serializer.validated_data["schedule"].pk
        with transaction.atomic():
            schedule = SiteVisitSchedule.objects.select_for_update().get(
                pk=schedule_id
            )
            if not schedule.active or schedule.remaining_slots <= 0:
                raise ValidationError({
                    "schedule": "This site visit is no longer available for booking."
                })
            booking = serializer.save(schedule=schedule)

        # Persist the booking even if the mail provider is temporarily unavailable.
        try:
            send_site_visit_notification(booking)
        except Exception:
            logger.exception(
                "Could not send team notification for site visit booking %s",
                booking.pk,
            )
        try:
            send_site_visit_confirmation(booking)
        except Exception:
            logger.exception(
                "Could not send visitor confirmation for site visit booking %s",
                booking.pk,
            )
