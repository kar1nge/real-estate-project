import logging

from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.throttling import ScopedRateThrottle

from .models import Inquiry
from .serializers import InquirySerializer
from .services import (
    send_inquiry_notification,
    )

logger = logging.getLogger(__name__)


class InquiryCreateAPIView(generics.CreateAPIView):

    queryset = Inquiry.objects.all()
    serializer_class = InquirySerializer
    # Public form submissions must not inherit a staff session's CSRF
    # requirement when a visitor shares a browser with a CMS user.
    authentication_classes = []
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "inquiry_creation"

    def perform_create(self, serializer):

        inquiry = serializer.save()

        try:
            send_inquiry_notification(inquiry)
        except Exception:
            logger.exception("Could not send email for inquiry %s", inquiry.pk)

        

class InquiryListAPIView(generics.ListAPIView):

    queryset = Inquiry.objects.all()
    serializer_class = InquirySerializer
    permission_classes = [IsAdminUser]
