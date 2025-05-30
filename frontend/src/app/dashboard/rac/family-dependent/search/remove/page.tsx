"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { employeeDBSchema } from "@/app/(protected)/employee/entry/schemas/employeeSchema";
import { z } from "zod";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import {
  getEmployeesAction,
  removeEmployeeAction,
} from "@/actions/employee-actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const EmployeeSearchPage = () => {
  const [data, setData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      const data = await getEmployeesAction();

      console.log(data);

      setData(data);
    };

    getData();
  }, []);

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

  const table = useReactTable({
    //1.1 Define columns
    columns,
    //1.2 Define data
    data: data,
    //1.3 call and pass the function getCoreRowModel()
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleClick = async (row) => {
    const cedulaIdentidad = row.getVisibleCells()[0].getContext().getValue();
    const response = await removeEmployeeAction(cedulaIdentidad);

    if (response.error) {
      console.log(response.error);
    } else {
      toast.success("Empleado removido");
      router.push("/employee/search/edit");
    }
  };

  return (
    <div className="my-auto mx-4 ">
      <h2 className="text-2xl">Seleccione al trabajador a remover</h2>
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
                <TableCell key={cell.id} onClick={() => handleClick(row)}>
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

export default EmployeeSearchPage;
