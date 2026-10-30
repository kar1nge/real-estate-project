from django.urls import path

from .views import (
    SitePageDetailAPIView,
    SitePageManagementDetailAPIView,
    SitePageManagementListAPIView,
)

urlpatterns = [
    path("manage/", SitePageManagementListAPIView.as_view(), name="site-pages-manage"),
    path("manage/<slug:slug>/", SitePageManagementDetailAPIView.as_view(), name="site-page-manage-detail"),
    path("<slug:slug>/", SitePageDetailAPIView.as_view(), name="site-page-detail"),
]
