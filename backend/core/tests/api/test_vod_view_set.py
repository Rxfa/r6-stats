from rest_framework import status
from rest_framework.test import APITestCase, APITransactionTestCase

from core.factories import VodFactory, UserFactory, faker


class VodViewSet(APITransactionTestCase):

    def setUp(self):
        self.user = UserFactory()
        self.url = "http://localhost:8000/vods/"
        self.client.force_authenticate(user=self.user)

    def test_list_vods(self):
        VodFactory(user=self.user)
        url = self.url
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_vod(self):
        data = {
            "url": "https://www.youtube.com/watch?v=123",
            "against": "testName"
        }

        url = self.url
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['message'], 'Vod uploaded successfully')

    def test_update_vod(self):
        vod = VodFactory(user=self.user)
        data = {
            "url": "https://www.youtube.com/watch?v=123",
            "against": "testName"
        }

        url = f"{self.url}{vod.id}/"
        response = self.client.put(url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, "Vod updated successfully")

    def test_update_vod_not_found(self):
        data = {
            "url": "https://www.youtube.com/watch?v=123",
            "against": "testName"
        }

        url = f"{self.url}1/"
        response = self.client.put(url, data)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'], "Vod not found")

    def test_destroy_vod(self):
        vod = VodFactory(user=self.user)

        url = f"{self.url}{vod.id}/"
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_destroy_vod_not_found(self):
        url = f"{self.url}1/"
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'], "Vod not found")
