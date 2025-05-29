import { InventoryArticle } from "@/types/inventory";

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Helper function for consistent URL construction
function getApiUrl(endpoint: string): string {
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const fullUrl = `${baseUrl}${formattedEndpoint}`;
  console.log('API Call URL:', fullUrl); // Debug log
  return fullUrl;
}

/**
 * Custom error class for inventory API errors
 */
class InventoryApiError extends Error {
  status?: number;
  
  constructor(message: string, status?: number) {
    super(message);
    this.name = "InventoryApiError";
    this.status = status;
  }
}

/**
 * Helper to handle API response errors
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('auth_token'); // Clear invalid token
      throw new InventoryApiError("Sesión expirada o inválida. Por favor, inicie sesión nuevamente.", response.status);
    }
    
    let errorMessage = "Error en la solicitud al servidor";
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorData.message || errorMessage;
    } catch (e) {
      // If parsing fails, use the status text
      errorMessage = `${response.status}: ${response.statusText}`;
    }
    
    throw new InventoryApiError(errorMessage, response.status);
  }
  
  return await response.json() as T;
}

/**
 * Get authentication token from local storage
 */
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

/**
 * Create headers with authentication token
 */
function getAuthHeaders(): Headers {
  const token = getAuthToken();
  const headers = new Headers({
    "Content-Type": "application/json",
  });
  
  if (token) {
    headers.append("Authorization", `Token ${token}`);
  }
  
  return headers;
}
/**
 * Inventory API wrapper
 */
export const inventoryApi = {
  /**
   * Get all inventory articles
   */
  async list(): Promise<InventoryArticle[]> {
    const headers = getAuthHeaders();
    
    if (!getAuthToken()) {
      throw new InventoryApiError("No se encontró token de autenticación. Inicie sesión nuevamente.");
    }
    
    try {
      console.log('Environment:', {
        API_BASE_URL,
        NODE_ENV: process.env.NODE_ENV,
        publicApiUrl: process.env.NEXT_PUBLIC_API_URL
      });

      const response = await fetch(getApiUrl('api/Inventory/'), {
        method: "GET",
        headers,
      });
      
      if (!response.ok) {
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url
        });
      }
      
      return handleResponse<InventoryArticle[]>(response);
    } catch (error) {
      console.error("Detailed error:", error);
      if (error instanceof InventoryApiError) throw error;
      
      console.error("Error al obtener inventario:", error);
      throw new InventoryApiError(
        "Error al comunicarse con el servidor. Verifique su conexión a internet."
      );
    }
  },
  
  /**
   * Create a new inventory article
   */
  async create(data: Omit<InventoryArticle, "id">): Promise<InventoryArticle> {
    const headers = getAuthHeaders();
    
    if (!getAuthToken()) {
      throw new InventoryApiError("No se encontró token de autenticación. Inicie sesión nuevamente.");
    }
    
    try {
      const response = await fetch(getApiUrl('api/Inventory/'), {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });
      
      return handleResponse<InventoryArticle>(response);
    } catch (error) {
      if (error instanceof InventoryApiError) throw error;
      
      console.error("Error al crear artículo:", error);
      throw new InventoryApiError(
        "Error al comunicarse con el servidor. Verifique su conexión a internet."
      );
    }
  },
  
  /**
   * Update an existing inventory article
   */
  async update(id: string, data: Partial<InventoryArticle>): Promise<InventoryArticle> {
    const headers = getAuthHeaders();
    
    if (!getAuthToken()) {
      throw new InventoryApiError("No se encontró token de autenticación. Inicie sesión nuevamente.");
    }
    
    try {
      const response = await fetch(getApiUrl(`api/Inventory/${id}/`), {
        method: "PATCH",
        headers,
        body: JSON.stringify(data),
      });
      
      return handleResponse<InventoryArticle>(response);
    } catch (error) {
      if (error instanceof InventoryApiError) throw error;
      
      console.error(`Error al actualizar artículo ${id}:`, error);
      throw new InventoryApiError(
        "Error al comunicarse con el servidor. Verifique su conexión a internet."
      );
    }
  },
  
  /**
   * Delete an inventory article
   */
  async delete(id: string): Promise<void> {
    const headers = getAuthHeaders();
    
    if (!getAuthToken()) {
      throw new InventoryApiError("No se encontró token de autenticación. Inicie sesión nuevamente.");
    }
    
    try {
      const response = await fetch(getApiUrl(`api/Inventory/${id}/`), {
        method: "DELETE",
        headers,
      });
      
      if (!response.ok) {
        return handleResponse<void>(response);
      }
      
      // For successful deletes, just return (often no content)
      return;
    } catch (error) {
      if (error instanceof InventoryApiError) throw error;
      
      console.error(`Error al eliminar artículo ${id}:`, error);
      throw new InventoryApiError(
        "Error al comunicarse con el servidor. Verifique su conexión a internet."
      );
    }
  }
};

