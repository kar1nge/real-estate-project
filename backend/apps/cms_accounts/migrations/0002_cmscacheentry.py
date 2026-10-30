from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("cms_accounts", "0001_initial")]

    operations = [
        migrations.CreateModel(
            name="CmsCacheEntry",
            fields=[
                ("cache_key", models.CharField(max_length=255, primary_key=True, serialize=False)),
                ("value", models.TextField()),
                ("expires", models.DateTimeField(db_index=True)),
            ],
            options={
                "verbose_name": "CMS cache entry",
                "verbose_name_plural": "CMS cache entries",
                "db_table": "cms_cache",
            },
        ),
    ]
