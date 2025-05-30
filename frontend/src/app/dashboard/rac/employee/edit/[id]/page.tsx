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
import { employeeRegisterSchema } from "../../entry/schemas/employeeSchema";
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
//import { getEmployeesAction } from "@/actions/employee-actions";
import EditEmployeeForm from "./components/formEditEmployee.tsx";

export const employee = {
  cedulaIdentidad: "12345678",
  apellidosYNombres: "Pérez Juan",
  sexo: "Masculino",
  denominacionCargo: "DIRECTOR",
  denominacionCargoEspecifico: "DIRECTOR DE GESTION",
  grado: "6",
  fechaIngresoOrganismo: "2020-01-15",
  fechaIngresoAPN: "2020-01-15",
  tipoNomina: "EMPLEADO",
  ubicacionAdministrativa: "OFICINA DE GESTION HUMANA",
  ubicacionFisica: "OFICINA DE GESTION HUMANA",
  estatus: "1",
  observaciones: "",
};

const EditEmployeeFormPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  console.log(id);

  console.log(employee);

  return <div>{<EditEmployeeForm employee={employee} />}</div>;
};

export default EditEmployeeFormPage;
