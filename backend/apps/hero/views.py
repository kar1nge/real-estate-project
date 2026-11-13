from django.db.models import Q
from django.utils import timezone
from rest_framework import generics
from rest_framework.permissions import IsAdminUser

from .models import HeroSlide
from .serializers import HeroSlideSerializer


def currently_visible_hero_slides():
    now = timezone.now()
    return HeroSlide.objects.filter(is_active=True).filter(
        Q(starts_at__isnull=True) | Q(starts_at__lte=now),
        Q(ends_at__isnull=True) | Q(ends_at__gt=now),
    )


class HeroSlideListAPIView(
    generics.ListAPIView
):
    serializer_class = HeroSlideSerializer

    def get_queryset(self):
        return currently_visible_hero_slides()


class HeroSlideDetailAPIView(
    generics.RetrieveAPIView
):
    serializer_class = HeroSlideSerializer

    def get_queryset(self):
        return currently_visible_hero_slides()


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
