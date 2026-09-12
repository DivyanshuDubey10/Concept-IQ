from backend.app.services.adaptive.adaptive_engine import get_progress



def test_high_accuracy():
    assert get_progress(2, 90) == 3


def test_low_accuracy():
    assert get_progress(2, 30) == 1


def test_medium_accuracy():
    assert get_progress(2, 60) == 2


def test_hard_stays_hard():
    assert get_progress(3, 90) == 3


def test_easy_stays_easy():
    assert get_progress(1, 30) == 1