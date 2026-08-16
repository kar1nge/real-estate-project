from rest_framework.generics import RetrieveAPIView

from .models import ContactSettings
from .serializers import ContactSettingsSerializer


class ContactSettingsView(RetrieveAPIView):
    serializer_class = ContactSettingsSerializer

    def get_object(self):
        return ContactSettings.objects.first()