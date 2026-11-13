from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("properties", "0010_propertyimage_is_active"),
    ]

    operations = [
        migrations.AddField(
            model_name="property",
            name="available_units",
            field=models.PositiveIntegerField(
                default=1,
                help_text="Set to 0 when all units have been sold.",
            ),
        ),
    ]
