from django.test import TestCase
from .models import CustomUser

# Create your tests here.

class CustomUserModelTests(TestCase):
    def test_create_custom_user(self):
        """
        Test if a CustomUser object can be created with the expected attributes.
        """
        user = CustomUser.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword',
            status='user',  # or 'admin' if you want to create an admin user
            description='Test description',
            is_admin=False  # or True if you want to create an admin user
        )

        self.assertEqual(user.username, 'testuser')
        self.assertEqual(user.email, 'test@example.com')
        self.assertEqual(user.status, 'user')  # Check the default status value
        self.assertEqual(user.description, 'Test description')
        self.assertEqual(user.is_admin, False)  # Check the default is_admin value

    def test_custom_user_str(self):
        """
        Test the __str__ method of the CustomUser model.
        """
        user = CustomUser.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword',
            status='user',
            description='Test description',
            is_admin=False
        )

        self.assertEqual(str(user), 'testuser')