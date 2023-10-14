import json
from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status

# Create your tests here.
class UserRegistrationAPIViewTestCase(APITestCase):
    """User registration Test Case"""
    
    url = "api/users"
    
    data = {
        "email": "test@test.com", 
        "username": "testUser33",
        "password": "Test244tfet4"
    }
    
    def test_create_account(self):
        """
        Ensure we can create a new user.
        """
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.filter(username="testUser33").exists(), True)
        
    def test_invalid_password(self):
        """
        Ensure we can't create a user if it has an invalid(too common) password.
        """
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    def test_unique_username(self):
        """
        Ensure we can't create a user if its username already exists.
        """
        data2 = {
            "email": "test2@test.com",
            "username": "testUser",
            "password": "Test@543242434@2dsda."
        }

        response = self.client.post(self.url, self.data)
        response2 = self.client.post(self.url, data2)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response2.status_code, status.HTTP_400_BAD_REQUEST)
        
class UserLoginAPIViewTestCase(APITestCase):
    """User login Test Case"""
    
    url = "api/token/login"
    
    def setUp(self):
        self.username = "Test"
        self.email = "test@test.com"
        self.password = "test_password_xD"
        self.user = User.objects.create_user(self.username, self.email, self.password)
    
    def test_valid_authentication(self):
        """
        Ensure we can login
        """
        response = self.client.post(self.url, self.user)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue("auth_token" in json.loads(response.content))
    
    def test_authentication_with_incorrect_password(self):
        """
        Ensure we cannot login if with an incorrect password
        """
        response = self.client.post(self.url, self.user)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_authentication_with_no_password(self):
        """
        Ensure we cannot login with no password
        """
        response = self.client.post(self.url, self.user)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
