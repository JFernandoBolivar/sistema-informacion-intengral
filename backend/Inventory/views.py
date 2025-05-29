from django.shortcuts import render, get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import permissions, status
from .Serializers import InventorySerializer
from .models import Inventory
from django.db import connection, models
# Create your views here.

@api_view(['GET', 'POST'])
@permission_classes([permissions.AllowAny])
def Create_Consult(request):
    """
    GET: List all inventory items
    POST: Create a new inventory item
    """
    if request.method == 'GET':
        try:
            inventory_items = Inventory.objects.all()
            serializer = InventorySerializer(inventory_items, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    elif request.method == 'POST':
        serializer = InventorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([permissions.AllowAny])
def inventory_detail(request, pk):
    """
    GET: Retrieve a single inventory item
    PUT: Update an inventory item
    DELETE: Delete an inventory item
    """
    try:
        inventory = get_object_or_404(Inventory, pk=pk)
    except Inventory.DoesNotExist:
        return Response({'error': 'Inventory item not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = InventorySerializer(inventory)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = InventorySerializer(inventory, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        inventory.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def Inventory_Total(request):
    """
    Get inventory totals grouped by tipo_insumo
    """
    if request.method == 'GET':
        try:
            inventory_totals = Inventory.objects.values('tipo_insumo').annotate(
                total=models.Sum('inventario_total'),
                entrega=models.Sum('inventario_entrega')
            )
            return Response(list(inventory_totals))
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
