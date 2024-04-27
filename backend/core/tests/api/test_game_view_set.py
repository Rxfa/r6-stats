from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from core.factories import RoundFactory, UserFactory, RoundReplayFactory, ReplayFactory
from core.models import Round


class GameViewSetTests(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.url = "http://localhost:8000/games/"
        self.client.force_authenticate(user=self.user)

    def test_list_games(self):
        replay = ReplayFactory(uploaded_by=self.user)
        round_replay = RoundReplayFactory(replay=replay)
        RoundFactory(replay=round_replay)
        url = self.url
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data),1)

    def test_list_games_with_map_query(self):
        replay = ReplayFactory(uploaded_by=self.user)
        round_replay = RoundReplayFactory(replay=replay)
        game = RoundFactory(replay=round_replay)
        url = f"{self.url}?map={game.map}"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_retrieve_game(self):
        replay = ReplayFactory(uploaded_by=self.user)
        round_replay = RoundReplayFactory(replay=replay)
        game = RoundFactory(replay=round_replay)
        url = f"{self.url}{game.match_id}/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_nonexistent_game(self):
        url = f"{self.url}nonexistent_match_id/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_destroy_game(self):
        replay = ReplayFactory(uploaded_by=self.user)
        round_replay = RoundReplayFactory(replay=replay)
        game = RoundFactory(replay=round_replay)
        url = f"{self.url}{game.match_id}/"
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_destroy_nonexistent_game(self):
        url = f"{self.url}nonexistent_match_id/"
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
