from rest_framework import generics
from rest_framework.permissions import IsAdminUser

from .models import Statistic
from .serializers import StatisticSerializer


class StatisticListAPIView(generics.ListAPIView):
    serializer_class = StatisticSerializer
    queryset = Statistic.objects.filter(is_active=True)


class StatisticManagementListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = StatisticSerializer
    permission_classes = [IsAdminUser]
    queryset = Statistic.objects.all()


class StatisticManagementDetailAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = StatisticSerializer
    permission_classes = [IsAdminUser]
    queryset = Statistic.objects.all()
