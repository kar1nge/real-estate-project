from django.db import migrations, models


def seed_statistics(apps, schema_editor):
    Statistic = apps.get_model("site_statistics", "Statistic")
    for order, label, value, suffix in [
        (1, "Years of Experience", 15, "+"),
        (2, "Homes Delivered", 240, "+"),
        (3, "Prime Locations", 12, ""),
        (4, "Client Satisfaction", 96, "%"),
    ]:
        Statistic.objects.update_or_create(
            label=label, defaults={"value": value, "suffix": suffix, "display_order": order, "is_active": True}
        )


class Migration(migrations.Migration):
    initial = True
    dependencies = []
    operations = [
        migrations.CreateModel(
            name="Statistic",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("label", models.CharField(max_length=120)),
                ("value", models.PositiveIntegerField()),
                ("suffix", models.CharField(blank=True, max_length=12)),
                ("display_order", models.PositiveIntegerField(default=1)),
                ("is_active", models.BooleanField(default=True)),
            ],
            options={"ordering": ("display_order", "id"), "verbose_name_plural": "statistics"},
        ),
        migrations.RunPython(seed_statistics, migrations.RunPython.noop),
    ]
