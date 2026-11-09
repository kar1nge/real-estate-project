import logging

from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import SiteVisitBooking
from .services import send_visit_confirmed_email

logger = logging.getLogger(__name__)


@receiver(post_save, sender=SiteVisitBooking)
def send_confirmation_email(
    sender,
    instance,
    created,
    **kwargs
):

    if (
        not created
        and instance.status == "confirmed"
        and not instance.confirmation_sent
    ):

        try:
            send_visit_confirmed_email(instance)
        except Exception:
            logger.exception("Could not send confirmation for site visit booking %s", instance.pk)
            return
        SiteVisitBooking.objects.filter(pk=instance.pk).update(confirmation_sent=True)
        instance.confirmation_sent = True
