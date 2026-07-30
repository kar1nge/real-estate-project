from django.conf import settings
from django.core.mail import send_mail


def send_inquiry_notification(inquiry):

    send_mail(
        subject=(
            f"New Inquiry | "
            f"{inquiry.subject}"
        ),
        message=(
            f"""
Dear Marketing Team,

A new inquiry has been submitted through the {settings.COMPANY_NAME} website.

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

{settings.COMPANY_NAME}
Automated Notification System
"""
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[settings.MARKETING_EMAIL],
        fail_silently=False,
    )


def send_inquiry_response_email(inquiry):

    send_mail(
        subject=(
            f"Response to Your Inquiry | "
            f"{settings.COMPANY_NAME}"
        ),
        message=(
            f"""
Dear {inquiry.name},

Thank you for contacting {settings.COMPANY_NAME}.

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

{settings.COMPANY_NAME}

Email:
{settings.COMPANY_EMAIL}

Phone:
{settings.COMPANY_PHONE}

{settings.COMPANY_ADDRESS}
"""
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[inquiry.email],
        fail_silently=False,
    )