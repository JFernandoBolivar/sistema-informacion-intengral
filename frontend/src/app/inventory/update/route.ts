import { NextRequest, NextResponse } from "next/server";
import { mockInventory } from "../route";

interface UpdateInventoryRequest {
  items: {
    tipo: string;
    cantidad: number;
  }[];
}
export async function POST(request: NextRequest) {
  try {
    const data: UpdateInventoryRequest = await request.json();

    if (!data || !data.items || !Array.isArray(data.items)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Formato de solicitud inválido. Se requiere un array de items.",
        },
        { status: 400 }
      );
    }
    const updatedItems = [];
    const errors = [];

    for (const item of data.items) {
      if (
        !item.tipo ||
        typeof item.cantidad !== "number" ||
        item.cantidad <= 0
      ) {
        errors.push({
          tipo: item.tipo || "Unknown",
          error: "Tipo o cantidad inválida",
        });
        continue;
      }
      const inventoryItem = mockInventory.find(
        (inv) => inv.Tipo_Insumo === item.tipo
      );

      if (!inventoryItem) {
        errors.push({
          tipo: item.tipo,
          error: "Item no encontrado en inventario",
        });
        continue;
      }

      if (item.cantidad > inventoryItem.Inventario_Total) {
        errors.push({
          tipo: item.tipo,
          error: "Cantidad solicitada excede el inventario disponible",
          disponible: inventoryItem.Inventario_Total,
          solicitado: item.cantidad,
        });
        continue;
      }

      // actualiza el inventario
      const previousQuantity = inventoryItem.Inventario_Entrega;
      inventoryItem.Inventario_Entrega += item.cantidad;
      inventoryItem.Inventario_Total -= item.cantidad;

      updatedItems.push({
        tipo: item.tipo,
        cantidadAnterior: previousQuantity,
        cantidadNueva: inventoryItem.Inventario_Entrega,
        inventarioRestante: inventoryItem.Inventario_Total,
      });
    }

    await new Promise((resolve) => setTimeout(resolve, 300));

    return NextResponse.json({
      success: true,
      message: `${updatedItems.length} items actualizados${
        errors.length > 0 ? ` con ${errors.length} errores` : ""
      }`,
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
