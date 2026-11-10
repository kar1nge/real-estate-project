from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("faqs", "0001_initial"),
        ("inquiries", "0003_inquiry_response_inquiry_response_sent"),
    ]

    operations = [
        migrations.AddField(
            model_name="inquiry",
            name="faq_category",
            field=models.CharField(
                choices=[("general", "General"), ("buying", "Buying"),
                         ("renting", "Renting"), ("site_visits", "Site Visits"),
                         ("properties", "Properties"), ("legal", "Legal"),
                         ("support", "Support")],
                default="general",
                max_length=50,
            ),
        ),
        migrations.AddField(
            model_name="inquiry",
            name="publish_to_faq",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="inquiry",
            name="published_faq",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="source_inquiries",
                to="faqs.faq",
            ),
        ),
    ]
