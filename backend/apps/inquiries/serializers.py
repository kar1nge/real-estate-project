from rest_framework import serializers
from .models import Inquiry


class InquirySerializer(serializers.ModelSerializer):

    class Meta:
        model = Inquiry
        fields = "__all__"
        read_only_fields = (
            "status", "response", "response_sent", "publish_to_faq",
            "published_faq",
            "created_at",
            "updated_at",
        )


class InquiryManagementSerializer(serializers.ModelSerializer):
    faq_category_display = serializers.CharField(source="get_faq_category_display", read_only=True)

    class Meta:
        model = Inquiry
        fields = "__all__"
        read_only_fields = (
            "id", "property", "name", "email", "phone", "subject",
            "message", "faq_category", "faq_category_display", "response_sent",
            "published_faq", "created_at", "updated_at",
        )
