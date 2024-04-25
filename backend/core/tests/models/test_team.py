from django.db import IntegrityError
from faker import Faker
from django.test import TestCase
from django.core.exceptions import ValidationError
from core.factories import TeamFactory, PlayerFactory, RoundFactory


class TeamTests(TestCase):

    def test_team_cant_be_own_twice_in_the_same_round(self):
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

    def test_team_didnt_win_and_win_condition_not_null(self):
        team = TeamFactory(won=False, win_condition="Time")
        with self.assertRaises(ValidationError):
            team.full_clean()
