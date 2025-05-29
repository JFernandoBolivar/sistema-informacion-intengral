import { NextRequest, NextResponse } from "next/server";
import { mockInventory } from "../route";

// Request body type for inventory updates
interface UpdateInventoryRequest {
  items: {
    tipo: string;
    cantidad: number;
  }[];
}

/**
 * POST handler for updating inventory quantities
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const data: UpdateInventoryRequest = await request.json();

    // Validate request structure
    if (!data || !data.items || !Array.isArray(data.items)) {
      return NextResponse.json(
        {
          success: false,
          message: "Formato de solicitud inválido. Se requiere un array de items.",
        },
        { status: 400 }
      );
    }

    // Track items that were updated
    const updatedItems = [];
    const errors = [];

    // Process each item in the request
    for (const item of data.items) {
      // Validate item data
      if (!item.tipo || typeof item.cantidad !== "number" || item.cantidad <= 0) {
        errors.push({
          tipo: item.tipo || "Unknown",
          error: "Tipo o cantidad inválida",
        });
        continue;
      }

      // Find the item in inventory
      const inventoryItem = mockInventory.find(
        (inv) => inv.Tipo_Insumo === item.tipo
      );

      // Check if item exists
      if (!inventoryItem) {
        errors.push({
          tipo: item.tipo,
          error: "Item no encontrado en inventario",
        });
        continue;
      }

      // Check if there's enough inventory
      if (item.cantidad > inventoryItem.Inventario_Total) {
        errors.push({
          tipo: item.tipo,
          error: "Cantidad solicitada excede el inventario disponible",
          disponible: inventoryItem.Inventario_Total,
          solicitado: item.cantidad,
        });
        continue;
      }

      // Update inventory (in a real app, this would update a database)
      const previousQuantity = inventoryItem.Inventario_Entrega;
      inventoryItem.Inventario_Entrega += item.cantidad;
      inventoryItem.Inventario_Total -= item.cantidad;

      // Track updated item
      updatedItems.push({
        tipo: item.tipo,
        cantidadAnterior: previousQuantity,
        cantidadNueva: inventoryItem.Inventario_Entrega,
        inventarioRestante: inventoryItem.Inventario_Total,
      });
    }

    // Simulate a small delay to mimic database update
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Return response with updated items and any errors
    return NextResponse.json({
      success: true,
      message: `${updatedItems.length} items actualizados${errors.length > 0 ? ` con ${errors.length} errores` : ""}`,
      updatedItems,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Error updating inventory:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Error del servidor",
      },
      { status: 500 }
    );
  }
}

