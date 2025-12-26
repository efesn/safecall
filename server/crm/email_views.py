from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import Ticket, Customer
from django.utils import timezone
from .utils import assign_agent_to_customer

@method_decorator(csrf_exempt, name='dispatch')
class EmailWebhookView(APIView):
    """
    Receives webhooks from an Email Provider (e.g., SendGrid, Mailgun) for incoming emails.
    Simulated payload:
    {
        "sender": "customer@example.com",
        "subject": "My internet is down",
        "body": "Please help me fix it.",
        "name": "John Doe"
    }
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, format=None):
        data = request.data
        
        sender_email = data.get('sender')
        subject = data.get('subject')
        body = data.get('body')
        sender_name = data.get('name', 'Unknown Sender')

        if not sender_email or not subject:
            return Response({'error': 'Missing sender or subject'}, status=status.HTTP_400_BAD_REQUEST)

        # Find or create customer based on email
        customer, created = Customer.objects.get_or_create(
            email=sender_email,
            defaults={
                'full_name': sender_name,
                'phone_number': 'Unknown' # Placeholder
            }
        )

        # Auto-assign agent
        assign_agent_to_customer(customer)

        # Create a Ticket automatically
        ticket = Ticket.objects.create(
            customer=customer,
            title=subject,
            description=body,
            issue_category='General', # Default category
            priority_level='Medium',
            status='Open',
            created_by=None # System created
        )

        return Response({
            'message': 'Ticket created from email',
            'ticket_id': ticket.ticket_id
        }, status=status.HTTP_201_CREATED)
