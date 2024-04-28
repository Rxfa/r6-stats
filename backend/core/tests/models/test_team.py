from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.test import TestCase
from core.factories import TeamFactory, RoundFactory
from core.models import Team


class TeamTests(TestCase):

    def test_team_is_valid(self):
        team = TeamFactory()
        team.full_clean()
        self.assertEqual(Team.objects.count(), 1)

    def test_team_cannot_be_own_twice_in_the_same_round(self):
        round = RoundFactory()
        team = TeamFactory(is_own=True, round=round)
        team.full_clean()
        with self.assertRaises(IntegrityError):
            team2 = TeamFactory(is_own=True, round=round)
            team2.full_clean()

    def test_team_won_and_win_condition_is_null(self):
        team = TeamFactory(won=True, win_condition=None)
        with self.assertRaises(ValidationError):
            team.full_clean()

    def test_team_did_not_win_and_win_condition_not_null(self):
        team = TeamFactory(won=False, win_condition="Time")
        with self.assertRaises(ValidationError):
            team.full_clean()
