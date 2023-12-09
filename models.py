from django.db import models
from django_google_maps import fields as map_fields
from django.utils import timezone

# REFERENCES: MODEL https://www.youtube.com/watch?v=ERCt6HUcaFw&ab_channel=NetNinja

# not using this model, but keeping it for the form where user recommends a location (forms.py)
class Rental(models.Model):
    address = map_fields.AddressField(max_length=200)
    geolocation = map_fields.GeoLocationField(max_length=100)

    def __str__(self):
        return self.address


# models a location on the map
class Location(models.Model):
    name = models.CharField(max_length = 50 )
    description = models.CharField(max_length = 300 )
    # geolocation = map_fields.GeoLocationField(max_length=100)
    latitude = models.FloatField(default=0)
    longitude = models.FloatField(default=0)
    verified = models.BooleanField(default=False)

    vote1 = models.IntegerField(default=0)
    vote2 = models.IntegerField(default=0)
    vote3 = models.IntegerField(default=0)
    vote4 = models.IntegerField(default=0)
    vote5 = models.IntegerField(default=0)

    def __str__(self):
        return self.name


# models a vote for a location on the map
class Vote(models.Model):
    user = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE)
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    busyLevel = models.IntegerField(default=0)
    date = models.DateTimeField(auto_now_add=True)
    # comment = models.CharField(max_length = 300, blank=True)

    def __str__(self):
        return self.user.username + " " + self.location.name
