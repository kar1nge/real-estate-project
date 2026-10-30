import re

from django.db import migrations, models


def split_legal_pages(apps, schema_editor):
    SitePage = apps.get_model("site_content", "SitePage")
    database = schema_editor.connection.alias

    for page in SitePage.objects.using(database).filter(slug__in=("privacy", "terms")):
        sections = []
        paragraphs = [
            part.strip()
            for part in re.split(r"\n\s*\n", page.body or "")
            if part.strip()
        ]
        for paragraph in paragraphs:
            lines = paragraph.splitlines()
            first_line = lines[0].strip()
            match = re.match(r"^\s*\d+[.)]\s*(.+?)\s*$", first_line)
            if match:
                heading = match.group(1)
                body = "\n".join(lines[1:]).strip()
            elif len(lines) > 1:
                heading = first_line
                body = "\n".join(lines[1:]).strip()
            else:
                heading = "Draft notice"
                body = paragraph

            sections.append({"heading": heading, "body": body})

        page.sections = sections
        page.save(update_fields=("sections",), using=database)


class Migration(migrations.Migration):
    dependencies = [("site_content", "0001_initial")]

    operations = [
        migrations.AddField(
            model_name="sitepage",
            name="sections",
            field=models.JSONField(
                blank=True,
                default=list,
                help_text="Structured legal sections, each with a heading and body.",
            ),
        ),
        migrations.RunPython(split_legal_pages, migrations.RunPython.noop),
    ]
