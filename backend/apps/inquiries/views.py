from rest_framework import generics

from .models import Inquiry
from .serializers import InquirySerializer
from .services import (
    send_inquiry_notification,
    )


class InquiryCreateAPIView(generics.CreateAPIView):

    queryset = Inquiry.objects.all()
    serializer_class = InquirySerializer

    def perform_create(self, serializer):

        inquiry = serializer.save()

        send_inquiry_notification(
            inquiry
        )

        

class InquiryListAPIView(generics.ListAPIView):

    queryset = Inquiry.objects.all()
    serializer_class = InquirySerializer