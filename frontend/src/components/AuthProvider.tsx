"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  isAuthenticated,
  getUserData,
  logout as logoutService,
} from "@/services/auth";

// Define el tipo para el contexto de autenticación
interface AuthContextType {
  isLoggedIn: boolean;
  userData: any | null;
  loading: boolean;
  userRole: string | null;
  isAdmin: boolean;
  logout: () => Promise<void>;
}

// Crear el contexto
const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  userData: null,
  loading: true,
  userRole: null,
  isAdmin: false,
  logout: async () => {},
});

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);

// Proveedor de autenticación
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  // Ruta principal para usuarios autenticados
  // const dashboardRoute = '/dashboard';

  // Rutas protegidas que requieren roles específicos - mantener para referencia futura
  const adminRoutes = [
    "/dashboard/oac/admin",
    "/dashboard/oac/admin/inventario",
    "/dashboard/oac/admin/solicitudes",
  ];

  // Verificar estado de autenticación cuando se carga el componente
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsLoggedIn(authenticated);

      if (authenticated) {
        const user = getUserData();
        setUserData(user);

        // Determinar el rol del usuario
        const role = user?.status || null;
        setUserRole(role);
        setIsAdmin(["admin", "superAdmin"].includes(role));
      } else {
        setUserData(null);
        setUserRole(null);
        setIsAdmin(false);
      }

      setLoading(false);
    };

    checkAuth();

    // Redirigir basado en el estado de autenticación y rol
    const handleAuthRedirect = () => {
      if (loading) return; // Esperar a que termine la carga

      const publicRoutes = ["/", "/login", "/register"];
      const isPublicRoute = publicRoutes.some((route) => pathname === route);

      // Casos de redirección simplificados
      if (!isLoggedIn && !isPublicRoute) {
        // No autenticado intentando acceder a ruta protegida
        console.log("Redirigiendo a login: usuario no autenticado");
        router.push("/");
      } else if (isLoggedIn && isPublicRoute) {
        // Autenticado en ruta pública, redirigir al dashboard principal
        console.log(`Redirigiendo a dashboard principal`);
        // router.push(dashboardRoute);
      }

      // Histórico de navegación para el botón de retroceso
      if (isLoggedIn && !loading && !isPublicRoute) {
        // Guardar la ruta actual como última ruta válida
        sessionStorage.setItem("lastValidRoute", pathname);
      }
    };

    handleAuthRedirect();
  }, [isLoggedIn, pathname, loading, router, userRole, isAdmin]);

  // Monitor para el botón de retroceso - simplificado
  useEffect(() => {
    if (typeof window !== "undefined" && isLoggedIn && !loading) {
      // Cuando se usa el botón de retroceso
      const handlePopState = () => {
        // Solo guardar el historial sin redirecciones automáticas
        const currentPath = window.location.pathname;
        sessionStorage.setItem("lastValidRoute", currentPath);
      };

      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }
  }, [isLoggedIn, loading, isAdmin, router]);

  // Función para cerrar sesión
  const handleLogout = async () => {
    await logoutService();
    setIsLoggedIn(false);
    setUserData(null);
    setUserRole(null);
    setIsAdmin(false);
    sessionStorage.removeItem("lastValidRoute");
    router.push("/");
    // Limpiar la información de departamento al cerrar sesión
    sessionStorage.removeItem("userDepartment");
    sessionStorage.removeItem("userStatus");
  };

  // Valor que se proporcionará al contexto
  const contextValue: AuthContextType = {
    isLoggedIn,
    userData,
    loading,
    userRole,
    isAdmin,
    logout: handleLogout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
