import { z, string, number } from "zod";

export const employeeRegisterSchema = z.object({
  cedulaIdentidad: string({ required_error: " is required" }).min(
    1,
    " is required"
  ),
  apellidosYNombres: string({ required_error: " is required" }).min(
    1,
    " is required"
  ),
  sexo: z.string({ required_error: " is required" }).min(1, " is required"),
  denominacionCargo: string({ required_error: " is required" }).min(
    1,
    " is required"
  ),
  denominacionCargoEspecifico: string({ required_error: " is required" }).min(
    1,
    " is required"
  ),
  grado: z.string({ required_error: " is required" }).min(1, " is required"),
  fechaIngresoOrganismo: string({ required_error: " is required" }).min(
    1,
    " is required"
  ),
  fechaIngresoAPN: string({ required_error: " is required" }).min(
    1,
    " is required"
  ),
  tipoNomina: string({ required_error: " is required" }).min(1, " is required"),
  ubicacionAdministrativa: string({ required_error: " is required" }).min(
    1,
    " is required"
  ),
  ubicacionFisica: string({ required_error: " is required" }).min(
    1,
    " is required"
  ),
  observaciones: string(),
});

export const employeeDBSchema = z.object({
  codigo: string({ required_error: " is required" }).min(1, " is required"),
  cedulaIdentidad: string({ required_error: " is required" }).min(
    1,
    " is required"
  ),
  apellidosYNombres: string({ required_error: " is required" }).min(
    1,
    " is required"
  ),
  sexo: z.string({ required_error: " is required" }).min(1, " is required"),
  denominacionCargo: string({ required_error: " is required" }).min(
    1,
    " is required"
  ),
  denominacionCargoEspecifico: string({ required_error: " is required" }).min(
    1,
    " is required"
  ),
  grado: z.string({ required_error: " is required" }).min(1, " is required"),
  fechaIngresoOrganismo: string({ required_error: " is required" }).min(
    1,
    " is required"
  ),
  fechaIngresoAPN: string({ required_error: " is required" }).min(
    1,
    " is required"
  ),
  tipoNomina: string({ required_error: " is required" }).min(1, " is required"),
  ubicacionAdministrativa: string({ required_error: " is required" }).min(
    1,
    " is required"
  ),
  ubicacionFisica: string({ required_error: " is required" }).min(
    1,
    " is required"
  ),
  observaciones: string(),
  estatus: number(),
});
