from django.urls import path

from .views import (
    TeamMemberListAPIView,
    TeamMemberDetailAPIView,
    TeamMemberManagementListAPIView,
    TeamMemberManagementDetailAPIView,
)

urlpatterns = [
    path("manage/", TeamMemberManagementListAPIView.as_view()),
    path("manage/<int:pk>/", TeamMemberManagementDetailAPIView.as_view()),
    path(
        "",
        TeamMemberListAPIView.as_view(),
    ),

    path(
        "<int:pk>/",
        TeamMemberDetailAPIView.as_view(),
    ),
]
