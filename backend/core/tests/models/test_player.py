from django.test import TestCase
from django.core.exceptions import ValidationError
from core.factories import PlayerFactory


class PlayerTests(TestCase):

    def test_player_is_valid(self):
        player = PlayerFactory()
        player.full_clean()

    def test_player_cannot_have_more_than_five_kills(self):
        player = PlayerFactory(kills=6)
        with self.assertRaises(ValidationError):
            player.full_clean()

    def test_player_cannot_have_more_assists_than_5_less_kills(self):
        player = PlayerFactory(assists=3, kills=3)
        with self.assertRaises(ValidationError):
            player.full_clean()

    def test_player_cannot_have_more_headshots_than_kills(self):
        player = PlayerFactory(headshots=1, kills=0)
        with self.assertRaises(ValidationError):
            player.full_clean()

    def test_player_cannot_plant_and_disable(self):
        player = PlayerFactory(planted=True, disabled=True)
        with self.assertRaises(ValidationError):
            player.full_clean()

    def test_player_cant_have_opening_kill_and_not_entry_kill(self):
        player = PlayerFactory(opening_kill=True, entry_kill=False)
        with self.assertRaises(ValidationError):
            player.full_clean()

    def test_player_cant_have_opening_death_and_not_entry_death(self):
        player = PlayerFactory(opening_death=True, entry_death=False)
        with self.assertRaises(ValidationError):
            player.full_clean()

    def test_player_cannot_have_entry_kill_and_no_kills(self):
        player = PlayerFactory(entry_kill=True, kills=0)
        with self.assertRaises(ValidationError):
            player.full_clean()

    def test_player_cannot_have_entry_death_and_no_deaths(self):
        player = PlayerFactory(entry_death=True, died=False)
        with self.assertRaises(ValidationError):
            player.full_clean()

    def test_player_cannot_plant_and_not_have_time_of_plant(self):
        player = PlayerFactory(planted=True, time_of_plant=None)
        with self.assertRaises(ValidationError):
            player.full_clean()

    def test_player_cannot_disable_and_not_have_time_of_disable(self):
        player = PlayerFactory(disabled=True, time_of_disable=None)
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

    def test_player_refrags_and_does_not_have_kills(self):
        player = PlayerFactory(refragged=True, kills=0)
        with self.assertRaises(ValidationError):
            player.full_clean()

    def test_player_gets_traded_and_does_not_have_deaths(self):
        player = PlayerFactory(traded=True, died=False)
        with self.assertRaises(ValidationError):
            player.full_clean()

    def test_player_cannot_have_KOST_without_kills_planting_disabling_or_trading(self):
        player = PlayerFactory(kost=True, kills=0, planted=False, disabled=False, traded=False)
        with self.assertRaises(ValidationError):
            player.full_clean()

    def test_player_cannot_have_multikill_with_less_than_two_kills(self):
        player = PlayerFactory(multikill=True, kills=1)
        with self.assertRaises(ValidationError):
            player.full_clean()
