import requests
import unittest

class TestIntegration(unittest.TestCase):
    def test_signup(self):
        # Test the signup flow
        url = "http://localhost:3000/api/signup"
        data = {
            "username": "testuser",
            "email": "testuser@example.com",
            "password": "testpassword"
        }
        response = requests.post(url, json=data)
        self.assertEqual(response.status_code, 200)
        self.assertIn("access_token", response.json())
        
    def test_login(self):
        # Test the login flow
        url = "http://localhost:3000/api/login"
        data = {
            "username": "testuser",
            "password": "testpassword"
        }
        response = requests.post(url, json=data)
        self.assertEqual(response.status_code, 200)
        self.assertIn("access_token", response.json())
        
    def test_create_post(self):
        # Test creating a post
        url = "http://localhost:3000/api/posts"
        data = {
            "title": "Test Post",
            "content": "This is a test post"
        }
        headers = {
            "Authorization": "Bearer <access_token>"
        }
        response = requests.post(url, json=data, headers=headers)
        self.assertEqual(response.status_code, 200)
        self.assertIn("id", response.json())
