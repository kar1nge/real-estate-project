from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("hero", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="heroslide",
            name="starts_at",
            field=models.DateTimeField(
                blank=True,
                help_text="Optional time when this slide becomes visible.",
                null=True,
            ),
        ),
        migrations.AddField(
            model_name="heroslide",
            name="ends_at",
            field=models.DateTimeField(
                blank=True,
                help_text="Optional time when this slide is hidden automatically.",
                null=True,
            ),
        ),
    ]
