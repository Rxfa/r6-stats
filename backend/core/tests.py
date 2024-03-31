from datetime import timedelta

from django.db import IntegrityError
from faker import Faker
from django.test import TestCase
from django.core.exceptions import ValidationError
from .factories import TeamFactory, PlayerFactory, RoundFactory

faker = Faker()


class RoundTests(TestCase):
    def setUp(self):
        self.match_id = faker.name()
        self.number = faker.pyint(min_value=0)

    def test_match_id_cant_be_same_as_number_more_than_once(self):
        round = RoundFactory(match_id=self.match_id, number=self.number)
        round.full_clean()
        with self.assertRaises(IntegrityError):
            round2 = RoundFactory(match_id=self.match_id, number=self.number)
            round2.full_clean()


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

    def test_player_refrags_and_doesnt_kill(self):
        player = PlayerFactory(refragged=True, kills=0)
        with self.assertRaises(ValidationError):
            player.full_clean()

    def test_player_gets_traded_and_doesnt_die(self):
        player = PlayerFactory(traded=True, died=False)
        with self.assertRaises(ValidationError):
            player.full_clean()


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
