from django.contrib import messages
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.views.generic import FormView
from .models import Location, Vote
from django.shortcuts import render, get_object_or_404, redirect
from django.core import serializers
from django.utils import timezone
import json
from django.shortcuts import redirect



from . import forms


def index(request):
    return render(request, 'unimap.html', {})

def view_name(request):
    return render(request, 'unimap.html', {})

def login_redirect(request):
    return redirect('social:begin', backend='google-oauth2')

# Routes to the map
def map_view(request):
    if not request.user.is_authenticated:
        return render(request, 'unimap.html', {})

    favorite_locations = request.user.favorites.all().values_list('pk', flat=True)
    favorite_locations = json.dumps(list(favorite_locations))

    all_votes = Vote.objects.all()

    for vote in all_votes:
        if vote.date < timezone.now() - timezone.timedelta(hours=3):
            vote.delete()


    locations = Location.objects.filter(verified=True)
    # turns each location into a json dictionary, necessary for javascript parsing

    for location in locations:
        location.vote1 = all_votes.filter(location=location).filter(busyLevel=1).count()
        location.vote2 = all_votes.filter(location=location).filter(busyLevel=2).count()
        location.vote3 = all_votes.filter(location=location).filter(busyLevel=3).count()
        location.vote4 = all_votes.filter(location=location).filter(busyLevel=4).count()
        location.vote5 = all_votes.filter(location=location).filter(busyLevel=5).count()


    locations = serializers.serialize('json', locations)


    return render(request, 'map.html', {'locations': locations, 'favoriteLocations': favorite_locations})


def create_view(request):
    return render(request, 'create.html', {})


def favorite_view(request):
    return render(request, 'favorites.html', {})


def review_view(request):
    favorite_locations = request.user.favorites.all().values_list('pk', flat=True)
    favorite_locations = json.dumps(list(favorite_locations))


    all_votes = Vote.objects.all()

    for vote in all_votes:
        if vote.date < timezone.now() - timezone.timedelta(hours=3):
            vote.delete()


    locations = Location.objects.all()

    for location in locations:
        location.vote1 = all_votes.filter(location=location).filter(busyLevel=1).count()
        location.vote2 = all_votes.filter(location=location).filter(busyLevel=2).count()
        location.vote3 = all_votes.filter(location=location).filter(busyLevel=3).count()
        location.vote4 = all_votes.filter(location=location).filter(busyLevel=4).count()
        location.vote5 = all_votes.filter(location=location).filter(busyLevel=5).count()


    locations = serializers.serialize('json', locations)



    return render(request, 'review.html', {'locations': locations, 'favoriteLocations': favorite_locations})


def form_submission(request):
    print(request.POST)
    print(request.POST['nameInput'])

    #  check that 'nameInput', 'descriptionInput', 'latInput', and 'lngInput' are all defined
    if 'nameInput' in request.POST and 'descriptionInput' in request.POST and 'latInput' in request.POST and 'lngInput' in request.POST:
        # create a new location object
        new_location = Location(name=request.POST['nameInput'], description=request.POST['descriptionInput'], latitude=request.POST['latInput'], longitude=request.POST['lngInput'], verified=False)
        new_location.save()
        print("saved")

    return redirect('unimap:map_views')

def verify_view(request, pk):
    location = get_object_or_404(Location, pk=pk)

    if request.method == 'POST':
        # Change the verified field to True
        location.name = request.POST['nameInput']
        location.description = request.POST['descriptionInput']
        location.verified = True
        location.save()

    return redirect('unimap:map_views')


def delete_view(request, pk):
    location = get_object_or_404(Location, pk=pk)

    if request.method == 'POST':
        # Delete the location
        location.delete()

    return redirect('unimap:map_views')


def vote_view(request, location_id):
    print(request.POST)

    user = request.user
    location = get_object_or_404(Location, pk=location_id)
    busyLevel = int(request.POST['sliderLevel'][0])

    # check if the user has already voted for this location
    if Vote.objects.filter(user=user).filter(location=location).exists():
        # if so, delete the vote

        vote = Vote.objects.filter(user=user).filter(location=location).first()
        vote.delete()


    # create a Vote object
    new_vote = Vote(user=user, location=location, busyLevel=busyLevel)
    new_vote.save()




    return redirect('unimap:map_views')


def edit_location(request, location_id):
    location = get_object_or_404(Location, pk=location_id)

    location.name = request.POST['nameInput']
    location.description = request.POST['descriptionInput']
    location.save()

    return redirect('unimap:map_views')



def favorite_location(request, location_id):
    location = get_object_or_404(Location, pk=location_id)

    user = request.user
    user.favorites.add(location)
    user.save()

    return redirect('unimap:map_views')

def unfavorite_location(request, location_id):
    location = get_object_or_404(Location, pk=location_id)

    user = request.user
    user.favorites.remove(location)
    user.save()

    return redirect('unimap:map_views')
