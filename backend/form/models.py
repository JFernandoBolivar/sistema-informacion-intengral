from django.db import models

# Create your models here.

class AyudaTecnica(models.Model):
    nombre = models.CharField(unique=True, max_length=100)

    def __str__(self):
        return self.nombre

class DataEntrega(models.Model):
    STATUS_CHOICES = [
        ('PENDIENTE', 'Pendiente'),
        ('EN_REVISION', 'En Revisión'),
        ('APROBADO', 'Aprobado'),
        ('RECHAZADO', 'Rechazado'),
        ('ENTREGADO', 'Entregado')
    ]
    
    name = models.CharField(max_length=100)
    lastname = models.CharField(max_length=100)
    resident = models.CharField(max_length=10)
    identification = models.CharField(max_length=20)
    phone = models.CharField(max_length=20)
    diagnostic = models.CharField(max_length=100, null=True, blank=True)  # Campo de diagnóstico del beneficiario
    age = models.CharField(max_length=10, null=True, blank=True)  # Campo de edad del beneficiario
    direction = models.TextField()
    observation = models.TextField(null=True, blank=True)
    state = models.CharField(max_length=100)
    municipality = models.CharField(max_length=100)
    parish = models.CharField(max_length=100)
    identificationRefererPerson = models.IntegerField(null=True, blank=True)  # Campo para la identificación de la persona que refiere
    nameRefererPerson = models.CharField(max_length=100, null=True, blank=True)  # Campo para el nombre de la persona que refiere
    nameRefererOrganization = models.CharField(max_length=100, null=True, blank=True)  # Campo para el nombre de la organización que refiere
    identificationRefererOrganization = models.IntegerField(null=True, blank=True)  # Campo para la identificación de la organización que refiere
    identificationRefererAssociation = models.IntegerField(null=True, blank=True)  # Campo para la identificación de la asociación que refiere
    nameRefererAssociation = models.CharField(max_length=100, null=True, blank=True)  # Campo para el nombre de la asociación que refiere
    applicant_active = models.BooleanField(default=False)
    main = models.TextField(null=True, blank=True)  # Campo para la ruta de los archivos
    recipes = models.TextField(null=True, blank=True)  # Campo para recetas médicas
    archivo_adjunto = models.FileField(upload_to='adjuntos/', null=True, blank=True)
    fecha = models.DateTimeField(auto_now_add=True)
    # Campos adicionales del solicitante
    nameApplicant = models.CharField(max_length=128, null=True, blank=True)
    lastnameApplicant = models.CharField(max_length=128, null=True, blank=True)
    residentApplicant = models.CharField(max_length=10, null=True, blank=True)
    identificationApplicant = models.CharField(max_length=20, null=True, blank=True)
    phoneApplicant = models.CharField(max_length=20, null=True, blank=True)
    ageApplicant = models.CharField(max_length=10, null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='PENDIENTE',
        help_text='Estado actual de la solicitud'
    )
class ItemEntregado(models.Model):
    data_entrega = models.ForeignKey(DataEntrega, on_delete=models.CASCADE, related_name='items')
    ayuda_tecnica = models.ForeignKey(AyudaTecnica, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField()
