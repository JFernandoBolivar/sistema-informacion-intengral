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
import { employeeRegisterSchema } from "@/app/(protected)/employee/entry/schemas/employeeSchema";
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
import { getEmployeesAction } from "@/actions/employee-actions";
import EditEmployeeFamilyMemberForm from "./components/formEditEmployeeFamilyMemberForm";
import prisma from "@/lib/db/client";

const EditEmployeeFamilyMemberFormPage = async ({
  params,
}: {
  params: { id: string };
}) => {
  const { id } = params;

  const employeeFamilyMember = await prisma.employeeFamilyMember.findUnique({
    where: {
      id: id,
    },
  });

  console.log(employeeFamilyMember);

  if (employeeFamilyMember == null) {
    return { error: "EmployeeFamilyMember don't exists" };
  }

  return (
    <div>
      {
        <EditEmployeeFamilyMemberForm
          employeeFamilyMember={{
            ...employeeFamilyMember,
            cedulaIdentidad: employeeFamilyMember.cedulaIdentidad ?? "",
          }}
        />
      }
    </div>
  );
};

export default EditEmployeeFamilyMemberFormPage;
