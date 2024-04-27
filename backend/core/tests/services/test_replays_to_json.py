from django.test import TestCase
from core.models import Player, Replay
from core.services.replays_to_json import ReplayToJsonService


class ReplaysToJsonTests(TestCase):
    round_file = open("core/tests/services/testFiles/round1_output.json", "r").read()
    replays_to_json = ReplayToJsonService(round_file)
    round = replays_to_json.transform()
    team, opp_team = (round.teams[1], round.teams[0]) if not round.teams[1].own_team else (round.teams[0], round.teams[1])

    def test_round_data(self):
        self.assertEqual(self.round.dateTime, "2023-03-13T20:39:47Z")
        self.assertEqual(self.round.match_id, "0ed632b3-1408-4a8b-8d9e-a0b50a68181a")
        self.assertEqual(self.round.number, 0)
        self.assertEqual(self.round.recordingPlayerId, "926a3b79-3b1f-4571-98ce-a253a834e638")
        self.assertEqual(self.round.map, "ThemePark")
        self.assertEqual(self.round.site, "1F Armory, 1F Throne Room")
        self.assertEqual(self.round.score.own, 0)
        self.assertEqual(self.round.score.opp, 1)
        self.assertIsNone(self.round.own_bans)
        self.assertIsNone(self.round.opp_bans)

    def test_team_data(self):
        self.assertFalse(self.team.own_team)
        self.assertEqual(self.team.score, 1)
        self.assertTrue(self.team.won)
        self.assertEqual(self.team.win_condition, "Time")
        self.assertEqual(self.team.side, "Defense")
        expected_players = {"BriD.BDS", "Renshiro.BDS", "Shaiiko.BDS", "Elemzje.BDS", "LikEfac.BDS"}
        actual_players = self.team.players.keys()
        self.assertEqual(expected_players, expected_players.intersection(actual_players))

    def test_player_data(self):
        player_name = "BriD.BDS"
        player = self.team.players[player_name]
        self.assertEqual(player.name, player_name)
        self.assertEqual(player.uid, "c12cc905-3402-4a0f-a511-65e4452d234c")
        self.assertEqual(player.spawn, "1F Armory, 1F Throne Room")
        self.assertEqual(player.operator, "Mute")
        self.assertEqual(player.kills, 2)
        self.assertEqual(player.assists, 0)
        self.assertEqual(player.headshots, 1)
        self.assertFalse(player.died)
        self.assertFalse(player.opening_kill)
        self.assertFalse(player.opening_death)
        self.assertFalse(player.entry_kill)
        self.assertFalse(player.entry_death)
        self.assertFalse(player.traded)
        self.assertFalse(player.refragged)
        self.assertFalse(player.planted)
        self.assertIsNone(player.time_of_plant)
        self.assertFalse(player.disabled)
        self.assertIsNone(player.time_of_disable)
        self.assertIsNone(player.time_of_disable)
        self.assertTrue(player.multikill)

    def test_refrags(self):
        player = self.team.players["Elemzje.BDS"]
        self.assertTrue(player.refragged)

    def test_trades(self):
        player = self.team.players["Shaiiko.BDS"]
        self.assertTrue(player.traded)

    def test_openings(self):
        self.assertTrue(self.opp_team.players["Blurr.G2"].opening_kill)
        self.assertTrue(self.team.players["Shaiiko.BDS"].opening_death)

    def test_entries(self):
        self.assertTrue(self.team.players["Elemzje.BDS"].entry_kill)
        self.assertTrue(self.team.players["Shaiiko.BDS"].entry_death)
        self.assertTrue(self.opp_team.players["Blurr.G2"].entry_kill)
        self.assertTrue(self.opp_team.players["DOKIsan.G2"].entry_death)
