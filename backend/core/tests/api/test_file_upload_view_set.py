import uuid

from rest_framework import status
from rest_framework.test import APITestCase

from core.factories import ReplayFactory, UserFactory
from core.models import Replay


class FileUploadViewSetTests(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.url = "http://localhost:8000/replays/"
        self.replay_path = (
            "core/tests/services/testFiles/Match-2023-03-13_20-38-04-22/Match-2023-03-13_20-38-04-22-R01.rec"
        )
        self.client.force_authenticate(user=self.user)

    def test_list_replays(self):
        url = self.url
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_replays(self):
        url = self.url
        # Assuming you have test files in your fixtures folder
        with open(self.replay_path, 'rb') as file:
            data = {'rounds': [file]}
            response = self.client.post(url, data, format='multipart')
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_replays_invalid_data(self):
        url = self.url
        data = {}  # Invalid data
        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_replays_existing_round(self):
        url = self.url
        # Create a round replay before attempting to create it again
        with open(self.replay_path, 'rb') as file:
            data = {'rounds': [file]}
            self.client.post(url, data, format='multipart')

        with open(self.replay_path, 'rb') as file:
            data = {'rounds': [file]}
            response = self.client.post(url, data, format='multipart')
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_destroy_replay(self):
        # Create a replay before attempting to delete it
        ReplayFactory(uploaded_by=self.user)
        url = f"{self.url}{Replay.objects.first().uuid}/"
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_destroy_nonexistent_replay(self):
        url = f"{self.url}{uuid.uuid4()}/"
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)