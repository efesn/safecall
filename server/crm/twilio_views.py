from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import Call, Customer
from django.utils import timezone
from .utils import assign_agent_to_customer

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
            customer_name = data.get('Name', 'Unknown Caller')
            print(f"DEBUG: Attempting to find/create customer with phone: {from_number}") # DEBUG
            customer, created = Customer.objects.get_or_create(
                phone_number=from_number,
                defaults={'full_name': customer_name, 'email': f'{from_number}@placeholder.com'}
            )
            
            # Update name if it was "Unknown Caller" and we have a better name now
            if not created and customer.full_name == 'Unknown Caller' and customer_name != 'Unknown Caller':
                customer.full_name = customer_name
                customer.save()
            
            # Auto-assign agent
            assign_agent_to_customer(customer)

            # Log the call start
            call = Call.objects.create(
                customer=customer,
                call_start_time=timezone.now(),
                call_type='Inbound',
                notes=f"Twilio Call SID: {call_sid}"
            )
            print(f"DEBUG: Call created with ID: {call.call_id}") # DEBUG
            
            return Response({'message': 'Call logged'}, status=status.HTTP_200_OK)
            
        return Response({'message': 'Status ignored'}, status=status.HTTP_200_OK)
