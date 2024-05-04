from rest_framework import status
from rest_framework.test import APITestCase, APIRequestFactory

from core.factories import UserFactory, PlayerFactory


class IndividualViewSetTestCase(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.url = "http://localhost:8000/individual/"
        self.client.force_authenticate(user=self.user)

    def test_list_individual_stats(self):
        url = self.url
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
