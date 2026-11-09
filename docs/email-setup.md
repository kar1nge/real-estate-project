# Email delivery (SMTP)

The site uses SMTP to send inquiry notifications, site-visit receipts, and booking confirmations. The Django settings already read the standard SMTP variables. Add these privately to `/opt/real-estate-project/.env` on the VPS; never commit or paste the password into chat.

```dotenv
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USE_TLS=False
EMAIL_USE_SSL=True
EMAIL_HOST_USER=karingemuniu@gmail.com
EMAIL_HOST_PASSWORD=PASTE_THE_GOOGLE_APP_PASSWORD_HERE
DEFAULT_FROM_EMAIL=NduKaWa Properties <karingemuniu@gmail.com>
COMPANY_EMAIL=karingemuniu2@gmail.com
EMAIL_TIMEOUT=20
```

Gmail's SMTP server is `smtp.gmail.com`; port 465 uses SSL. The sending Google account must have 2-Step Verification enabled before it can create an App Password. Use that App Password for `EMAIL_HOST_PASSWORD`, not the account's normal sign-in password. Google notes App Passwords may not be available for some account types or security configurations. [Google SMTP settings](https://support.google.com/mail/answer/7104828) · [Google App Passwords](https://support.google.com/accounts/answer/185833).

`COMPANY_EMAIL` is the address that receives inquiry and booking notifications; `EMAIL_HOST_USER` is the sender account used to authenticate. The sender password must be entered only into the private server `.env` file.

After saving the private `.env`, restart the app container, then send a test message from the project directory:

```bash
docker compose exec web python manage.py send_email_test your-address@example.com
```

The command reports whether SMTP accepted the message. Confirm delivery in the inbox and spam folder. If it fails, share the error type and your provider's SMTP host/port/encryption instructions, but do not share the password.
