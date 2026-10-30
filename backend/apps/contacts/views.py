from rest_framework.generics import RetrieveAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import IsAdminUser

from .models import ContactSettings
from .serializers import ContactSettingsSerializer


class ContactSettingsView(RetrieveAPIView):
    serializer_class = ContactSettingsSerializer

    def get_object(self):
        return ContactSettings.objects.first()


class CompanySettingsManagementView(RetrieveUpdateAPIView):
    serializer_class = ContactSettingsSerializer
    permission_classes = [IsAdminUser]

    def get_object(self):
        return ContactSettings.objects.first()