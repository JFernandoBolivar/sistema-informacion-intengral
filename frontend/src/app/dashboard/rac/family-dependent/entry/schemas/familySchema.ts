import { z } from "zod";

export const employeeFamilyMemberRegisterSchema = z.object({
  //id: z.string({ required_error: " is required" }).min(1, " is required"),
  employeeCedula: z
    .string({ required_error: " is required" })
    .min(1, " is required"),
  nombreCompleto: z
    .string({ required_error: " is required" })
    .min(1, " is required"),
  parentesco: z
    .string({ required_error: " is required" })
    .min(1, " is required"),
  fechaNacimiento: z
    .string({ required_error: " is required" })
    .min(1, " is required"),
  cedulaIdentidad: z
    .string({ required_error: " is required" })
    .min(1, " is required"),
  sexo: z.string({ required_error: " is required" }).min(1, " is required"),
  observaciones: z.string(),
});

export const employeeFamilyMemberSchema = z.object({
  //id: z.string({ required_error: " is required" }).min(1, " is required"),
  employeeCedula: z
    .string({ required_error: " is required" })
    .min(1, " is required"),
  nombreCompleto: z
    .string({ required_error: " is required" })
    .min(1, " is required"),
  parentesco: z
    .string({ required_error: " is required" })
    .min(1, " is required"),
  fechaNacimiento: z
    .string({ required_error: " is required" })
    .min(1, " is required"),
  cedulaIdentidad: z
    .string({ required_error: " is required" })
    .min(1, " is required"),
  sexo: z.string({ required_error: " is required" }).min(1, " is required"),
  observaciones: z.string(),
});

export const employeeFamilyMemberEditSchema = z.object({
  id: z.string({ required_error: " is required" }).min(1, " is required"),
  employeeCedula: z
    .string({ required_error: " is required" })
    .min(1, " is required"),
  nombreCompleto: z
    .string({ required_error: " is required" })
    .min(1, " is required"),
  parentesco: z
    .string({ required_error: " is required" })
    .min(1, " is required"),
  fechaNacimiento: z
    .string({ required_error: " is required" })
    .min(1, " is required"),
  cedulaIdentidad: z
    .string({ required_error: " is required" })
    .min(1, " is required"),
  sexo: z.string({ required_error: " is required" }).min(1, " is required"),
  observaciones: z.string(),
});
