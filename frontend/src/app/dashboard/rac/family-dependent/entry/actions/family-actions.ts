"use server";

import prisma from "@/lib/db/client";
import { z } from "zod";
import {
  employeeFamilyMemberEditSchema,
  employeeFamilyMemberRegisterSchema,
  employeeFamilyMemberSchema,
} from "../schemas/familySchema";
import { employeeFamilyMember } from "../types/employee";

export const entryFamilyAction = async (
  values: z.infer<typeof employeeFamilyMemberRegisterSchema>
) => {
  try {
    const { data, success } =
      employeeFamilyMemberRegisterSchema.safeParse(values);

    if (!success) {
      return { error: "Invalid data" };
    }

    /* const employee = await prisma.employeeFamilyMember.findUnique({
      where: {
        cedulaIdentidad: data.cedulaIdentidad,
      },
    });

    if (employee) {
      return { error: "Employee already exists" };
    } */

    /* const vacantFounded = await prisma.employee.findFirst({
      where: {
        estatus: 0,
      },
    });

    console.log(vacantFounded, "Vacant founded");

    if (vacantFounded == null) {
      return { error: "No vacant employees" };
    } */

    await prisma.employeeFamilyMember.create({
      data: {
        employeeCedula: data.employeeCedula,
        nombreCompleto: data.nombreCompleto,
        parentesco: data.parentesco,
        fechaNacimiento: data.fechaNacimiento,
        cedulaIdentidad: data.cedulaIdentidad,
        sexo: data.sexo,
        observaciones: data.observaciones,
      },
    });

    return { success: true };
  } catch (error) {
    return { error: "Error 500" };
  }
};

export const editFamilyAction = async (
  values: z.infer<typeof employeeFamilyMemberEditSchema>,
  id: string
) => {
  try {
    const { data, success } = employeeFamilyMemberEditSchema.safeParse(values);

    if (!success) {
      return { error: "Invalid data" };
    }

    const employeeFamilyMember = await prisma.employeeFamilyMember.findUnique({
      where: {
        id: id,
      },
    });

    if (employeeFamilyMember == null) {
      return { error: "employeeFamilyMember don't exists" };
    }

    await prisma.employeeFamilyMember.update({
      where: {
        id: data.id,
      },
      data: {
        employeeCedula: data.employeeCedula,
        nombreCompleto: data.nombreCompleto,
        parentesco: data.parentesco,
        sexo: data.sexo,
        fechaNacimiento: data.fechaNacimiento,
        cedulaIdentidad: data.cedulaIdentidad,
        observaciones: data.observaciones,
      },
    });

    return { success: true };
  } catch (error) {
    return { error: "Error 500" };
  }
};

export const removeFamilyAction = async (cedulaIdentidad: string) => {
  try {
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
  }
};

export const getFamilyAction = async (
  cedulaIdentidad: string = ""
): Promise<employeeFamilyMember | employeeFamilyMember[]> => {
  try {
    if (cedulaIdentidad) {
      const employee = await prisma.employeeFamilyMember.findUnique({
        where: {
          cedulaIdentidad: cedulaIdentidad,
        },
      });

      if (employee == null) {
        throw new Error("employeeFamilyMember doesn't exist");
      }

      return employee as employeeFamilyMember;
    } else {
      const employeeFamilyMember = await prisma.employeeFamilyMember.findMany();

      return employeeFamilyMember as employeeFamilyMember[];
    }
  } catch (error) {
    throw error;
  }
};
