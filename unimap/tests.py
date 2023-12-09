from django.http import HttpRequest
from django.test import TestCase

import users.models
from .models import Location, Vote
from django.test import TestCase
from .views import *

# Create your tests here.

class LocationModelTests(TestCase):
    def setUp(self):
        self.location = Location(
            name="Test Location",
            description="This is a test location",
            longitude=-78.50340162710884,
            latitude=38.03564922306521
        )

        self.location.save()

        self.user = users.models.CustomUser(
            username="testuser",
            email="test@test.com",
            description="hello",
            status="user",
            is_admin=False
        )

        self.user.save()

        self.user.favorites.add(self.location)

        self.user.save()



    def test_location_str(self):
        """
        Test the __str__ method of the Location model
        """
        self.assertEqual(str(self.location), "Test Location")

    def test_location_creation(self):
        """
        Test if a Location object is created correctly
        """
        self.assertEqual(self.location.name, "Test Location")
        self.assertEqual(self.location.description, "This is a test location")
        self.assertEqual(self.location.longitude, -78.50340162710884)
        self.assertEqual(self.location.latitude, 38.03564922306521)


    def test_favorite(self):
        """
        Test if a Location object is favorited correctly
        """
        self.assertEqual(self.user.favorites.all().count(), 1)
        self.assertEqual(self.user.favorites.all().first(), self.location)


    def test_no_favorites(self):
        """
        Test if a Location object is unfavorited correctly
        """
        self.user.favorites.remove(self.location)
        self.assertEqual(self.user.favorites.all().count(), 0)
        self.assertEqual(self.user.favorites.all().first(), None)


class VoteModelTests(TestCase):
    def setUp(self):
        self.location = Location(
            name="Test Location",
            description="This is a test location",
            longitude=-78.50340162710884,
            latitude=38.03564922306521
        )

        self.location.save()

        self.user = users.models.CustomUser(
            username="testuser",
            email="test@test.com",
            description="hello",
            status="user",
            is_admin=False
        )

        self.user.save()


        self.vote = Vote(
            user=self.user,
            location=self.location,
            busyLevel=3
        )

        self.vote.save()

    def test_vote_str(self):
        """
        Test the __str__ method of the Vote model
        """
        self.assertEqual(str(self.vote), "testuser Test Location")

    def test_vote_creation(self):
        """
        Test if a Vote object is created correctly
        """
        self.assertEqual(self.vote.user, self.user)
        self.assertEqual(self.vote.location, self.location)
        self.assertEqual(self.vote.busyLevel, 3)


    def test_vote_update(self):
        """
        Test if a Vote object is updated correctly
        """
        self.vote.busyLevel = 4
        self.vote.save()
        self.assertEqual(self.vote.busyLevel, 4)

    def test_vote_deletion(self):
        """
        Test if a Vote object is deleted correctly
        """
        self.vote.delete()
        self.assertEqual(Vote.objects.all().count(), 0)


class UserTests(TestCase):
    def setUp(self):
        self.location = Location(
            name="Test Location",
            description="This is a test location",
            longitude=-78.50340162710884,
            latitude=38.03564922306521
        )

        self.location.save()

        self.user = users.models.CustomUser(
            username="testuser",
            email="test@test.com",
            description="hello",
            status="user",
            is_admin=False
        )

        self.user.save()

        self.vote = Vote(
            user=self.user,
            location=self.location,
            busyLevel=3
        )

        self.vote.save()

    def test_user_str(self):
        """
        Test the __str__ method of the User model
        """
        self.assertEqual(str(self.user), "testuser")

    def test_user_creation(self):
        """
        Test if a User object is created correctly
        """
        self.assertEqual(self.user.username, "testuser")
        self.assertEqual(self.user.email, "test@test.com")
        self.assertEqual(self.user.description, "hello")
        self.assertEqual(self.user.status, "user")
        self.assertEqual(self.user.is_admin, False)


    def test_user_update(self):
        """
        Test if a User object is updated correctly
        """
        self.user.username = "testuser2"
        self.user.email = "test2@test.com"
        self.user.description = "hello2"
        self.user.status = "admin"
        self.user.is_admin = True
        self.user.save()

        self.assertEqual(self.user.username, "testuser2")
        self.assertEqual(self.user.email, "test2@test.com")
        self.assertEqual(self.user.description, "hello2")
        self.assertEqual(self.user.status, "admin")
        self.assertEqual(self.user.is_admin, True)


    def test_user_deletion(self):
        """
        Test if a User object is deleted correctly
        """
        self.user.delete()
        self.assertEqual(users.models.CustomUser.objects.all().count(), 0)


class ViewTests(TestCase):
    def setUp(self):
        self.location = Location(
            name="Test Location",
            description="This is a test location",
            longitude=-78.50340162710884,
            latitude=38.03564922306521
        )

        self.location.save()

        self.user = users.models.CustomUser(
            username="testuser",
            email="test@test.com",
            description="hello",
            status="user",
            is_admin=False
        )

        self.user.save()

        self.vote = Vote(
            user=self.user,
            location=self.location,
            busyLevel=3
        )

        self.vote.save()

        # initialize a self.request object, with the self.user as a parameter
        self.request = HttpRequest()
        self.request.user = self.user


    def test_index(self):
        response = index(self.request)
        self.assertEqual(response.status_code, 200)

    def test_view_name(self):
        response = view_name(self.request)
        self.assertEqual(response.status_code, 200)


    def test_map_view(self):
        response = map_view(self.request)
        self.assertEqual(response.status_code, 200)

    def test_create_view(self):
        response = create_view(self.request)
        self.assertEqual(response.status_code, 200)


    def test_favorite_view(self):
        response = favorite_view(self.request)
        self.assertEqual(response.status_code, 200)


    def test_review_view(self):
        response = review_view(self.request)
        self.assertEqual(response.status_code, 200)


    def test_form_submission(self):
        self.request.POST = {
            'nameInput': 'Test Location',
            'descriptionInput': 'This is a test location',
            'latInput': 38.03564922306521,
            'lngInput': -78.50340162710884
        }

        response = form_submission(self.request)
        self.assertEqual(response.status_code, 302) # status code 302 signifies that the page has been redirected


    def test_verify_view(self):
        self.request.POST = {
            'nameInput': 'Test Location',
            'descriptionInput': 'This is a test location',
        }

        response = verify_view(self.request, self.location.pk)
        self.assertEqual(response.status_code, 302)



    def test_vote_view(self):
        self.request.POST = {
            'sliderLevel': [3]
        }

        response = vote_view(self.request, self.location.pk)
        self.assertEqual(response.status_code, 302)

    def test_edit_location(self):
        self.request.POST = {
            'nameInput': 'Test Location',
            'descriptionInput': 'This is a test location',
        }

        response = edit_location(self.request, self.location.pk)
        self.assertEqual(response.status_code, 302)


    def test_favorite_location(self):
        response = favorite_location(self.request, self.location.pk)

        # verify the user has one favorite
        self.assertEqual(self.user.favorites.all().count(), 1)
        self.assertEqual(response.status_code, 302)


    def test_unfavorite_location(self):
        response = unfavorite_location(self.request, self.location.pk)

        # verify the user has no favorites
        self.assertEqual(self.user.favorites.all().count(), 0)
        self.assertEqual(response.status_code, 302)
















