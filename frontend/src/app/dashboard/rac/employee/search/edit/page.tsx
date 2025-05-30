"use client";
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
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
//import { getEmployeesAction } from "../../entry/actions/employee-actions";
import { useRouter } from "next/navigation";
import { Employee } from "../../entry/types/employee";
import { employee } from "../../edit/[id]/page";

const EmployeeSearchPage = () => {
  const [data, setData] = useState<Employee[]>([]);
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      const result = employee;
      const employees: Employee[] = Array.isArray(result) ? result : [result];

      console.log(employees);

      const dataFiltered = employees.filter(
        (employee) => employee.apellidosYNombres != "VACANTE"
      );

      console.log(dataFiltered);

      setData(dataFiltered);
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
    //getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleClick = (row) => {
    console.log(row.getVisibleCells()[0].column.id);
    console.log(row.getVisibleCells()[0]);
    console.log(row.getVisibleCells()[0].column.columnDef);
    console.log(row.getVisibleCells()[0].getContext().getValue());

    router.replace(
      `/dashboard/rac/employee/edit/${row
        .getVisibleCells()[0]
        .getContext()
        .getValue()}`
    );

    /* router.push(
      `/dashboard/rac/employee/edit${row
        .getVisibleCells()[0]
        .getContext()
        .getValue()}`
    ); */
  };

  return (
    <div className="my-auto mx-4 ">
      <h2 className="text-2xl">Seleccione al trabajador a modificar</h2>
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
