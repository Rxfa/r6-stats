from rest_framework import status
from rest_framework.test import APITestCase

from core.factories import RoundFactory, UserFactory, ReplayFactory, RoundReplayFactory


class RoundViewSetTests(APITestCase):

    def setUp(self):
        self.user = UserFactory()
        self.url = "http://localhost:8000/rounds/"
        self.client.force_authenticate(user=self.user)

    def test_list_rounds(self):
        replay = ReplayFactory(uploaded_by=self.user)
        round_replay = RoundReplayFactory(replay=replay)
        RoundFactory(replay=round_replay)

        url = self.url
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['plays'], 1)

    def test_list_rounds_filtered_by_map(self):
        replay = ReplayFactory(uploaded_by=self.user)
        round_replay = RoundReplayFactory(replay=replay)
        played_round = RoundFactory(replay=round_replay)

        url = f"{self.url}?map={played_round.map}"
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['plays'], 1)

