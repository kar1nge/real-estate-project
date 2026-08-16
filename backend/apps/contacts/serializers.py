from rest_framework import serializers

from .models import ContactSettings


class ContactSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSettings
        fields = [
            "name",
            "email",
            "phone",
            "whatsapp",
            "address",
            "google_maps",
            "instagram",
            "facebook",
            "twitter",
            "tiktok",
            "youtube",
        ]