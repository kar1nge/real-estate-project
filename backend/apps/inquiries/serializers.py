from rest_framework import serializers
from .models import Inquiry


class InquirySerializer(serializers.ModelSerializer):

    class Meta:
        model = Inquiry
        fields = "__all__"
        read_only_fields = (
            "status",
            "created_at",
            "updated_at",
        )


class InquiryManagementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inquiry
        fields = "__all__"
        read_only_fields = (
            "id", "property", "name", "email", "phone", "subject",
            "message", "response_sent", "created_at", "updated_at",
        )
