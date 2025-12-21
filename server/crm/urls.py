from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomerViewSet, CallViewSet, TicketViewSet
from .twilio_views import TwilioWebhookView

router = DefaultRouter()
router.register(r'customers', CustomerViewSet)
router.register(r'calls', CallViewSet)
router.register(r'tickets', TicketViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('webhooks/twilio/', TwilioWebhookView.as_view(), name='twilio-webhook'),
]
