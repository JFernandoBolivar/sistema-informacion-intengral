from django.urls import path
from .views import Create_Consult, Inventory_Total, inventory_detail

urlpatterns = [
    path('', Create_Consult, name='Create_Consult'),
    path('total/', Inventory_Total, name='Inventory_Total'),
    path('<int:pk>/', inventory_detail, name='inventory_detail'),
]
