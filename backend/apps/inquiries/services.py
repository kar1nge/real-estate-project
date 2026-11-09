from django.conf import settings
from django.core.mail import send_mail

from apps.contacts.services import get_company_settings


def send_inquiry_notification(inquiry):

    company = get_company_settings()

    send_mail(
        subject=(
            f"New Inquiry | "
            f"{inquiry.subject}"
        ),
        message=(
            f"""
Dear Marketing Team,

A new inquiry has been submitted through the {company.name} website.

Inquiry Details
--------------------------------------------------
Name:
{inquiry.name}

Email:
{inquiry.email}

Phone:
{inquiry.phone}

Property:
{inquiry.property if inquiry.property else "General Inquiry"}

Subject:
{inquiry.subject}

Message:
{inquiry.message}

Kind Regards,

{company.name}
Automated Notification System
"""
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[settings.MARKETING_EMAIL or company.email],
        fail_silently=False,
    )


def send_inquiry_response_email(inquiry):

    company = get_company_settings()

    send_mail(
        subject=(
            f"Response to Your Inquiry | "
            f"{company.name}"
        ),
        message=(
            f"""
Dear {inquiry.name},

Thank you for contacting {company.name}.

Your Inquiry
--------------------------------------------------
Subject:
{inquiry.subject}

Property:
{inquiry.property if inquiry.property else "General Inquiry"}

Message:
{inquiry.message}

Our Response
--------------------------------------------------
{inquiry.response}

If you have any additional questions, please feel free to contact us.

Kind Regards,

{company.name}

Email:
{company.email}

Phone:
{company.phone}

{company.address}
"""
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[inquiry.email],
        fail_silently=False,
    )
