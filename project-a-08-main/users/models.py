"""
Citations:
https://www.youtube.com/watch?v=mndLkCEiflg&ab_channel=CodeWithStein
"""

from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):

    STATUS = (
        ('user', 'User'), # Regular User
        ('admin', 'Admin'), # Admin User
    )

    email = models.EmailField(unique=True)
    status = models.CharField(max_length=100, choices=STATUS, default='regular')
    description = models.TextField('Description', max_length=600, default='', blank=True)
    is_admin = models.BooleanField(default=False)
    favorites = models.ManyToManyField('unimap.Location', blank=True)

    def __str__(self):
        return self.username
