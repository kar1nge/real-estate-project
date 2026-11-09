import logging

from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Inquiry
from .services import send_inquiry_response_email

logger = logging.getLogger(__name__)


@receiver(post_save, sender=Inquiry)
def send_response_email(
    sender,
    instance,
    created,
    **kwargs
):

    if (
        not created
        and instance.status == "answered"
        and instance.response
        and not instance.response_sent
    ):

        try:
            send_inquiry_response_email(instance)
        except Exception:
            logger.exception("Could not send response email for inquiry %s", instance.pk)
            return
        Inquiry.objects.filter(pk=instance.pk).update(response_sent=True)
        instance.response_sent = True
