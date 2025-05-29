from django.db import models
from django.utils import timezone

# Create your models here.
class Inventory(models.Model):
    id = models.AutoField(primary_key=True)
    codigo_articulo = models.CharField(db_column='Codigo_Articulo', max_length=50, default='N/A', unique=True)
   
    tipo_insumo = models.CharField(db_column='Tipo_Insumo', max_length=250, default='No especificado')
    descripcion = models.TextField(db_column='Descripcion', blank=True, null=True)
    estado = models.CharField(db_column='Estado', max_length=50, default='Disponible')
    numero_factura = models.CharField(db_column='Numero_Factura', max_length=50, blank=True, null=True)
    inventario_total = models.IntegerField(db_column='Inventario_Total', default=0)
    inventario_entrega = models.IntegerField(db_column='Inventario_Entrega', default=0)
    fecha_adquisicion = models.DateField(db_column='Fecha_Adquisicion', default=timezone.now)
    fecha_mantenimiento = models.DateField(db_column='Fecha_Mantenimiento', blank=True, null=True)
    
   
    categoria = models.CharField(db_column='Categoria', max_length=70, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = True
        db_table = 'Inventory'
    
    @staticmethod
    def get_next_codigo_articulo():
        """
        Generate the next 4-digit codigo_articulo
        """
        last_item = Inventory.objects.all().order_by('-id').first()
        if not last_item or not last_item.codigo_articulo.isdigit():
            # Start with 0001 if no records exist or last record has non-numeric codigo_articulo
            return '0001'
        
        try:
            # Extract numeric value, increment by 1, and format as 4-digit number
            last_code = int(last_item.codigo_articulo)
            next_code = last_code + 1
            return f"{next_code:04d}"  # Format as 4-digit number with leading zeros
        except (ValueError, TypeError):
            # Fallback to 0001 if conversion fails
            return '0001'
    
    def save(self, *args, **kwargs):
        """
        Override save method to auto-generate codigo_articulo for new instances
        """
        # Only auto-generate codigo_articulo for new instances (when id is None)
        if not self.pk and (not self.codigo_articulo or self.codigo_articulo == 'N/A'):
            self.codigo_articulo = self.get_next_codigo_articulo()
        
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.codigo_articulo} - {self.tipo_insumo}"
