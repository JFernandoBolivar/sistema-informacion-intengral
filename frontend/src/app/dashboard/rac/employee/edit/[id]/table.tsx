"use client";
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { employeeDBSchema } from "../../entry/schemas/employeeSchema";
import { z } from "zod";

const Tabla = (data: z.infer<typeof employeeDBSchema>[]) => {
  const getData = () => {
    return data;
  };

  const columns: ColumnDef<z.infer<typeof employeeDBSchema>>[] = [
    {
      accessorKey: "cedulaIdentidad",
      header: "Cédula de Identidad",
    },
    {
      accessorKey: "apellidosYNombres",
      header: "Apellidos y Nombres",
    },
    {
      accessorKey: "grado",
      header: "Grado",
    },
    {
      accessorKey: "tipoNomina",
      header: "Tipo de Nómina",
    },
    {
      accessorKey: "fechaIngresoOrganismo",
      header: "Fecha Ingreso Organismo",
    },
    {
      accessorKey: "fechaIngresoAPN",
      header: "Fecha Ingreso APN",
    },
    {
      accessorKey: "ubicacionAdministrativa",
      header: "Ubicación Administrativa",
    },
    {
      accessorKey: "ubicacionFisica",
      header: "Ubicación Física",
    },
    {
      accessorKey: "sexo",
      header: "Sexo",
    },
    {
      accessorKey: "denominacionCargo",
      header: "Denominación de Cargo",
    },
    {
      accessorKey: "denominacionCargoEspecifico",
      header: "Denominación de Cargo Específico",
    },
    {
      accessorKey: "observaciones",
      header: "Observaciones",
    },
  ];

  //1. initialize table throught this hook
  const table = useReactTable({
    //1.1 Define columns
    columns,
    //1.2 Define data
    data: getData(),
    //1.3 call and pass the function getCoreRowModel()
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="w-[800] m-auto">
      <Table className="w-max">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="h-2">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : (
                    <div>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </div>
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Tabla;
