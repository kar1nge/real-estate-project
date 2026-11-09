from django.urls import path

from .views import (
    SiteVisitScheduleListAPIView,
    SiteVisitBookingCreateAPIView,
    SiteVisitScheduleManagementListCreateAPIView,
    SiteVisitScheduleManagementDetailAPIView,
    SiteVisitBookingManagementListCreateAPIView,
    SiteVisitBookingManagementDetailAPIView,
)

urlpatterns = [
    path("manage/schedules/", SiteVisitScheduleManagementListCreateAPIView.as_view(), name="site-visit-schedule-manage"),
    path("manage/schedules/<int:pk>/", SiteVisitScheduleManagementDetailAPIView.as_view(), name="site-visit-schedule-manage-detail"),
    path("manage/bookings/", SiteVisitBookingManagementListCreateAPIView.as_view(), name="site-visit-booking-manage"),
    path("manage/bookings/<int:pk>/", SiteVisitBookingManagementDetailAPIView.as_view(), name="site-visit-booking-manage-detail"),
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
