from app.services.xp_service import XPService

def test_calculate_level():
    assert XPService.calculate_level(0) == 1
    assert XPService.calculate_level(499) == 1
    assert XPService.calculate_level(500) == 2
    assert XPService.calculate_level(1499) == 2
    assert XPService.calculate_level(1500) == 3

def test_get_intelligence():
    assert XPService.get_intelligence(1) == 10
    assert XPService.get_intelligence(2) == 15
    assert XPService.get_intelligence(3) == 20
