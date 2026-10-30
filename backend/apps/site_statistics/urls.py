from django.urls import path

from .views import (
    StatisticListAPIView,
    StatisticManagementDetailAPIView,
    StatisticManagementListCreateAPIView,
)

urlpatterns = [
    path("", StatisticListAPIView.as_view(), name="statistics-list"),
    path("manage/", StatisticManagementListCreateAPIView.as_view(), name="statistics-manage"),
    path("manage/<int:pk>/", StatisticManagementDetailAPIView.as_view(), name="statistics-manage-detail"),
]
