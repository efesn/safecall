from core.models import User
from django.db.models import Count

def assign_agent_to_customer(customer):
    """
    Assigns an agent to the customer using a Load Balancing strategy.
    It selects the agent with the fewest assigned customers.
    """
    if customer.assigned_agent:
        return

    # Find all users with role 'Agent', count their customers, and order by that count (ascending)
    # 'assigned_customers' is the related_name defined in the Customer model
    agents = User.objects.filter(role='Agent').annotate(
        num_customers=Count('assigned_customers')
    ).order_by('num_customers')
    
    if agents.exists():
        # Pick the agent with the fewest customers
        selected_agent = agents.first()
        customer.assigned_agent = selected_agent
        customer.save()
