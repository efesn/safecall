from rest_framework import viewsets, permissions
from .models import Customer, Call, Ticket
from .serializers import CustomerSerializer, CallSerializer, TicketSerializer
from core.permissions import IsAdmin, IsSupervisor, IsAgent

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    
    def get_permissions(self):
        if self.action in ['destroy']:
            return [IsAdmin()]
        return [IsAgent()]

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
        serializer.save(agent=self.request.user)
