"use client";

import { useForm } from "react-hook-form";
import { set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { employeeFamilyMemberRegisterSchema } from "../schemas/familySchema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { entryFamilyAction } from "../actions/family-actions";
import { toast } from "sonner";

export const FormRegisterFamily = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<
    z.infer<typeof employeeFamilyMemberRegisterSchema>[]
  >([]);
  const [showTable, setShowTable] = useState(false);

  const form = useForm<z.infer<typeof employeeFamilyMemberRegisterSchema>>({
    resolver: zodResolver(employeeFamilyMemberRegisterSchema),
    defaultValues: {
      id: "",
      employeeCedula: "",
      nombreCompleto: "",
      parentesco: "",
      fechaNacimiento: "",
      cedulaIdentidad: "",
      sexo: "",
      observaciones: "",
    },
  });

  const onSubmit = (
    values: z.infer<typeof employeeFamilyMemberRegisterSchema>
  ) => {
    setError(null);

    console.log("onSubmit");

    if (values) {
      console.log("values", values);

      setData([values]);

      setShowTable(true);
    } else {
      throw new Error("Datos invalidos");
    }

    document.querySelector("#dialog")?.showModal();
  };

  const entryFamily = async () => {
    const response = await entryFamilyAction(data[0]);

    if (response.error) {
      setError(response.error);
    } else {
      toast.success("Registro Exitoso!");
      console.log(response, "Registro Exitoso! del familiar");

      router.push("/family-dependent/search/edit");
    }
  };

  const sexo = ["Femenino", "Masculino"];

  const columns: ColumnDef<
    z.infer<typeof employeeFamilyMemberRegisterSchema>
  >[] = [
    {
      accessorKey: "employeeCedula",
      header: "employeeCedula",
    },
    {
      accessorKey: "nombreCompleto",
      header: "Apellidos y Nombres",
    },
    {
      accessorKey: "parentesco",
      header: "parentesco",
    },
    {
      accessorKey: "fechaNacimiento",
      header: "fechaNacimiento",
    },
    {
      accessorKey: "cedulaIdentidad",
      header: "cedulaIdentidad",
    },
    {
      accessorKey: "sexo",
      header: "sexo",
    },
    {
      accessorKey: "observaciones",
      header: "observaciones",
    },
  ];

  //1. initialize table throught this hook
  const table = useReactTable({
    //1.1 Define columns
    columns,
    //1.2 Define data
    data: data,
    //1.3 call and pass the function getCoreRowModel()
    getCoreRowModel: getCoreRowModel(),
    //getPaginationRowModel: getPaginationRowModel(),
    //getSortedRowModel: getSortedRowModel(),
  });

  const parentescos = [
    { value: "conyuge", label: "Cónyuge/Pareja" },
    { value: "hijo", label: "Hijo(a)" },
    { value: "hijastro", label: "Hijastro(a)" },
    { value: "padre", label: "Padre" },
    { value: "madre", label: "Madre" },
    { value: "padrastro", label: "Padrastro" },
    { value: "madrastra", label: "Madrastra" },
    { value: "suegro", label: "Suegro(a)" },
    { value: "yerno", label: "Yerno" },
    { value: "nuera", label: "Nuera" },
    { value: "hermano", label: "Hermano(a)" },
    { value: "hermanastro", label: "Hermanastro(a)" },
    { value: "abuelo", label: "Abuelo(a)" },
    { value: "nieto", label: "Nieto(a)" },
    { value: "tio", label: "Tío(a)" },
    { value: "sobrino", label: "Sobrino(a)" },
    { value: "primo", label: "Primo(a)" },
    { value: "cunado", label: "Cuñado(a)" },
    { value: "concubino", label: "Concubino(a)" },
    { value: "tutor", label: "Tutor legal" },
    { value: "acudiente", label: "Acudiente" },
    { value: "otro", label: "Otro parentesco" },
  ];

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-[800] p-12 m-auto flex flex-col gap-4"
        >
          <h1 className="text-2xl">Ingresar familiar</h1>

          <div className="flex flex-row flex-wrap gap-2 justify-between items-center">
            {/* // Cedula trabajador */}
            <FormField
              control={form.control}
              name="employeeCedula"
              render={({ field }) => (
                <FormItem className="w-[320px]">
                  <FormLabel>Cédula del Trabajador</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Escriba la cedula del trabajador"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* // Cedula */}
            <FormField
              control={form.control}
              name="cedulaIdentidad"
              render={({ field }) => (
                <FormItem className="w-[320px]">
                  <FormLabel>Cédula</FormLabel>
                  <FormControl>
                    <Input placeholder="Escriba la cedula" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* // nombreCompleto */}
            <FormField
              control={form.control}
              name="nombreCompleto"
              render={({ field }) => (
                <FormItem className="w-[320px]">
                  <FormLabel>Nombre Completo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Escriba el Nombre Completo"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sexo */}

            <FormField
              control={form.control}
              name="sexo"
              render={({ field }) => (
                <FormItem className="w-[320px]">
                  <FormLabel>Sexo</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione el Sexo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sexo.map((selectValue, index) => {
                        return (
                          <SelectItem key={index} value={selectValue}>
                            {selectValue}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Parentesco */}

            <FormField
              control={form.control}
              name="parentesco"
              render={({ field }) => (
                <FormItem className="w-[320px]">
                  <FormLabel>Parentesco</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione el Parentesco" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {parentescos.map((selectValue, index) => {
                        return (
                          <SelectItem key={index} value={selectValue.value}>
                            {selectValue.label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Fecha Ingreso Organismo */}

            <FormField
              control={form.control}
              name="fechaNacimiento"
              render={({ field }) => (
                <FormItem className="w-[320px]">
                  <FormLabel>Fecha de Nacimiento</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingrese la fecha de nacimiento"
                      type="date"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Observaciones */}

            <FormField
              control={form.control}
              name="observaciones"
              render={({ field }) => (
                <FormItem className="w-[320px]">
                  <FormLabel>Observaciones</FormLabel>
                  <FormControl>
                    <Input placeholder="Escriba una observación" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && <FormMessage>{error}</FormMessage>}
          </div>

          <Button type="submit" className="bg-blue-600">
            Enviar
          </Button>
        </form>
      </Form>

      <dialog id="dialog" className="w-[90%] p-4 rounded">
        {showTable && (
          <div className=" m-auto p-2">
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
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        <div className="flex gap-2">
          <Button
            onClick={() => document.querySelector("#dialog").close()}
            className="bg-red-600"
          >
            Cancelar
          </Button>

          <Button onClick={entryFamily} className="bg-green-600">
            Confirmar
          </Button>
        </div>
      </dialog>
    </div>
  );
};

export default FormRegisterFamily;
