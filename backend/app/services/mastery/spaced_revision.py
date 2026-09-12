from datetime import datetime, timedelta


def schedule_revision(mastery):

    if mastery <= 40:
        days = 0

    elif mastery <= 60:
        days = 1

    elif mastery < 80:
        days = 3

    else:
        days = 7

    revision_date = datetime.now() + timedelta(days=days)

    return {
        "mastery": mastery,
        "revision_date": revision_date.date().isoformat(),
        "days_until_revision": days
    }