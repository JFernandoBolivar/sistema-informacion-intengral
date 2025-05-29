from rest_framework import serializers
from .models import DataEntrega, ItemEntregado, AyudaTecnica

class ItemEntregadoSerializer(serializers.ModelSerializer):
    tipo = serializers.SlugRelatedField(
        slug_field='nombre',
        queryset=AyudaTecnica.objects.all(),
        source='ayuda_tecnica'
    )

    class Meta:
        model = ItemEntregado
        fields = ('tipo', 'cantidad')

class DataEntregaSerializer(serializers.ModelSerializer):
    items = ItemEntregadoSerializer(many=True)
    
    class Meta:
        model = DataEntrega
        fields = '__all__'

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        entrega = DataEntrega.objects.create(**validated_data)
        for item in items_data:
            ItemEntregado.objects.create(
                data_entrega=entrega,
                ayuda_tecnica=item['ayuda_tecnica'],
                cantidad=item['cantidad']
            )
        return entrega

class StatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataEntrega
        fields = ['status']
        read_only_fields = ['id']  # Proteger otros campos
