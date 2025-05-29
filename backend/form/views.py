from django.shortcuts import render
import json
import logging
import traceback

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from .Serializers import DataEntregaSerializer, StatusUpdateSerializer
from .models import DataEntrega





@api_view(['POST', 'GET'])
def crear_entrega(request):
    if request.method == 'GET':
        entregas = DataEntrega.objects.all().order_by('-fecha')
        serializer = DataEntregaSerializer(entregas, many=True)
        return Response(serializer.data)
    try:
        # Log de información de la solicitud recibida
        logging.info(f"Solicitud recibida: Content-Type: {request.content_type}")
        logging.info(f"Datos recibidos en request.data: {type(request.data)}")
        
        # Extraer datos JSON del campo 'data' del FormData
        data_json = request.data.get('data')
        
        # Log del contenido del campo 'data'
        logging.info(f"Campo data: {type(data_json)}")
        if data_json:
            # Si es una cadena JSON, convertirla a diccionario
            if isinstance(data_json, str):
                try:
                    # Intentar decodificar con manejo explícito de codificación
                    data_dict = json.loads(data_json)
                    logging.info(f"JSON decodificado correctamente: {type(data_dict)}")
                except json.JSONDecodeError as json_err:
                    logging.error(f"Error al decodificar JSON: {str(json_err)}")
                    # Intentar con diferentes codificaciones si hay error
                    try:
                        if isinstance(data_json, bytes):
                            data_json = data_json.decode('utf-8', errors='ignore')
                        data_dict = json.loads(data_json)
                        logging.info("JSON decodificado con manejo de errores de codificación")
                    except Exception as decode_err:
                        logging.error(f"Error en decodificación alternativa: {str(decode_err)}")
                        return Response(
                            {'error': f"Error al decodificar datos JSON: {str(json_err)}"}, 
                            status=status.HTTP_400_BAD_REQUEST
                        )
            else:
                # Ya es un objeto (dict, etc.)
                data_dict = data_json
                logging.info(f"Usando data_json como objeto directamente: {type(data_dict)}")
        else:
            # Si no hay campo 'data', usar request.data directamente
            data_dict = request.data
            logging.info(f"Usando request.data directamente: {type(data_dict)}")
        
        # Log del contenido final de data_dict
        logging.info(f"Estructura de datos a procesar: {data_dict}")
            
        # Procesar archivo adjunto si existe
        if 'archivo_adjunto' in request.FILES:
            data_dict['archivo_adjunto'] = request.FILES['archivo_adjunto']
            logging.info(f"Archivo adjunto procesado: {request.FILES['archivo_adjunto'].name}")
            
        # Validar y guardar los datos
        serializer = DataEntregaSerializer(data=data_dict)
        
        if serializer.is_valid():
            entrega = serializer.save()
            logging.info(f"Entrega creada con ID: {entrega.id}")
            return Response({'id': entrega.id}, status=status.HTTP_201_CREATED)
        
        # Log de errores de validación
        logging.error(f"Errores de validación: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        # Capturar stack trace completo
        stack_trace = traceback.format_exc()
        logging.error(f"Error en crear_entrega: {str(e)}")
        logging.error(f"Stack trace: {stack_trace}")
        
        # Devolver información útil para depuración
        return Response(
            {
                'error': str(e),
                'type': str(type(e).__name__),
                'trace': stack_trace.splitlines()[-5:] if stack_trace else None
            }, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['PATCH'])
def actualizar_estado(request, entrega_id):
    try:
        entrega = DataEntrega.objects.get(pk=entrega_id)
    except DataEntrega.DoesNotExist:
        return Response(
            {"error": "Entrega no encontrada"}, 
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = StatusUpdateSerializer(
        entrega, 
        data=request.data, 
        partial=True
    )
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    
    return Response(
        serializer.errors, 
        status=status.HTTP_400_BAD_REQUEST
    )
