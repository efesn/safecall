from rest_framework import serializers
from .models import User, SecurityLog

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'department', 'phone_extension']

class SecurityLogSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  # This will use the __str__ method of the User model

    class Meta:
        model = SecurityLog
        fields = '__all__'
