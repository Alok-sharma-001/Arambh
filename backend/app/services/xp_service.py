class XPService:
    @staticmethod
    def calculate_level(total_xp: int) -> int:
        # Required XP = Current Level × 500
        # This is a bit tricky as a direct formula.
        # Level 1: 0-499
        # Level 2: 500-1499 (Level 1 req 500)
        # Level 3: 1500-2999 (Level 2 req 1000)
        # We can use a loop or a quadratic formula.
        level = 1
        xp_needed = level * 500
        while total_xp >= xp_needed:
            total_xp -= xp_needed
            level += 1
            xp_needed = level * 500
        return level

    @staticmethod
    def get_intelligence(level: int) -> int:
        # Every Level Up: +5 Intelligence
        # Level 1 starts with 10
        return 10 + (level - 1) * 5
