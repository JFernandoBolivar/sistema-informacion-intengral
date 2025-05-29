from django.core.management.base import BaseCommand
from form.models import AyudaTecnica
from django.db import IntegrityError

class Command(BaseCommand):
    help = 'Crea los tipos de ayudas técnicas definidos en el schema de React'

    def handle(self, *args, **kwargs):
        # Tipos de ayudas técnicas definidos en technicalHelpSchema.ts
        ayudas_tecnicas = [
            "PAÑALES DE ADULTO",
            "PAÑALES DE NIÑO",
            "CENTRÓ DE CAMAS",
            "COLCHÓN ANTI-ESCARAS",
            "TENSIÓMETRO",
            "NEBULIZADOR",
            "MULETAS AXIL",
            "MULETAS CANA",
            "BASTÓN DE 1 PUNTO",
            "BASTÓN DE 4 PUNTOS",
            "GLUCÓMETRO",
            "ANDADERA",
            "SILLA DE RUEDAS EST.",
            "SILLA DE RUEDAS CUA.",
            "SILLA DE RUEDAS PED.",
            "CANASTILLA DE NIÑO",
            "CANASTILLA DE NIÑA",
            "PAÑALES",
        ]

        # También añadimos versiones sin tildes para compatibilidad
        ayudas_tecnicas_sin_tildes = [
            "PANALES DE ADULTO",
            "PANALES DE NINO",
            "CENTRO DE CAMAS",
            "COLCHON ANTI-ESCARAS",
            "TENSIOMETRO",
            "NEBULIZADOR",
            "MULETAS AXIL",
            "MULETAS CANA",
            "BASTON DE 1 PUNTO",
            "BASTON DE 4 PUNTOS",
            "GLUCOMETRO",
            "ANDADERA",
            "SILLA DE RUEDAS EST.",
            "SILLA DE RUEDAS CUA.",
            "SILLA DE RUEDAS PED.",
            "CANASTILLA DE NINO",
            "CANASTILLA DE NINA",
            "PANALES",
        ]
        
        # Combinar ambas listas
        todos_los_tipos = list(set(ayudas_tecnicas + ayudas_tecnicas_sin_tildes))
        
        created_count = 0
        existing_count = 0
        
        for nombre in todos_los_tipos:
            try:
                AyudaTecnica.objects.create(nombre=nombre)
                self.stdout.write(self.style.SUCCESS(f'Creado: {nombre}'))
                created_count += 1
            except IntegrityError:
                self.stdout.write(self.style.WARNING(f'Ya existe: {nombre}'))
                existing_count += 1
        
        self.stdout.write(self.style.SUCCESS(
            f'Proceso completado: {created_count} tipos creados, {existing_count} ya existían'
        ))

