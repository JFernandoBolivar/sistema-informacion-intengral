"use server";

import { employeeRegisterSchema } from "../schemas/employeeSchema";
import { Employee } from "../types/employee";
//import prisma from "@/lib/db/client";
import { z } from "zod";

export const entryEmployeeAction = async (
  values: z.infer<typeof employeeRegisterSchema>
) => {
  /* try {
    const { data, success } = employeeRegisterSchema.safeParse(values);

    if (!success) {
      return { error: "Invalid data" };
    }

    const employee = await prisma.employee.findUnique({
      where: {
        cedulaIdentidad: data.cedulaIdentidad,
      },
    });

    if (employee) {
      return { error: "Employee already exists" };
    }

    const vacantFounded = await prisma.employee.findFirst({
      where: {
        estatus: 0,
      },
    });

    console.log(vacantFounded, "Vacant founded");

    if (vacantFounded == null) {
      return { error: "No vacant employees" };
    }

    await prisma.employee.update({
      where: {
        cedulaIdentidad: vacantFounded.cedulaIdentidad,
      },
      data: {
        cedulaIdentidad: data.cedulaIdentidad,
        apellidosYNombres: data.apellidosYNombres,
        sexo: data.sexo,
        denominacionCargo: data.denominacionCargo,
        denominacionCargoEspecifico: data.denominacionCargoEspecifico,
        grado: data.grado,
        fechaIngresoOrganismo: data.fechaIngresoOrganismo,
        fechaIngresoAPN: data.fechaIngresoAPN,
        tipoNomina: data.tipoNomina,
        ubicacionAdministrativa: data.ubicacionAdministrativa,
        ubicacionFisica: data.ubicacionFisica,
        observaciones: data.observaciones,
        estatus: 1,
      },
    });

    return { success: true, vacantFounded };
  } catch (error) {
    return { error: "Error 500" };
  } */
};

export const editEmployeeAction = async (
  values: z.infer<typeof employeeRegisterSchema>,
  cedulaIdentidad: string
) => {
  /* try {
    const { data, success } = employeeRegisterSchema.safeParse(values);

    if (!success) {
      return { error: "Invalid data" };
    }

    const employee = await prisma.employee.findUnique({
      where: {
        cedulaIdentidad: cedulaIdentidad,
      },
    });

    if (employee == null) {
      return { error: "Employee don't exists" };
    }

    const lastCode = await String((await prisma.employee.count()) + 1);

    console.log(lastCode, "Last code");

    await prisma.employee.update({
      where: {
        cedulaIdentidad: cedulaIdentidad,
      },
      data: {
        cedulaIdentidad: data.cedulaIdentidad,
        apellidosYNombres: data.apellidosYNombres,
        sexo: data.sexo,
        denominacionCargo: data.denominacionCargo,
        denominacionCargoEspecifico: data.denominacionCargoEspecifico,
        grado: data.grado,
        fechaIngresoOrganismo: data.fechaIngresoOrganismo,
        fechaIngresoAPN: data.fechaIngresoAPN,
        tipoNomina: data.tipoNomina,
        ubicacionAdministrativa: data.ubicacionAdministrativa,
        ubicacionFisica: data.ubicacionFisica,
        observaciones: data.observaciones,
      },
    });

    return { success: true };
  } catch (error) {
    return { error: "Error 500" };
  } */
};

export const removeEmployeeAction = async (cedulaIdentidad: string) => {
  /*   try {
    const employee = await prisma.employee.findUnique({
      where: {
        cedulaIdentidad: cedulaIdentidad,
      },
    });

    if (employee == null) {
      return { error: "Employee don't exists" };
    }

    await prisma.employee.delete({
      where: {
        cedulaIdentidad: cedulaIdentidad,
      },
    });

    return { success: true };
  } catch (error) {
    return { error: "Error 500" };
  } */
};

/* export const getEmployeesAction = async (
  cedulaIdentidad: string = ""
): Promise<Employee | Employee[]> => {
  try {
    if (cedulaIdentidad) {
      const employee = await prisma.employee.findUnique({
        where: {
          cedulaIdentidad: cedulaIdentidad,
        },
      });

      if (employee == null) {
        throw new Error("Employee doesn't exist");
      }

      return employee as Employee;
    } else {
      const employees = await prisma.employee.findMany();

      return employees as Employee[];
    }
  } catch (error) {
    throw error;
  }
}; */
