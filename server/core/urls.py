from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import SecurityLogViewSet, CurrentUserView, VerifyPasswordView, UserViewSet

router = DefaultRouter()
router.register(r'security-logs', SecurityLogViewSet)
router.register(r'users', UserViewSet)

urlpatterns = [
    path('users/me/', CurrentUserView.as_view(), name='current-user'),
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('verify-password/', VerifyPasswordView.as_view(), name='verify-password'),
]
