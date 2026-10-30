from rest_framework import serializers

from .models import SitePage


class SitePageSerializer(serializers.ModelSerializer):
    class Meta:
        model = SitePage
        fields = ("slug", "eyebrow", "title", "lead", "body", "sections", "updated_at")
