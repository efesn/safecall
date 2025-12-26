from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import SecurityLog, User
from .serializers import SecurityLogSerializer, UserSerializer
from .permissions import IsSupervisor, IsAdmin

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'id': user.id,
            'username': user.username,
            'role': user.role,
            'is_superuser': user.is_superuser
        })

class VerifyPasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        password = request.data.get('password')
        if not password:
            return Response({'error': 'Password required'}, status=400)
        
        user = request.user
        if user.check_password(password):
            return Response({'status': 'verified'})
        else:
            return Response({'error': 'Invalid password'}, status=403)

class SecurityLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SecurityLog.objects.all()
    serializer_class = SecurityLogSerializer
    permission_classes = [IsSupervisor]

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]
