"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { AccessDeniedMessage } from "@/components/AccessDeniedMessage";
import { Sidebar } from "@/components/navigation/Sidebar";
/**
 * Layout específico para el departamento OAC
 * - Verifica que el usuario pertenezca al departamento OAC
 * - Muestra mensaje de acceso denegado si no tiene permisos
 */
export default function OACLayout({ children }: { children: ReactNode }) {
  const { userData, loading } = useAuth();
  const [verifyingAccess, setVerifyingAccess] = useState(true);

  useEffect(() => {
    if (!loading) {
      setVerifyingAccess(false);
    }
  }, [loading]);

  // Si está cargando, mostrar pantalla de carga
  if (loading || verifyingAccess) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Verificando acceso...</h2>
          <p className="text-muted-foreground">Por favor espere</p>
        </div>
      </div>
    );
  }

  // Si no tiene permisos, mostrar mensaje de acceso denegado
  if (userData?.department !== "oac") {
    return (
      <AccessDeniedMessage message="No tiene permisos para acceder al área de OAC. Esta sección está restringida al personal del departamento de OAC." />
    );
  }

  // Usuario del departamento correcto: mostrar contenido
  return (
    <>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <main className="flex-grow p-6 pt-16 lg:pt-6 overflow-auto">
            <div className="container mx-auto max-w-7xl">{children}</div>
          </main>
          <footer className="bg-muted/50 p-4 text-center text-sm text-muted-foreground">
            Sistema de Informacion Integral © {new Date().getFullYear()}
          </footer>
        </div>
      </div>
    </>
  );
}
