from django.urls import path

from . import views

app_name = "unimap"
urlpatterns = [
    path('', views.view_name, name="view_name"),
    path('login', views.login_redirect, name='login_redirect'),
    path('map', views.map_view,name='map_views'),
    path('create', views.create_view, name='create_view'),
    path('form', views.form_submission, name='form_submission'),
    path('review', views.review_view, name='review_view'),
    path('favorites', views.favorite_view, name='favorite_view'),
    path('<int:pk>/verify/', views.verify_view, name='verify_view'),
    path('<int:pk>/delete/', views.delete_view, name='delete_view'),
    path('<int:location_id>/vote/', views.vote_view, name='vote_view'),
    path('<int:location_id>/edit/', views.edit_location, name='edit_location'),
    path('<int:location_id>/favorite/', views.favorite_location, name='favorite_location'),
    path('<int:location_id>/unfavorite/', views.unfavorite_location, name='unfavorite_location'),
]