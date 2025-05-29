from django.contrib import admin
from .models import AyudaTecnica, DataEntrega, ItemEntregado
# Register your models here.

admin.site.register(AyudaTecnica)
admin.site.register(DataEntrega)
admin.site.register(ItemEntregado)