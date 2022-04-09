from django.urls import path

from . import views

urlpatterns = [
    path('notes/api/v1/allnotes', views.getAllNotes, name='getAllNotes'),
    path('notes/api/v1/updatenote', views.updateNote, name='updatenote'),
    path('notes/api/v1/addnote', views.addNote, name='addnote'),
    path('notes/api/v1/deletenote', views.deleteNote, name='deletenote'),
    path('notes/api/v1/login', views.login_view, name='login_view'),
    path('notes/api/v1/checkAuth', views.checkAuth, name='checkAuth'),
    path('login/', views.login_page, name='login_page'),
    path('notes/', views.notes, name='notes'),
    path('', views.home, name='home')
]