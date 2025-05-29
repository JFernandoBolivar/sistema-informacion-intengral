from django.urls import path
from .views import crear_entrega, actualizar_estado

urlpatterns = [
    path('ayudas-tecnicas-externos/', crear_entrega, name='crear_entrega'),
    path('entregas/<int:entrega_id>/status/', actualizar_estado, name='actualizar_estado'),
]
