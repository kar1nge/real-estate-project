from django.urls import path

from .views import (
    TeamMemberListAPIView,
    TeamMemberDetailAPIView,
)

urlpatterns = [
    path(
        "",
        TeamMemberListAPIView.as_view(),
    ),

    path(
        "<int:pk>/",
        TeamMemberDetailAPIView.as_view(),
    ),
]