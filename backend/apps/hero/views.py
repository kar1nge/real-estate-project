from rest_framework import generics
from rest_framework.permissions import IsAdminUser

from .models import HeroSlide
from .serializers import HeroSlideSerializer


class HeroSlideListAPIView(
    generics.ListAPIView
):
    serializer_class = HeroSlideSerializer

    def get_queryset(self):
        return HeroSlide.objects.filter(
            is_active=True
        )


class HeroSlideDetailAPIView(
    generics.RetrieveAPIView
):
    serializer_class = HeroSlideSerializer

    queryset = HeroSlide.objects.filter(
        is_active=True
    )


class HeroSlideManagementListCreateAPIView(
    generics.ListCreateAPIView
):
    serializer_class = HeroSlideSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return HeroSlide.objects.all()


class HeroSlideManagementDetailAPIView(
    generics.RetrieveUpdateAPIView
):
    serializer_class = HeroSlideSerializer
    permission_classes = [IsAdminUser]

    queryset = HeroSlide.objects.all()
