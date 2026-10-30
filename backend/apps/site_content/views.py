from rest_framework import generics
from rest_framework.permissions import IsAdminUser

from .models import SitePage
from .serializers import SitePageSerializer


class SitePageDetailAPIView(generics.RetrieveAPIView):
    serializer_class = SitePageSerializer
    queryset = SitePage.objects.all()
    lookup_field = "slug"


class SitePageManagementListAPIView(generics.ListAPIView):
    serializer_class = SitePageSerializer
    permission_classes = [IsAdminUser]
    queryset = SitePage.objects.all()


class SitePageManagementDetailAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = SitePageSerializer
    permission_classes = [IsAdminUser]
    queryset = SitePage.objects.all()
    lookup_field = "slug"
