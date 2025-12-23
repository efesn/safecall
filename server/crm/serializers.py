from rest_framework import serializers
from .models import Customer, Call, Ticket, Campaign

class CampaignSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campaign
        fields = '__all__'

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

class CallSerializer(serializers.ModelSerializer):
    agent_name = serializers.ReadOnlyField(source='agent.username')
    customer_name = serializers.ReadOnlyField(source='customer.full_name')

    class Meta:
        model = Call
        fields = '__all__'

class TicketSerializer(serializers.ModelSerializer):
    customer_name = serializers.ReadOnlyField(source='customer.full_name')
    agent_name = serializers.ReadOnlyField(source='agent.username')

    class Meta:
        model = Ticket
        fields = '__all__'
