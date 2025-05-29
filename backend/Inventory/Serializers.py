from rest_framework import serializers
from .models import Inventory

class InventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventory
        fields = '__all__'
        read_only_fields = ['id', 'codigo_articulo']  # Proteger los campos id y codigo_articulo para que no se puedan modificar
