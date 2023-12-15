from datetime import timedelta
from faker import Faker
from django.test import TestCase
from django.core.exceptions import ValidationError
from .models import Game
from .factories import UserFactory, TeamFactory, PlayerFactory, RoundFactory, GameFactory

faker = Faker()


class RoundTests(TestCase):
    def setUp(self):
        self.match_id = GameFactory()

    def test_match_id_cant_be_same_as_number_more_than_once(self):
        team = TeamFactory()
        team.full_clean()
        team2 = TeamFactory()
        with self.assertRaises(ValidationError):
            team2.full_clean()


class PlayerTests(TestCase):

    def test_player_cant_have_more_kills_than_assists(self):
        player = PlayerFactory(assists=1, kills=0)
        with self.assertRaises(ValidationError):
            player.full_clean()

    def test_player_cant_have_more_headshots_than_kills(self):
        player = PlayerFactory(headshots=1, kills=0)
        with self.assertRaises(ValidationError):
            player.full_clean()

    def test_player_cant_have_opening_kill_and_not_entry_kill_at_the_same_time(self):
        player = PlayerFactory(opening_kill=True, entry_kill=False)
        with self.assertRaises(ValidationError):
            player.full_clean()

    def test_player_cant_have_opening_death_and_not_entry_death_at_the_same_time(self):
        player = PlayerFactory(opening_death=True, entry_death=False)
        with self.assertRaises(ValidationError):
            player.full_clean()

    def test_player_cant_plant_after_180_seconds(self):
        player = PlayerFactory(planted=True, time_of_plant=181)
        with self.assertRaises(ValidationError):
            player.full_clean()

    def test_player_cant_disable_after_180_seconds(self):
        player = PlayerFactory(disabled=True, time_of_disable=181)
        with self.assertRaises(ValidationError):
            player.full_clean()


class TeamTests(TestCase):
    def setUp(self) -> None:
        self.round = RoundFactory()

    def test_team_cant_be_own_twice_in_the_same_round(self):
        team = TeamFactory(is_own=True, round=self.round)
        team2 = TeamFactory(is_own=True, round=self.round)
        team.full_clean()
        with self.assertRaises(ValidationError):
            team.full_clean()
