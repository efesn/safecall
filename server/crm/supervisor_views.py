from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Count, Q
from core.models import User
from .models import Call, Ticket
from core.permissions import IsSupervisor

class SupervisorStatsView(APIView):
    permission_classes = [IsSupervisor]

    def get(self, request):
        # 1. Agent Performance
        # We filter for users with role='Agent'
        agents = User.objects.filter(role='Agent').annotate(
            total_calls=Count('calls', distinct=True),
            total_tickets_assigned=Count('assigned_tickets', distinct=True),
            total_tickets_resolved=Count('assigned_tickets', filter=Q(assigned_tickets__status='Resolved'), distinct=True)
        )
        
        agent_data = []
        for agent in agents:
            agent_data.append({
                'id': agent.id,
                'username': agent.username,
                'full_name': f"{agent.first_name} {agent.last_name}".strip() or agent.username,
                'calls_count': agent.total_calls,
                'tickets_assigned': agent.total_tickets_assigned,
                'tickets_resolved': agent.total_tickets_resolved,
            })

        # 2. Overall Stats
        total_calls = Call.objects.count()
        total_tickets = Ticket.objects.count()
        open_tickets = Ticket.objects.filter(status='Open').count()
        resolved_tickets = Ticket.objects.filter(status='Resolved').count()
        
        return Response({
            'agents': agent_data,
            'stats': {
                'total_calls': total_calls,
                'total_tickets': total_tickets,
                'open_tickets': open_tickets,
                'resolved_tickets': resolved_tickets
            }
        })
