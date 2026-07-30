from django.urls import path

from .views import (
    SiteVisitScheduleListAPIView,
    SiteVisitBookingCreateAPIView,
)

urlpatterns = [
    path(
        "schedules/",
        SiteVisitScheduleListAPIView.as_view(),
        name="site-visit-schedules",
    ),

    path(
        "book/",
        SiteVisitBookingCreateAPIView.as_view(),
        name="site-visit-book",
    ),
]