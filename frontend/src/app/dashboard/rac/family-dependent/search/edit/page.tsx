"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { employeeFamilyMemberSchema } from "../../../family-dependent/entry/schemas/familySchema";
import { z } from "zod";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { getFamilyAction } from "../../../family-dependent/entry/actions/family-actions";
import { useRouter } from "next/navigation";
import { employeeFamilyMember } from "../../../family-dependent/entry/types/employee";

const EmployeeSearchPage = () => {
  const [data, setData] = useState<employeeFamilyMember[]>([]);
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      const result = await getFamilyAction();
      const employeeFamilyMember: employeeFamilyMember[] = Array.isArray(result)
        ? result
        : [result];

      console.log(employeeFamilyMember);

      console.log(employeeFamilyMember);

      setData(employeeFamilyMember);
    };

    getData();
  }, []);

  const columns: ColumnDef<z.infer<typeof employeeFamilyMemberSchema>>[] = [
    {
      accessorKey: "employeeCedula",
      header: "Cedula Empleado",
    },
    {
      accessorKey: "cedulaIdentidad",
      header: "Cedula de Identidad",
    },
    {
      accessorKey: "nombreCompleto",
      header: "Apellidos y Nombres",
    },
    {
      accessorKey: "parentesco",
      header: "Parentesco",
    },
    {
      accessorKey: "fechaNacimiento",
      header: "Fecha Nacimiento",
    },
    {
      accessorKey: "sexo",
      header: "sexo",
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
    console.log("row: ", row.original);
    console.log(
      "employeeCedula: ",
      row.getVisibleCells()[0].getContext().getValue()
    );
    console.log(
      "nombreCompleto: ",
      row.getVisibleCells()[1].getContext().getValue()
    );

    router.push(`/family-dependent/edit/${row.original.id}`);
  };

  return (
    <div className="my-auto mx-4 ">
      <h2 className="text-2xl">Seleccione al Familiar a modificar</h2>
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
