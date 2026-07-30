from rest_framework import generics

from .models import (
    SiteVisitSchedule,
    SiteVisitBooking,
)

from .serializers import (
    SiteVisitScheduleSerializer,
    SiteVisitBookingSerializer,
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


from .services import (
    send_site_visit_notification,
    send_site_visit_confirmation,
)


class SiteVisitBookingCreateAPIView(
    generics.CreateAPIView
):
    queryset = SiteVisitBooking.objects.all()
    serializer_class = SiteVisitBookingSerializer

    def perform_create(self, serializer):

        booking = serializer.save()

        send_site_visit_notification(
            booking
        )

        send_site_visit_confirmation(
            booking
        )