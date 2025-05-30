"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useHasDepartmentAccess } from "@/components/DepartmentProtection";
import { Lock, Check } from "lucide-react";

type Department = {
  id: string;
  name: string;

  imageSrc: string;
  href: string;
  color: string;
  alt: string;
  departmentKey: string; // Clave para verificar permisos
};

const departments: Department[] = [
  {
    id: "pharmacy",
    name: "Farmacia",

    imageSrc: "/images/departments/pharmacy.jpg",
    href: "/dashboard/farmacia",
    color: "bg-blue-50 dark:bg-blue-950",
    alt: "Imagen de farmacia con medicamentos",
    departmentKey: "farmacia",
  },
  {
    id: "medical",
    name: "Servicios Médicos",

    imageSrc: "/images/departments/medical.jpg",
    href: "/dashboard/servicios-medicos",
    color: "bg-green-50 dark:bg-green-950",
    alt: "Imagen de servicios médicos",
    departmentKey: "servicios-medicos",
  },
  {
    id: "attention",
    name: "Atención al Ciudadano",

    imageSrc: "/images/departments/attention.png",
    href: "/dashboard/oac",
    color: "bg-purple-50 dark:bg-purple-950",
    alt: "Imagen de atención al ciudadano",
    departmentKey: "oac",
  },
  {
    id: "warehouse",
    name: "Almacén",

    imageSrc: "/images/departments/warehouse.jpg",
    href: "/dashboard/almacen",
    color: "bg-amber-50 dark:bg-amber-950",
    alt: "Imagen de almacén con suministros",
    departmentKey: "almacen",
  },
  {
    id: "employee",
    name: "Datos",

    imageSrc: "/images/departments/datos.jpeg",
    href: "/dashboard/rac/employee/entry",
    color: "bg-amber-50 dark:bg-amber-950",
    alt: "Imagen de almacén con suministros",
    departmentKey: "oac",
  },
];

// Componente para el dashboard
export default function DashboardPage() {
  const router = useRouter();
  const [userStatus, setUserStatus] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Verificar si estamos en el cliente y cargar los datos del usuario
  useEffect(() => {
    setIsClient(true);
    const status = sessionStorage.getItem("userStatus");
    setUserStatus(status);
  }, []);

  // Verificar acceso del departamento
  const handleDepartmentClick = (dept: Department) => {
    // Si no estamos en el cliente, no hacemos nada
    if (!isClient) return;

    // Obtener información del usuario
    const userDepartment = sessionStorage.getItem("userDepartment");
    const userStatus = sessionStorage.getItem("userStatus");

    // Superadmin tiene acceso a todo
    if (userStatus === "superAdmin") {
      router.push(dept.href);
      return;
    }

    // Verificar si el usuario tiene acceso a este departamento
    if (userDepartment === dept.departmentKey) {
      router.push(dept.href);
    } else {
      // Mostrar mensaje de error si no tiene acceso
      toast.error("Acceso denegado", {
        description: `No tienes permisos para acceder al departamento de ${dept.name}`,
        duration: 3000,
      });
    }
  };

  // Función para verificar si el usuario tiene acceso a un departamento
  const checkAccess = (deptKey: string): boolean => {
    if (!isClient) return false;

    const userDepartment = sessionStorage.getItem("userDepartment");
    const userStatus = sessionStorage.getItem("userStatus");

    return userStatus === "superAdmin" || userDepartment === deptKey;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col items-center mb-10">
        <h1 className="text-3xl font-bold mb-2">
          Sistema de Información Integral
        </h1>
        <p className="text-muted-foreground text-center">
          Seleccione un departamento para acceder a sus funciones
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {departments.map((dept) => {
          const hasAccess = isClient && checkAccess(dept.departmentKey);

          return (
            <div
              key={dept.id}
              onClick={() => handleDepartmentClick(dept)}
              className={`block transition-all duration-200 ${
                hasAccess
                  ? "hover:scale-105 cursor-pointer"
                  : "opacity-75 cursor-not-allowed"
              }`}
            >
              <Card
                className={`h-full border-2 ${
                  hasAccess
                    ? `hover:border-primary ${dept.color}`
                    : "border-gray-300 bg-gray-100 dark:bg-gray-800"
                } overflow-hidden relative`}
              >
                {!hasAccess && (
                  <div className="absolute top-2 right-2 z-10 bg-gray-800 text-white p-1 rounded-full">
                    <Lock size={18} />
                  </div>
                )}

                {hasAccess && (
                  <div className="absolute top-2 right-2 z-10 bg-green-600 text-white p-1 rounded-full">
                    <Check size={18} />
                  </div>
                )}

                <div className="h-48 relative w-full overflow-hidden">
                  <Image
                    src={dept.imageSrc}
                    alt={dept.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    style={{ objectFit: "cover" }}
                    className={`transition-transform duration-500 ${
                      hasAccess ? "hover:scale-110" : ""
                    } rounded-t-lg ${!hasAccess ? "grayscale" : ""}`}
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-center text-xl">
                    {dept.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-2">
                  <p className="text-center text-sm text-muted-foreground"></p>
                </CardContent>
                <CardFooter className="flex justify-center pt-2">
                  <span className="text-sm text-muted-foreground">
                    {hasAccess
                      ? "Haga clic para acceder"
                      : "Acceso restringido"}
                  </span>
                </CardFooter>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
