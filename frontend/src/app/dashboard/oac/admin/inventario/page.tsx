"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  InventoryArticle,
  MAX_CODIGO_ARTICULO_LENGTH,
  MAX_TIPO_INSUMO_LENGTH,
  MAX_CATEGORIA_LENGTH,
  MAX_FACTURA_LENGTH,
  MIN_INVENTARIO,
  MAX_INVENTARIO,
  CATEGORIAS,
} from "@/types/inventory";
import { inventoryApi } from "@/api/inventory";
import { authApi } from "@/api/auth";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type DialogMode = "create" | "edit";

export default function InventarioPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>("create");
  const [editingArticle, setEditingArticle] = useState<InventoryArticle | null>(
    null
  );
  const [sortField, setSortField] = useState<keyof InventoryArticle | null>(
    null
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Estado para datos dinámicos
  const [inventoryData, setInventoryData] = useState<InventoryArticle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteArticleId, setDeleteArticleId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format current date for display
  const currentDate = new Date().toISOString().split("T")[0];

  // Cargar datos de inventario al iniciar
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchInventory = async () => {
      try {
        setIsLoading(true);
        const data = await inventoryApi.list();
        setInventoryData(data);
        setError(null);
      } catch (err: any) {
        console.error("Error al cargar inventario:", err);

        // Check if it's an authentication error
        if (
          err.message?.includes("autenticación") ||
          err.message?.includes("sesión")
        ) {
          router.push("/login");
          return;
        }

        setError(
          err.message ||
            "Error al cargar el inventario: conexión con el servidor fallida o datos inaccesibles. Por favor, intente nuevamente más tarde."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventory();
  }, [router]);

  const [formData, setFormData] = useState<Partial<InventoryArticle>>({
    codigo_articulo: "",

    tipo_insumo: "",
    categoria: "",
    descripcion: "",
    estado: "Disponible",
    numero_factura: "",
    inventario_total: 0 as number,
    inventario_entrega: 0 as number,
    fecha_adquisicion: currentDate,
    fecha_mantenimiento: undefined,
  });

  const handleOpenDialog = (mode: DialogMode, article?: InventoryArticle) => {
    setDialogMode(mode);
    setError(null); // Limpiar mensajes de error previos al abrir el diálogo
    if (mode === "edit" && article) {
      setEditingArticle(article);
      // Set ultimomantenimiento to current date when editing
      const currentDate = new Date().toISOString().split("T")[0];
      // Ensure all string fields have non-null values
      setFormData({
        codigo_articulo: article.codigo_articulo || "",

        tipo_insumo: article.tipo_insumo || "",
        categoria: article.categoria || "",
        descripcion: article.descripcion || "",
        estado: article.estado || "Disponible",
        numero_factura: article.numero_factura || "",
        inventario_total:
          typeof article.inventario_total === "number"
            ? article.inventario_total
            : 0,
        inventario_entrega:
          typeof article.inventario_entrega === "number"
            ? article.inventario_entrega
            : 0,
        fecha_adquisicion: article.fecha_adquisicion || currentDate,

        fecha_mantenimiento: currentDate,
        id: article.id,
      });
    } else {
      // Always use the current date for new items
      const currentDate = new Date().toISOString().split("T")[0];
      setEditingArticle(null);
      setFormData({
        codigo_articulo: "",
        tipo_insumo: "",
        categoria: "",
        descripcion: "", // Will be added in edit mode

        estado: "Disponible",
        numero_factura: "",
        inventario_total: 0 as number,
        // inventario_entrega is managed internally but not shown in form
        inventario_entrega: 0 as number,
        fecha_adquisicion: currentDate,
        // codigo_articulo will be auto-generated on form submit
        codigo_articulo: "",
        // fecha_mantenimiento is only available in edit mode
        fecha_mantenimiento: undefined,
      });
    }
    setDialogOpen(true);
  };

  const handleDeleteDialog = (id: string) => {
    setDeleteArticleId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteArticle = async () => {
    if (!deleteArticleId) return;

    try {
      setIsSubmitting(true);
      setError(null);

      await inventoryApi.delete(deleteArticleId);

      // Actualizar el estado local
      setInventoryData((prev) =>
        prev.filter((item) => item.id !== deleteArticleId)
      );
      setDeleteDialogOpen(false);
      setDeleteArticleId(null);
    } catch (err: any) {
      console.error("Error al eliminar artículo:", err);

      if (
        err.message?.includes("autenticación") ||
        err.message?.includes("sesión")
      ) {
        router.push("/login");
        return;
      }

      setError(
        err.message ||
          "No se pudo eliminar el artículo. El elemento podría estar en uso o existe un problema de conexión."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar campos requeridos
    if (!formData.tipo_insumo?.trim()) {
      setError("El tipo de insumo es obligatorio.");
      return;
    }

    if (!formData.categoria?.trim()) {
      setError("La categoría es obligatoria.");
      return;
    }

    // Validar que el inventario total esté dentro de los límites permitidos
    if (
      formData.inventario_total === undefined ||
      formData.inventario_total < MIN_INVENTARIO ||
      formData.inventario_total > MAX_INVENTARIO
    ) {
      setError(
        `El inventario total debe estar entre ${MIN_INVENTARIO} y ${MAX_INVENTARIO}.`
      );
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // For new items, ensure inventario_entrega equals inventario_total and generate codigo_articulo
      if (dialogMode === "create") {
        // Auto-generate a codigo_articulo based on tipo_insumo
        const prefix =
          formData.tipo_insumo?.substring(0, 3).toUpperCase() || "ART";
        const randomNum = Math.floor(Math.random() * 10000)
          .toString()
          .padStart(3, "0");
        formData.codigo_articulo = `${prefix}-${randomNum}`;

        // Set inventario_entrega equal to total
        formData.inventario_entrega = formData.inventario_total;

        // Make sure fecha_mantenimiento is null
        formData.fecha_mantenimiento = undefined;

        try {
          // Crear nuevo artículo
          const newArticle = await inventoryApi.create(
            formData as Omit<InventoryArticle, "id">
          );

          // Actualizar estado local
          setInventoryData((prev) => [...prev, newArticle]);
          setDialogOpen(false);
        } catch (err: any) {
          if (
            err.message?.includes("autenticación") ||
            err.message?.includes("sesión")
          ) {
            router.push("/login");
            return;
          }
          throw err;
        }
      } else if (editingArticle) {
        // For edits, ensure inventario_entrega doesn't exceed total
        if (
          (formData.inventario_entrega || 0) > (formData.inventario_total || 0)
        ) {
          formData.inventario_entrega = formData.inventario_total;
        }

        // Always update fecha_mantenimiento to current date when editing
        const currentDate = new Date().toISOString().split("T")[0];
        formData.fecha_mantenimiento = currentDate;

        // Validar fechas
        if (
          formData.fecha_mantenimiento &&
          new Date(formData.fecha_adquisicion as string) >
            new Date(formData.fecha_mantenimiento)
        ) {
          alert(
            "La fecha de adquisición no puede ser posterior a la fecha de último mantenimiento"
          );
          return;
        }

        try {
          // Actualizar artículo existente
          const updatedArticle = await inventoryApi.update(
            editingArticle.id,
            formData as Partial<InventoryArticle>
          );

          // Actualizar estado local
          setInventoryData((prev) =>
            prev.map((item) =>
              item.id === updatedArticle.id ? updatedArticle : item
            )
          );
          setDialogOpen(false);
        } catch (err: any) {
          if (
            err.message?.includes("autenticación") ||
            err.message?.includes("sesión")
          ) {
            router.push("/login");
            return;
          }
          throw err;
        }
      }
    } catch (err: any) {
      console.error("Error al guardar artículo:", err);
      setError(
        err.message ||
          "No se pudo guardar el artículo. Verifique la conexión con el servidor y que los datos sean correctos."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // función para ordenar la tabla
  const handleSort = (field: keyof InventoryArticle) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // filtro de busqueda de ayudas tecnicas
  const filteredArticles = inventoryData.filter((article) =>
    Object.values(article).some((value) => {
      // Skip null/undefined values or handle them safely
      if (value === null || value === undefined) {
        return false;
      }
      // Safely convert to string and perform the search
      return String(value).toLowerCase().includes(searchTerm.toLowerCase());
    })
  );

  // ordenar artículos
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    const aString = String(aValue).toLowerCase();
    const bString = String(bValue).toLowerCase();

    return sortDirection === "asc"
      ? aString.localeCompare(bString)
      : bString.localeCompare(aString);
  });

  return (
    <div className="container mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Inventario de Ayudas Técnicas y Sociales</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/oac")}
              >
                Volver
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Mensaje de error */}
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/*buscador y filtrador de busqueda*/}
            <div className="flex gap-4 mb-6">
              <Input
                placeholder="Buscar en inventario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline">Exportar</Button>
              <Button
                onClick={() => handleOpenDialog("create")}
                disabled={isLoading}
              >
                Nuevo Artículo
              </Button>
            </div>

            {/* Tabla de Inventario */}
            <div className="rounded-md border">
              {isLoading ? (
                <div className="flex justify-center items-center p-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Cargando inventario...</span>
                </div>
              ) : inventoryData.length === 0 ? (
                <div className="text-center p-12 text-gray-500">
                  No hay artículos en el inventario. Cree uno nuevo para
                  comenzar.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead
                        onClick={() => handleSort("codigo_articulo")}
                        className="cursor-pointer hover:bg-gray-50"
                      >
                        Código{" "}
                        {sortField === "codigo_articulo" &&
                          (sortDirection === "asc" ? "↑" : "↓")}
                      </TableHead>

                      <TableHead
                        onClick={() => handleSort("tipo_insumo")}
                        className="cursor-pointer hover:bg-gray-50"
                      >
                        Tipo Insumo{" "}
                        {sortField === "tipo_insumo" &&
                          (sortDirection === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead
                        onClick={() => handleSort("categoria")}
                        className="cursor-pointer hover:bg-gray-50"
                      >
                        Categoría{" "}
                        {sortField === "categoria" &&
                          (sortDirection === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead
                        onClick={() => handleSort("estado")}
                        className="cursor-pointer hover:bg-gray-50"
                      >
                        Estado{" "}
                        {sortField === "estado" &&
                          (sortDirection === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead
                        onClick={() => handleSort("numero_factura")}
                        className="cursor-pointer hover:bg-gray-50"
                      >
                        Número de Factura{" "}
                        {sortField === "numero_factura" &&
                          (sortDirection === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead
                        onClick={() => handleSort("inventario_total")}
                        className="cursor-pointer hover:bg-gray-50"
                      >
                        Total{" "}
                        {sortField === "inventario_total" &&
                          (sortDirection === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead
                        onClick={() => handleSort("inventario_entrega")}
                        className="cursor-pointer hover:bg-gray-50"
                      >
                        Disponible{" "}
                        {sortField === "inventario_entrega" &&
                          (sortDirection === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead className="text-center">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedArticles.map((article) => (
                      <TableRow key={article.id}>
                        <TableCell className="font-medium">
                          {article.codigo_articulo}
                        </TableCell>

                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {article.tipo_insumo}
                            </div>
                            <div className="text-sm text-gray-500">
                              {article.descripcion}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{article.categoria}</TableCell>
                        <TableCell>{article.estado}</TableCell>
                        <TableCell>{article.numero_factura}</TableCell>
                        <TableCell>{article.inventario_total}</TableCell>
                        <TableCell>{article.inventario_entrega}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenDialog("edit", article)}
                              disabled={isSubmitting}
                            >
                              Editar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600"
                              onClick={() => handleDeleteDialog(article.id)}
                              disabled={isSubmitting}
                            >
                              Eliminar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            {/* Diálogo de Gestión de Artículos */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    {dialogMode === "create"
                      ? "Nuevo Artículo"
                      : "Editar Artículo"}
                  </DialogTitle>
                  {isSubmitting && (
                    <DialogDescription className="flex items-center mt-2">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Guardando...
                    </DialogDescription>
                  )}
                </DialogHeader>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid w-full gap-4 ">
                    <div className="grid w-full items-center gap-2">
                      <label
                        htmlFor="tipo_insumo"
                        className="text-sm font-medium"
                      >
                        Tipo de Insumo*
                      </label>
                      <Input
                        id="tipo_insumo"
                        placeholder="Tipo de insumo (ej. Silla de Ruedas)"
                        value={formData.tipo_insumo || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tipo_insumo: e.target.value,
                          })
                        }
                        maxLength={MAX_TIPO_INSUMO_LENGTH}
                        required
                      />
                      <p className="text-xs text-gray-500">
                        {(formData.tipo_insumo || "").length}/
                        {MAX_TIPO_INSUMO_LENGTH}
                      </p>
                    </div>
                    <div className="grid w-full items-center gap-2">
                      <label
                        htmlFor="categoria"
                        className="text-sm font-medium"
                      >
                        Categoría*
                      </label>
                      <select
                        id="categoria"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                        value={formData.categoria || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            categoria: e.target.value,
                          })
                        }
                        required
                      >
                        <option value="">Seleccione Categoría</option>
                        <option value="Ayuda Tecnica">Ayuda Tecnica</option>
                        <option value="Ayuda Social">Ayuda Social</option>
                      </select>
                    </div>
                    {dialogMode === "edit" && (
                      <div className="grid w-full items-center gap-2">
                        <label
                          htmlFor="descripcion"
                          className="text-sm font-medium"
                        >
                          Descripción
                        </label>
                        <textarea
                          id="descripcion"
                          placeholder="Descripción detallada del artículo"
                          value={formData.descripcion || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              descripcion: e.target.value,
                            })
                          }
                          className="flex min-h-[80px] w-full rounded-md border border-input px-3 py-2 text-sm bg-background"
                        />
                      </div>
                    )}
                    <div className="grid w-full items-center gap-2">
                      <label
                        htmlFor="numero_factura"
                        className="text-sm font-medium"
                      >
                        Número de Factura
                      </label>
                      <Input
                        id="numero_factura"
                        placeholder="Número de factura"
                        value={formData.numero_factura || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            numero_factura: e.target.value,
                          })
                        }
                        maxLength={MAX_FACTURA_LENGTH}
                      />
                      <p className="text-xs text-gray-500">
                        {(formData.numero_factura || "").length}/
                        {MAX_FACTURA_LENGTH}
                      </p>
                    </div>
                    <div className="grid w-full items-center gap-2">
                      <label
                        htmlFor="inventario_total"
                        className="text-sm font-medium"
                      >
                        Inventario Total*
                      </label>
                      <Input
                        id="inventario_total"
                        type="number"
                        min={MIN_INVENTARIO}
                        max={MAX_INVENTARIO}
                        placeholder="Cantidad total"
                        value={
                          formData.inventario_total === null ||
                          formData.inventario_total === undefined ||
                          Number.isNaN(formData.inventario_total)
                            ? 0
                            : formData.inventario_total
                        }
                        onChange={(e) => {
                          // Use parseInt with a fallback to 0 if NaN
                          const total =
                            e.target.value === ""
                              ? 0
                              : parseInt(e.target.value) || 0;

                          // For new items, set inventario_entrega equal to total
                          // For edit mode, ensure it doesn't exceed the new total
                          let entrega = total;
                          if (dialogMode === "edit" && editingArticle) {
                            // Keep existing value but cap at new total
                            entrega = Math.min(
                              formData.inventario_entrega || 0,
                              total
                            );
                          }

                          setFormData({
                            ...formData,
                            inventario_total: Number.isNaN(total) ? 0 : total,
                            inventario_entrega: Number.isNaN(entrega)
                              ? 0
                              : entrega,
                          });
                        }}
                        required
                      />
                    </div>
                    <div className="grid w-full items-center gap-2">
                      <label
                        htmlFor="fecha_adquisicion"
                        className="text-sm font-medium"
                      >
                        Fecha de Adquisición
                      </label>
                      <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        {formData.fecha_adquisicion || currentDate}
                      </div>
                      <p className="text-xs text-gray-500">
                        Fecha establecida automáticamente
                      </p>
                    </div>
                    {formData.fecha_mantenimiento &&
                      new Date(formData.fecha_adquisicion as string) >
                        new Date(formData.fecha_mantenimiento) && (
                        <p className="text-xs text-red-500 mt-1">
                          La fecha de adquisición no puede ser posterior a la
                          fecha de mantenimiento
                        </p>
                      )}
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {dialogMode === "create"
                            ? "Creando..."
                            : "Guardando..."}
                        </>
                      ) : dialogMode === "create" ? (
                        "Crear"
                      ) : (
                        "Guardar"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* Diálogo de confirmación de eliminación */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Confirmar eliminación</DialogTitle>
                  <DialogDescription>
                    ¿Está seguro que desea eliminar este artículo? Esta acción
                    no se puede deshacer.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDeleteDialogOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteArticle}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Eliminando...
                      </>
                    ) : (
                      "Eliminar"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total Artículos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {inventoryData.reduce(
                      (sum, article) => sum + article.inventario_total,
                      0
                    )}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Disponibles para entrega:{" "}
                    {inventoryData.reduce(
                      (sum, article) => sum + article.inventario_entrega,
                      0
                    )}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Artículos Entregados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const totalInventory = inventoryData.reduce(
                      (sum, article) => sum + article.inventario_total,
                      0
                    );
                    const availableInventory = inventoryData.reduce(
                      (sum, article) => sum + article.inventario_entrega,
                      0
                    );
                    const deliveredInventory =
                      totalInventory - availableInventory;
                    const deliveredPercentage =
                      totalInventory > 0
                        ? Math.round(
                            (deliveredInventory / totalInventory) * 100
                          )
                        : 0;

                    return (
                      <>
                        <p className="text-2xl font-bold text-orange-600">
                          {deliveredInventory}
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          {deliveredPercentage}% del inventario total
                        </p>
                        <div className="mt-3 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Ayuda Tecnica:</span>
                            <span className="text-sm font-medium">
                              {inventoryData
                                .filter(
                                  (article) =>
                                    article.categoria === "Ayuda Tecnica"
                                )
                                .reduce(
                                  (sum, article) =>
                                    sum +
                                    (article.inventario_total -
                                      article.inventario_entrega),
                                  0
                                )}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Ayuda Social:</span>
                            <span className="text-sm font-medium">
                              {inventoryData
                                .filter(
                                  (article) =>
                                    article.categoria === "Ayuda Social"
                                )
                                .reduce(
                                  (sum, article) =>
                                    sum +
                                    (article.inventario_total -
                                      article.inventario_entrega),
                                  0
                                )}
                            </span>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Por Categoría</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Ayuda Tecnica:</span>
                      <span className="text-sm font-medium">
                        {inventoryData
                          .filter(
                            (article) => article.categoria === "Ayuda Tecnica"
                          )
                          .reduce(
                            (sum, article) => sum + article.inventario_total,
                            0
                          )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Ayuda Social:</span>
                      <span className="text-sm font-medium">
                        {inventoryData
                          .filter(
                            (article) => article.categoria === "Ayuda Social"
                          )
                          .reduce(
                            (sum, article) => sum + article.inventario_total,
                            0
                          )}
                      </span>
                    </div>
                    <div className="flex justify-between mt-3">
                      <span className="text-sm font-medium">
                        Disponibles para entrega:
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        {inventoryData.reduce(
                          (sum, article) => sum + article.inventario_entrega,
                          0
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
