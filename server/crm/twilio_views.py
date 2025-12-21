from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import Call, Customer
from django.utils import timezone

@method_decorator(csrf_exempt, name='dispatch')
class TwilioWebhookView(APIView):
    """
    Receives webhooks from Twilio for incoming calls.
    Note: In production, you must validate the Twilio Signature.
    """
    permission_classes = [permissions.AllowAny] # Twilio needs to access this

    def post(self, request, format=None):
        data = request.data
        
        # Extract Twilio parameters
        call_sid = data.get('CallSid')
        from_number = data.get('From')
        to_number = data.get('To')
        status_param = data.get('CallStatus')
        
        if status_param == 'ringing' or status_param == 'in-progress':
            # Find or create customer
            customer, created = Customer.objects.get_or_create(
                phone_number=from_number,
                defaults={'full_name': 'Unknown Caller', 'email': f'{from_number}@placeholder.com'}
            )
            
            # Log the call start
            Call.objects.create(
                customer=customer,
                start_time=timezone.now(),
                direction='Inbound',
                notes=f"Twilio Call SID: {call_sid}"
            )
            
            return Response({'message': 'Call logged'}, status=status.HTTP_200_OK)
            
        return Response({'message': 'Status ignored'}, status=status.HTTP_200_OK)
