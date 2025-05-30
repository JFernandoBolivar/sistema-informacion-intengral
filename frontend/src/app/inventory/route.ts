import { NextRequest, NextResponse } from "next/server";

const DJANGO_BACKEND_URL =
  process.env.DJANGO_BACKEND_URL || "http://localhost:8000";
const INVENTORY_ENDPOINT = `${DJANGO_BACKEND_URL}/inventory/`;

const formatInventoryData = (data: any[]) => {
  return data.map((item) => ({
    Tipo_Insumo: item.tipo_insumo || item.Tipo_Insumo,
    Inventario_Total: item.inventario_total || item.Inventario_Total,
    Inventario_Entrega: item.inventario_entrega || item.Inventario_Entrega,
  }));
};

export async function GET(request: NextRequest) {
  try {
    console.log(`Fetching inventory data from: ${INVENTORY_ENDPOINT}`);

    const response = await fetch(INVENTORY_ENDPOINT, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error al obtener datos de inventario: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    const formattedData = Array.isArray(data) ? formatInventoryData(data) : [];

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error fetching inventory from Django backend:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error al conectar con el backend",
      },
      { status: 500 }
    );
  }
}
