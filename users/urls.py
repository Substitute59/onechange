from django.urls import path
from . import views

urlpatterns = [
    path('set-csrf-token/', views.set_csrf_token, name='set_csrf_token'),
    path("check-email/", views.check_email, name="check_email"),
    path("", views.create_user, name="create_user"),
    path("<str:user_id>/", views.get_user, name="get_user"),
    path("<str:user_id>/update/", views.update_user, name="update_user"),
]
