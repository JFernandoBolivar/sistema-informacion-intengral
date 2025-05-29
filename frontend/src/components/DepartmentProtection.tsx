"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Definición de tipos para las props
interface DepartmentProtectionProps {
  children: React.ReactNode;
  requiredDepartment: string;
  fallbackUrl?: string;
}

/**
 * Componente para proteger rutas basadas en el departamento del usuario
 * @param children - Contenido a mostrar si el usuario tiene acceso
 * @param requiredDepartment - Departamento requerido para acceder
 * @param fallbackUrl - URL a la que redirigir si no tiene acceso (por defecto: /dashboard)
 */
export function DepartmentProtection({
  children,
  requiredDepartment,
  fallbackUrl = "/dashboard",
}: DepartmentProtectionProps) {
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useEffect(() => {
    // Verificar si estamos en el cliente
    if (typeof window === "undefined") return;

    // Obtener información del usuario del sessionStorage
    const userDepartment = sessionStorage.getItem("userDepartment");
    const userStatus = sessionStorage.getItem("userStatus");

    // Los superadmin tienen acceso a todo
    if (userStatus === "superAdmin") {
      setHasAccess(true);
      return;
    }

    // Los admin tienen acceso a su departamento
    const hasPermission = userDepartment === requiredDepartment;
    setHasAccess(hasPermission);

    // Si no tiene acceso, redirigir y mostrar mensaje
    if (!hasPermission) {
      toast.error("Acceso denegado", {
        description: `No tienes permisos para acceder a esta sección.`,
        duration: 5000,
      });
      router.push(fallbackUrl);
    }
  }, [requiredDepartment, router, fallbackUrl]);

  // Mientras se verifica el acceso, no mostrar nada
  if (hasAccess === null) {
    return null;
  }

  // Si tiene acceso, mostrar el contenido
  return hasAccess ? <>{children}</> : null;
}

/**
 * Hook para verificar si un usuario tiene acceso a un departamento específico
 * @param department - Departamento al que se quiere verificar acceso
 * @returns boolean indicando si tiene acceso
 */
export function useHasDepartmentAccess(department: string): boolean {
  const [hasAccess, setHasAccess] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const userDepartment = sessionStorage.getItem("userDepartment");
    const userStatus = sessionStorage.getItem("userStatus");

    // Superadmin tiene acceso a todo
    if (userStatus === "superAdmin") {
      setHasAccess(true);
      return;
    }

    // Verificar si el departamento coincide
    setHasAccess(userDepartment === department);
  }, [department]);

  return hasAccess;
}

