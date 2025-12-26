from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Customer, Call, Ticket, Campaign
from .serializers import CustomerSerializer, CallSerializer, TicketSerializer, CampaignSerializer
from core.permissions import IsAdmin, IsSupervisor, IsAgent
from core.models import SecurityLog
from core.signals import get_client_ip

class CampaignViewSet(viewsets.ModelViewSet):
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer
    permission_classes = [IsSupervisor]

    @action(detail=True, methods=['get'])
    def members(self, request, pk=None):
        campaign = self.get_object()
        customers = campaign.customers.all()
        serializer = CustomerSerializer(customers, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def add_customer(self, request, pk=None):
        campaign = self.get_object()
        customer_id = request.data.get('customer_id')
        try:
            customer = Customer.objects.get(pk=customer_id)
            customer.campaigns.add(campaign)
            return Response({'status': 'customer added'})
        except Customer.DoesNotExist:
            return Response({'error': 'customer not found'}, status=404)

    @action(detail=True, methods=['post'])
    def remove_customer(self, request, pk=None):
        campaign = self.get_object()
        customer_id = request.data.get('customer_id')
        try:
            customer = Customer.objects.get(pk=customer_id)
            customer.campaigns.remove(campaign)
            return Response({'status': 'customer removed'})
        except Customer.DoesNotExist:
            return Response({'error': 'customer not found'}, status=404)

class CustomerViewSet(viewsets.ModelViewSet):
    serializer_class = CustomerSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role in ['Supervisor', 'Admin']:
            return Customer.objects.all()
        return Customer.objects.filter(assigned_agent=user)

    def perform_create(self, serializer):
        serializer.save(assigned_agent=self.request.user)
    
    def get_permissions(self):
        if self.action in ['destroy']:
            return [IsAdmin()]
        return [IsAgent()]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Log Data Access
        if request.user.is_authenticated:
            SecurityLog.objects.create(
                user=request.user,
                event_type='Data Access',
                ip_address=get_client_ip(request),
                description=f"Viewed customer profile: {instance.full_name} (ID: {instance.customer_id})"
            )
        return super().retrieve(request, *args, **kwargs)

class CallViewSet(viewsets.ModelViewSet):
    queryset = Call.objects.all()
    serializer_class = CallSerializer
    permission_classes = [IsAgent]

    def perform_create(self, serializer):
        serializer.save(agent=self.request.user)

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    
    def get_permissions(self):
        if self.action in ['destroy']:
            return [IsSupervisor()]
        return [IsAgent()]

    def perform_create(self, serializer):
        serializer.save(agent=self.request.user, created_by=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Check if user is assigned agent or supervisor/admin
        if request.user.role not in ['Supervisor', 'Admin'] and instance.agent != request.user:
            return Response({'error': 'You are not authorized to view this ticket details.'}, status=403)
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if request.user.role not in ['Supervisor', 'Admin'] and instance.agent != request.user:
            return Response({'error': 'You are not authorized to edit this ticket.'}, status=403)
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        if request.user.role not in ['Supervisor', 'Admin'] and instance.agent != request.user:
            return Response({'error': 'You are not authorized to edit this ticket.'}, status=403)
        return super().partial_update(request, *args, **kwargs)
