from rest_framework import viewsets, permissions
from .models import SecurityLog
from .serializers import SecurityLogSerializer
from .permissions import IsSupervisor

class SecurityLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SecurityLog.objects.all()
    serializer_class = SecurityLogSerializer
    permission_classes = [IsSupervisor]
