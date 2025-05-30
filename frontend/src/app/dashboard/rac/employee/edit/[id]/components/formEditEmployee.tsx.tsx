"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { employeeRegisterSchema } from "../../../entry/schemas/employeeSchema";
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
import { editEmployeeAction } from "../../../entry/actions/employee-actions";
import { toast } from "sonner";

const EditEmployeeForm = (employee) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<z.infer<typeof employeeRegisterSchema>[]>(
    []
  );

  console.log(employee);

  const employeeInit = { ...employee };

  const [showTable, setShowTable] = useState(false);

  const form = useForm<z.infer<typeof employeeRegisterSchema>>({
    resolver: zodResolver(employeeRegisterSchema),
    defaultValues: employeeInit.employee,
  });

  const onSubmit = async (values: z.infer<typeof employeeRegisterSchema>) => {
    setError(null);

    if (values) {
      console.log(values);

      setData([values]);

      setShowTable(true);
    }

    document.querySelector("#dialog").showModal();
  };

  const editEmployee = async () => {
    const response = await editEmployeeAction(
      data[0],
      employeeInit.employee.cedulaIdentidad
    );

    if (response.error) {
      setError(response.error);
    } else {
      toast.success("Registro Exitoso!");
      setTimeout(() => {
        router.push("/employee/search/edit");
      }, 10000);
    }
  };

  const denominacionCargo = [
    "DIRECTOR GENERAL",
    "DIRECTOR",
    "DIRECTOR PRE-ESCOLAR",
    "ADJUNTO AL DIRECTOR",
    "ASISTENTE AL DIRECTOR",
    "COORDINADOR",
    "JEFE DE DEPARTAMENTO",
    "ASESOR TECNICO DE PERSONAL",
    "ARMERO",
    "PROFESOR COORDINADOR II",
    "PROFESOR DE MUSICA",
    "COMISION DE SERVICIO",
    "BACHILLER I",
    "BACHILLER II",
    "BACHILLER III",
    "TECNICO I",
    "TECNICO II",
    "PROFESIONAL I",
    "PROFESIONAL II",
    "PROFESIONAL III",
    "ASEADOR",
    "ASCENSORISTA",
    "PORTERO",
    "MENSAJERO",
    "OPERADOR DE COMPAG. ENCUADER.",
    "AYUDANTE DE SERVICIOS DE COCINA",
    "AYUDANTE DE SERVICIO GENERALES",
    "AYUDANTE DE MECANICA GENERAL",
    "OPERADOR DE MAQ. FOTOCOPIADORA",
    "OPERADOR DE EQUIPOS DE TELECOMUNICACIONES",
    "CHOFER DE TRANSPORTE",
    "MENSAJERO MOTORIZADO",
    "RECEPTOR DE INFORMACION",
    "PINTOR",
    "JARDINERO",
    "BARBERO",
    "CHOFER",
    "PLOMERO",
    "AUXILIAR DE FARMACIA",
    "AUXILIAR DE SERVICIOS DE OFICINA",
    "AYUDANTE DE ALMACEN",
    "COCINERO",
    "ALBAÑIL",
    "CHOFER DE CARGA",
    "NIÑERA",
    "VIGILANTE",
    "AUXILIAR DE ENFERMERIA",
    "AUXILIAR DE NUTRICION",
    "MECANICO AUTOMOTRIZ",
    "MECANICO DE REFRIGERACION",
    "ESCOLTA",
    "ELECTROMECANICO",
    "ELECTRICISTA DE ALTA TENSION",
    "MECANICO DE MOTORES DIESEL",
    "SUPERVISOR DE COCINA",
    "SUPERVISOR SERVICIOS INTERNOS",
    "SUPERVISOR SERVICIOS ESPECIALIZADO",
    "MEDICO JEFE III",
    "MEDICO I",
    "MEDICO II",
    "MEDICO ESPECIALISTA I",
    "MEDICO ESPECIALISTA II",
    "PASANTE",
    "CONTRATADO",
    "MINISTRO",
    "ASESOR",
    "ASISTENTE ADMINISTRATIVO I",
    "ASISTENTE SUPERVISOR DE SEGURIDAD",
    "COMISIONADO DEL MINISTRO",
    "OFICIAL DE SEGURIDAD",
    "SECRETARIA PRIVADA",
    "AYUDANTE DE SERVICIOS GENERALES",
    "MESONERO",
    "RECEPTOR INFORMADOR",
    "SUPERVISOR DE SEGURIDAD",
    "HONORARIOS PROFESIONALES",
    "DIRECTOR ADJUNTO",
    "ASISTENTE",
    "AUDITOR INTERNO",
    "OPERARIO DE EQUIPOS DE TELECOMUNICACIONES",
    "AUXILIAR DE TELECOMUNICACIONES",
    "FOTOGRABADOR PLANCHISTA",
    "APOYO INSTITUCIONAL",
    "VICEMINISTRO",
    "COORDINADOR ESTADAL",
    "COORDINADOR MUNICIPAL",
    "SUPERVISOR INTER. PALEOG.",
    "CARPINTERO",
    "GUIA VACACIONISTA",
    "SUPERVISOR DE VIVEROS",
    "SUPERVISOR REPRODUCCION E IMPRESION",
    "AYUDANTE ARTES GRAFICAS",
    "ASIST. PENITENCIARIO II",
    "ASISTENTE DE SEGURIDAD",
    "COMISIONADO ASUNTOS ADMINISTRATIVOS",
    "INSPECTOR JEFE DE SEGURIDAD II",
    "OFICIAL JEFE DE SEGURIDAD I",
    "OFICIAL JEFE DE SEGURIDAD III",
    "SUPERVISOR DE SEGURIDAD (99)",
    "SUPERVISOR DE SEGURIDAD I",
    "VIGILANTE (99)",
    "SUPERVISOR SERVICIOS ESPECIALIZADOS",
  ];

  const sexo = ["Femenino", "Masculino"];

  const denominacionCargoEspecifico = [
    "MINISTRO",
    "DIRECTOR DE GESTION",
    " ANALISIS Y DOCUMENTACION",
    "DIRECTOR",
    "ADJUNTO AL DIRECTOR",
    "ASISTENTE AL DIRECTOR",
    "COORDINADOR",
    "COORDINADOR DE ANALISIS Y DOCUMENTACION",
    "COORDINADOR DE ASUNTOS BILATERALES",
    "COORDINADOR DE TALENTO HUMANO",
    "COORDINADOR DE BRIGADA ESPECIAL DE LOS GRUPOS GENERADORES DE VIOLENCIA",
    "COORDINADOR DE ARTICULACION SOCIAL",
    "SECRETARIO I",
    "ARCHIVISTA II",
    "ASISTENTE ADMINISTRATIVO III",
    "ASEADOR",
    "CHOFER",
    "AUXILIAR DE SERVICIOS DE OFICINA",
    "ESCOLTA",
    "ELECTROMECANICO",
    "SUPERVISOR DE SERVICIOS INTERNOS ",
    "SUPERVISOR DE SEGURIDAD",
    "SUPERVISOR DE SERVICIOS ESPECIALIZADOS",
    "CONTRATADO",
    "COMISION DE SERVICIO",
    "HONORARIOS PROFESIONALES",
    "CONSULTOR JURIDICO",
    "DIRECTOR DE ESTUDIOS NORMATIVOS Y DICTAMENES JURIDICOS",
    "DIRECTOR DE ASUNTOS ADMINISTRATIVOS Y RECURSOS JURIDICOS",
    "ASISTENTE AL CONSULTOR",
    "ABOGADO I",
    "ABOGADO II",
    "ABOGADO III",
    "AUDITOR INTERNO",
    "DIRECCION DE CONTROL POSTERIOR",
    "DIRECCION DE DETERMINACIONES DE RESPONSABILIDADES",
    "COORDINACION DE AUDITORIAS",
    "COORDINACION DE ACTAS DE ENTREGA",
    "COORDINACION DE EXAMEN DE LA CUENTA",
    "SECRETARIO EJECUTIVO III",
    "ARCHIVISTA III",
    "TECNICO ADMINISTRATIVO I",
    "ADMINISTRADOR I",
    "AUDITOR III",
    "MECANICO AUTOMOTRIZ",
    "DIRECTOR GENERAL DE LA OFICINA DE GESTION COMUNICACIONAL",
    "ADJUNTO AL DIRECTOR ",
    "COORDINADOR DE PRODUCCION",
    "COORDINADOR DE AUDIOVISUALES",
    "ASISTENTE DE FOTOGRAFIA II",
    "ASISTENTE DE REDES II",
    "BACHILLER III",
    "TECNICO EN FOTOGRAFIA II",
    "ANALISTA DE TELECOMUNICACIONES I",
    "COMUNICADOR SOCIAL I",
    "FOTOGRABADOR PLANCHISTA",
    "APOYO INSTITUCIONAL ",
    "DIRECTOR GENERAL DE LA OFICINA DE TECNOLOGIA DE LA INFORMACION Y LA COMUNICACION",
    "DIRECTOR DE CONTROL DE PROYECTOS",
    "DIRECTOR DE SOPORTE TECNICO",
    "COORDINADOR DE MANTENIMIENTO TECNOLOGICO",
    "COORDINADOR DE BASES DE DATOS",
    "COORDINADOR DE DESARROLLO DE SISTEMA",
    "COORDINADOR DE EQUIPAMIENTO TECNOLOGICO",
    "COORDINADOR DE ANALISIS Y DISEÑO DE SISTEMA",
    "COORDINADOR DE TELEFONIA",
    "COORDINADOR DE ATENCION AL USUARIO",
    "COORDINADOR DE SEGUIMIENTO Y PROYECTOS",
    "COORDINADOR DE INTEGRIDAD DE DATOS",
    "COORDINADOR DE INNOVACION Y ESTANDARIZACION ",
    "COORDINADOR DEL CENTRO INTEGRAL DE SERVICIOS TECNOLOGICOS",
    "ASISTENTE DE SOPORTE TECNICO I",
    "OPERADOR DE SOPORTE I",
    "ASISTENTE DE MANTENIMIENTO I",
    "ASISTENTE ADMINISTRATIVO I",
    "ASISTENTE DE EQUIPARAMIENTO TECNOLOGICO III",
    "ASISTENTE DE SOPORTE TECNICO III",
    "TECNICO EN MANTENIMIENTO DE SISTEMAS DE SEGURIDAD I",
    "TECNICO EN TELECOMUNICACIONES II",
    "ANALISTA DE TECNOLOGIA DE INFORMACION III",
    "ANALISTA DE DESARROLLO DE SISTEMA Y BASE DE DATOS III",
    "ANALISTA DE TELECOMUNICACIONES III",
    "DIRECTOR GENERAL DE PLANIFICACION Y PRESUPUESTO",
    "DIRECTOR DE PRESUPUESTO",
    "DIRECTOR DE PLANIFICACION",
    "DIRECTOR DE ORGANIZACION Y SISTEMA",
    "COORDINADOR DE DISEÑO ORGANIZACIONAL",
    "COORDINADOR DE PLANIFICACION",
    "COORDINADOR DE CONTROL INTERNO",
    "COORDINADOR DE SEGUIMIENTO Y CONTROL DE ENTES EN MATERIA DE PLANIFICACION",
    "COORDINADOR DE CONTROL DE PRESUPUESTO ENTES",
    "COORDINADOR DE CONTROL Y SEGUIMIENTO DE PROYECTOS Y ACCION CENTRALIZADA",
    "COORDINADOR DE CONTROL Y SEGUIMIENTO DE PROGRAMAS Y EJECUCION FINANCIERA",
    "TECNICO EN ORGANIZACION, METODOS Y SISTEMAS II",
    "TECNICO EN PRESUPUESTO II",
    "TECNICO EN ORGANIZACION, METODOS Y SISTEMAS I",
    "PLANIFICADOR II",
    "ANALISTA DE PRESUPUESTO II",
    "PLANIFICADOR III",
    "RECEPTOR INFORMADOR",
    "DIRECTOR GENERAL DE LA OFICINA ESTRATEGICA DE SEGUIMIENTO Y EVALUACION DE POLITICAS PUBLICAS",
    "DIRECTOR DE EVALUACION DE POLITICAS PUBLICAS",
    "DIRECTOR DE ANALISIS DEL ENTORNO",
    "DIRECTOR DE SEGUIMIENTO DE ORDENES MINISTERIALES Y DE GOBIERNO",
    "DIRECTOR DE MEDICION E IMPACTO DE POLITICAS PUBLICAS",
    "COORDINADOR DE CUERPOS DE INSPECTORES",
    "COORDINADOR DE SEGUIMIENTO DE ORDENES MINISTERIALES Y DE GOBIERNO",
    "COORDINADOR DE EVALUACION FOCALIZADA",
    "TECNICO ADMINISTRATIVO II",
    "DIRECTOR GENERAL",
    "BACHILLER I",
    "BACHILLER II",
    "TECNICO I",
    "TECNICO II",
    "PROFESIONAL I",
    "PROFESIONAL II",
    "PROFESIONAL III",
    "ASCENSORISTA",
    "AYUDANTE DE SERVICIOS GENERALES",
    "AYUDANTE DE ALMACEN ",
    "PLOMERO",
    "CHOFER DE TRANSPORTE",
    "CHOFER DE CARGA",
    "MECANICO DE REFRIGERACION",
    "CARPINTERO",
    "ALBAÑIL",
    "ELECTRICISTA DE ALTA TENSION",
    "SUPERVISOR DE TRANSPORTE",
    "SUPERVISOR REPRODUCCION E IMPRESION",
    "COORDINADORA DE BENEFICIOS",
    "COORDINADOR DE SEGURIDAD SOCIAL",
    "DIRECTOR GENERAL DE LA OFICINA DE PROTECCION Y SEGURIDAD INTEGRAL",
    "DIRECTOR DE SEGURIDAD FISICA Y LOGICA",
    "DIRECTOR DE SEGURIDAD INDUSTRIAL E HIGIENE LABORAL",
    "COORDINADOR DE SEGURIDAD INDUSTRIAL",
    "COORDINADOR DE SEGURIDAD LOGICA",
    "COORDINADOR DE HIGIENE LABORAL",
    "COORDINADOR DE SEGURIDAD FISICA",
    "ASESOR",
    "ANALISTA DE MANTENIMIENTO DE SISTEMAS DE SEGURIDAD II",
    "ANALISTA DE RIESGOS Y DESASTRES III",
    "ANALISTA DE MANTENIMIENTO DE SISTEMAS DE SEGURIDAD III",
    "MENSAJERO",
    "VIGILANTE",
    "DIRECTOR GENERAL DE LA OFICINA DE ATENCION AL CIUDADANO",
    "COORDINADOR DE ASISTENCIA JURIDICA GRATUITA",
    "ASISTENTE DE ASUNTOS LEGALES III",
    "DIRECTOR GENERAL DE LA OFICINA ADMINISTRATIVA DE LA SECRETARIA EJECUTIVA DEL CONSEJO GENERAL DE POLICIA",
    "DIRECTOR DE INVESTIGACION Y SISTEMATIZACION EN EL AMBITO POLICIAL",
    "DIRECTOR DE DESARROLLO NORMATIVO Y DE POLITICAS PUBLICAS EN EL AMBITO POLICIAL",
    "DIRECTOR  DE PARTICIPACION DEL PODER POPULAR",
    "COORDINADOR DE AREA DE GESTION ADMINISTRATIVA",
    "COORDINADOR DE AREA DE  DESARROLLO NORMATIVO Y DE POLITICAS PUBLICAS EN EL AMBITO POLICIAL",
    "COORDINADOR DE AREA DE CONSULTA POPULAR POPULAR Y PROMOCION DEL MODELO POLICIAL BOLIVARIANO",
    "ASISTENTE DE TECNOLOGIAS DE LA INFORMACION I",
    "ASISTENTE ADMINISRATIVO III",
    "DIRECTOR GENERAL DE LA OFICINA DE GESTION HUMANA",
    "DIRECTORA DE ADMINISTRACION DE PERSONAL",
    "DIRECTOR DE ASESORIA Y ASUNTOS LEGALES",
    "DIRECTOR DE BIENESTAR SOCIAL",
    "DIRECTORA DE PLANIFICACION Y DESARROLLO DE PERSONAL",
    "COORDINADOR DE ASESORIA Y ASUNTOS LEGALES",
    "COORDINADOR DE REGISTRO Y CONTROL",
    "COORDINADORA DE PRESUPUESTO",
    "COORDINADORA CENTRO DE EDUCACION INICIAL",
    "COORDINADOR DE EVALUACION Y DESARROLLO",
    "COORDINADOR DE PASIVOS LABORALES",
    "COORDINADORA DE ARCHIVO DE PERSONAL",
    "COORDINADORA DE SERVICIO MEDICO Y ODONTOLOGICO",
    "COORDINADOR DE ATENCION A TRABAJADORES, JUBILADOS Y PENSIONADOS",
    "COORDINADOR DE AREA DE DEPORTE, CULTURA Y RECREACION",
    "COORDINADOR DE CAPTACION E INGRESO",
    "ASISTENTE DE PRE-ESCOLAR I",
    "ASISTENTE DE PRE-ESCOLAR II",
    "ASISTENTE DE ANALISTA III",
    "PROMOTOR DE EVENTOS CULTURALES III",
    "ASISTENTE DE PRE-ESCOLAR III",
    "ENFERMERA III",
    "TECNICO EN RECURSOS HUMANOS I",
    "TECNICO EN PREESCOLAR I",
    "TECNICO DE EMERGENCIA I",
    "TECNICO EN RECURSOS HUMANOS II",
    "TECNICO PRESCOLAR II",
    "ANALISTA DE RECURSOS HUMANOS I",
    "DOCENTE DE AULA I",
    "ENFERMERA I",
    "DOCENTE DE EDUCACION INICIAL I",
    "MEDICO ESPECIALISTA II",
    "DOCENTE DE AULA II",
    "ANALISTA DE RECURSOS HUMANOS II",
    "DOCENTE EN EDUCACION INICIAL II",
    "ANALISTA DE PROYECTOS II",
    "ANALISTA DE RECURSOS HUMANOS III",
    "DOCENTE EN EDUCACION INICIAL III",
    "MEDICO ESPECIALISTA III",
    "PSICOPEDAGOGO III",
    "DOCENTE DE AULA III",

    "AYUDANTE DE SERVICIOS DE COCINA",
    "NIÑERA",
    "AUXILIAR DE FARMACIA",
    "OPERADOR DE EQUIPOS DE TELECOMUNICACIONES ",
    "COCINERO",
    "AUXILIAR DE ENFERMERIA",
    "MECANICO DE MOTORES DIESEL",
    "SUPERVISOR DE COCINA",
    "VICEMINISTRO PARA LA GESTION DE RIESGO Y PROTECCION CIVIL",
    "DIRECTOR GENERAL DE COORDINACION NACIONAL DE BOMBEROS Y BOMBERAS Y ADMINISTRACION DE EMERGENCIAS DE CARACTER CIVIL",
    "DIRECTOR GENERAL DEL DESPACHO DEL VICEMINISTRO",
    "DIRECTOR GENERAL DE GESTION EDUCATIVA PARA LA PREVENCION Y MANEJO INTEGRAL DE RIESGO",
    "COORDINADOR DE LA DIRECCION GENERAL DEL DESPACHO",
    "COORDINADOR  NACIONAL ACADEMICA",
    "COORDINADOR NACIONAL DE ESPECIALIDADES BOMBERILES",
    "INSPECTOR GENERAL NACIONAL",
    "PERITO FORESTAL I",
    "EDUCADOR III",
    "INGENIERO ELECTRICISTA III",
    "SOCIOLOGO III",
    "ADMINISTRADOR III",
    "INVESTIGADOR SOCIAL III",
    "TRABAJO SOCIAL III",
    "ANALISTA DE TECNOLOGIA DE LA INFORMACION III",
    "AYUDANTE DE ALMACEN",
    "VICEMINISTRO DEL SISTEMA INTEGRADO DE INVESTIGACION PENAL",
    "DIRECTOR GENERAL DEL DESPACHO",
    "DIRECTOR GENERAL DE DISEÑO ESTRATEGICO DE INVESTIGACION PENAL",
    "DIRECTOR GENERAL DE CONTROL OPERACIONAL DE LOS ORGANOS DE INVESTIGACION PENAL",
    "DIRECTOR GENERAL DE SISTEMAS DE INFORMACION DE INVESTIGACION PENAL",
    "DIRECTOR  DE DISEÑO DE FORMACION Y CAPACITACION",
    "COORDINADOR  DE SERVICIOS ADMINISTRATIVOS",
    "INVESTIGADOR POLICIAL III",
    "ESTADISTICO III",
    "VICEMINISTRO DEL SISTEMA INTEGRADO DE POLICIA",
    "DIRECTOR GENERAL DEL DESPACHO DEL VICEMINISTRO DEL SISTEMA INTEGRADO DE POLICIA",
    "DIRECTOR GENERAL DE SUPERVISION DISCIPLINARIA DE LOS CUERPOS DE POLICIA",
    "DIRECTOR GENERAL DEL SERVICIO DE POLICIA",
    "DIRECTOR DE GESTION OPERATIVA",
    "DIRECTOR DE GESTION POLICIAL",
    "COORDINADOR DE ADMINISTRACION",
    "COORDINADOR DE DIVULGACION",
    "COORDINADOR  DE ASUNTOS JURIDICOS",
    "COORDINADOR  DE RECEPCION DE DENUNCIAS Y ASISTENCIAS DISCIPLINARIA",
    "COORDINADOR DE PROCESOS LEGALES",
    "COORDINADOR DE ASISTENCIA TECNICA",
    "COORDINADOR DE GESTIÓN DEL CONOCIMIENTO",
    "COORDINADOR DE OFICINAS TECNICAS REGION LOS LLANOS",
    "COORDINADOR DE OFICINAS TECNICAS REGION NOR-ORIENTAL",
    "COORDINADOR DE OFICINAS TECNICAS REGION GUAYANA",
    "COORDINADOR DE OFICINAS TECNICAS REGION CENTRO OCCIDENTAL",
    "COORDINADOR DE OFICINAS TECNICAS REGION ANDINA",
    "ASISTENTE ADMINISTRATIVO II",
    "TECNICO EN TECNOLOGIAS DE INFORMACION II",
    "PLANIFICADOR I",
    "ANALISTA DE PROCESOS POLICIALES III",
    "OPERADOR DE MAQ. FOTOCOPIADORA",
    "VICEMINISTRO DE POLITICA INTERIOR Y SEGURIDAD JURIDICA",
    "DIRECTOR GENERAL DE JUSTICIA, INSTITUCIONES RELIGIOSAS Y CULTOS",
    "DIRECTOR GENERAL DEL CEREMONIAL Y ACERVO HISTORICO",
    "DIRECCION GENERAL DE ASUNTOS POLITICOS Y SOCIALES",
    "DIRECTOR GENERAL DEL DESPACHO DEL VICEMINISTRO DE POLITICA INTERIOR Y SEGURIDAD JURIDICA",
    "DIRECTOR GENERAL DE ARTICULACION JUSTICIA Y PAZ",
    "DIRECTOR DEL CEREMONIAL",
    "DIRECTOR EJE CENTRO Y OCCIDENTE",
    "DIRECCION DE RELACIONES INTERINSTITUCIONALES CARACAS",
    "COORDINADOR MUNICIPAL DE DEPENDENCIAS FEDERALES LA TORTUGA",
    "COORDINADOR MUNICIPAL DE DEPENDENCIAS FEDERALES LA BLANQUILLA",
    "COORDINADOR MUNICIPAL",
    "COORDINADOR MUNICIPAL DE DEPENDENCIAS FEDERALES LOS FRAILES",
    "COORDINADOR DE PROCESOS POLITICOS Y SOCIALES",
    "COORDINADOR DE CONSERVACION MONUMENTAL  ",
    "COORDINADOR DE FORMACION ACADEMICA ",
    "COORDINADOR DE GESTION DE MUSEO",
    "COORDINADOR DE PROMOCION Y DIFUSION",
    "COORDINACION DE DEPOSITARIA JURIDICAS",
    "COORDINACION EJE CENTRO Y OCCIDENTE ",
    "COORDINACION EJE CENTRO DISTRITO CAPITAL",
    "COORDINACION  EJE ORIENTAL GUAYANA",
    "COORDINACIÓN ESTADAL GUARICO",
    "ARCHIVISTA I",
    "ASISTENTE ADMINISTRATIVO  I",
    "ASISTENTE DE CEREMONIAL Y PROTOCOLO III",
    "SECRETARIO III",
    "PROMOTOR DE ACERVO HISTORICO III",
    "PROMOTOR DE DERECHOS HUMANOS III",
    "ASISTENTE ADMINISTRATIVO  III",
    "TECNICO EN FOTOGRAFIA I",
    "PROMOTOR TURISTICO II",
    "PROMOTOR DEL CEREMONIAL I",
    "SOCIOLOGO I",
    "ANALISTA DE SISTEMAS I",
    "AUDITOR II",
    "DELEGADO DE DERECHOS HUMANOS II",
    "DELEGADO DE DERECHOS HUMANOS III",
    "DELEGADO INSTITUCIONAL",
    "POLITOLOGO III",
    "PLANIFICADOR  III",
    "JARDINERO",
    "MENSAJERO MOTORIZADO",
    "MESONERO",
    "COORDINADOR DE AREA",
    "COORDINACION DE PROMOCION Y DIVULGACION",
    "COORDINADOR ESTADAL DE MIRANDA",
    "COORDINADOR DE SERVICIOS DE POLICIAS",
    "VICEMINISTRO",
    "COORDINADOR ESTADAL",
    "COORDINADOR DE CARTOGRAFÍA",
  ];

  const tipoNomina = [
    "ALTO NIVEL",
    "CONFIANZA",
    "EMPLEADO",
    "OBRERO",
    "CONTRATADO",
    "COMISION DE SERVICIO",
    "HONORARIOS PROFESIONALES",
  ];

  const ubicacionAdministrativa = [
    "DESPACHO DEL MINISTRO",
    "OFICINA DE CONSULTORIA JURIDICA",
    "OFICINA DE GESTION HUMANA",
    "OFICINA DE AUDITORIA INTERNA",
    "OFICINA DE GESTION COMUNICACIONAL",
    "OFICINA DE TECNOLOGIA DE LA INFORMACION Y LA COMUNICACION",
    "OFICINA DE PLANIFICACION Y PRESUPUESTO",
    "OFICINA ESTRATEGICA DE SEGUIMIENTO Y EVALUACION DE POLITICAS PUBLICAS",
    "OFICINA DE GESTION ADMINISTRATIVA",
    "VICEMINISTERIO DE PREVENCION Y SEGURIDAD CIUDADANA Y CUADRANTES DE PAZ",
    "VICEMINISTERIO DE POLITICA INTERIOR Y SEGURIDAD JURIDICA",
    "OFICINA DE PROTECCION Y SEGURIDAD INTEGRAL",
    "OFICINA DE ATENCION CIUDADANA",
    "OFICINA ADMINISTRATIVA DE LA SECRETARIA EJECUTIVA DEL CONSEJO GENERAL DE POLICIA",
    "VICEMINISTERIO DEL SISTEMA INTEGRADO DE INVESTIGACION PENAL",
    "VICEMINISTERIO PARA LA GESTION DE RIESGO Y PROTECCION CIVIL",
    "VICEMINISTERIO DEL SISTEMA INTEGRADO DE POLICIA",
    "GOES",
  ];

  const ubicacionFisica = [
    "DESPACHO DEL MINISTRO",
    "DIRECCION GENERAL DEL DESPACHO",
    "DIRECCION DE DESPACHO",
    "DIRECCION DE ARTICULACION SOCIAL",
    "OFICINA DE CONSULTORIA JURIDICA",
    "DIRECCION DE ESTUDIOS NORMATIVOS Y DICTAMENES JURIDICOS",
    "DIRECCION DE ASUNTOS ADMINISTRATIVOS Y RECURSOS JURIDICOS",
    "COORDINACION DE RECURSOS JURIDICOS",
    "OFICINA DE GESTION HUMANA",
    "OFICINA DE AUDITORIA INTERNA",
    "DIRECCION DE CONTROL POSTERIOR",
    "DIRECCION DE DETERMINACIONES DE RESPONSABILIDADES",
    "COORDINACION DE AUDITORIAS",
    "COORDINACION DE ACTAS DE ENTREGA",
    "COORDINACION DE EXAMEN DE LA CUENTA",
    "COORDINACION DE POTESTAD INVESTIGATIVA",
    "OFICINA DE GESTION COMUNICACIONAL",
    "OFICINA DE TECNOLOGIA DE LA INFORMACION Y LA COMUNICACION",
    "DIRECCION DE GESTION DE PROYECTOS",
    "DIRECCION DE SOPORTE TECNICO",
    "COORDINACION DE MANTENIMIENTO TECNOLOGICO",
    "COORDINACION DE BASES DE DATOS",
    "COORDINACION DE EQUIPAMIENTO TECNOLOGICO",
    "COORDINACION DE ANALISIS Y DISEÑO DE SISTEMA",
    "COORDINACION DE TELEFONIA",
    "COORDINACION DE ATENCION AL USUARIO",
    "COORDINACION DE FORMULACION DE PROYECTOS",
    "COORDINACION DE INTEGRIDAD DE DATOS",
    "COORDINACION DE GESTION DE CONTROL Y PROYECTOS",
    "COORDINACION DEL CENTRO INTEGRAL DE SERVICIOS TECNOLOGICOS",
    "COORDINACION DE REDES E INFRAESTRUCTURA TECNOLOGICA",
    "OFICINA DE PLANIFICACION Y PRESUPUESTO",
    "DIRECCION DE PRESUPUESTO",
    "DIRECCION DE PLANIFICACION",
    "DIRECCION DE ORGANIZACION Y SISTEMA",
    "COORDINACION DE DISEÑO ORGANIZACIONAL",
    "COORDINACION DE PLANIFICACION",
    "COORDINACION DE CONTROL INTERNO",
    "COORDINACION DE SEGUIMIENTO Y CONTROL DE ENTES EN MATERIA DE PLANIFICACION",
    "COORDINACION DE CONTROL DE PRESUPUESTO ENTES",
    "COORDINACION, CONTROL Y SEGUIMIENTO DE PROYECTOS Y ACCION CENTRALIZADA",
    "COORDINACION DE CONTROL Y SEGUIMIENTO DE PROGRAMAS Y EJECUCION FINANCIERA",
    "COORDINACION DE PRESUPUESTO",
    "DIVISION DE PRESUPUESTO",
    "DIVISION DE HABILITADURIA",
    "OFICINA ESTRATEGICA DE SEGUIMIENTO Y EVALUACION DE POLITICAS PUBLICAS",
    "DIRECCION DE ANALISIS DEL ENTORNO",
    "DIRECCION DE SEGUIMIENTO DE ORDENES MINISTERIALES Y DE GOBIERNO",
    "DIRECCION DE MEDICION E IMPACTO DE POLITICAS PUBLICAS",
    "DESPACHO DIRECCION GENERAL DE LA OFICINA DE GESTION ADMINISTRATIVA",
    "OFICINA DE GESTION ADMINISTRATIVA",
    "DIRECCION DE SERVICIOS GENERALES",
    "COORDINACION DE VIATICOS",
    "DIRECCION DE ADMINISTRACION",
    "COORDINACION DE BIENES PUBLICOS Y MATERIAS",
    "COORDINACION DE ORDENACION DE PAGOS",
    "COORDINACION DE TRANSPORTE",
    "COORDINACION DE GESTION DE ADUANAS",
    "COORDINACION UNIDAD DE REGULACION ENERGETICA",
    "COORDINACION DE HABILITADURIA",
    "COORDINACION DE ADQUISICION DE BIENES Y SERVICIOS",
    "COORDINACION DE GESTION ADMINISTRATIVA",
    "COORDINACION DE BIENES PUBLICOS",
    "COORDINACION DE LOGISTICA Y SUMINISTRO",
    "COORDINACION DE CONTRATOS",
    "COORDINACION DE ACREENCIAS",
    "COORDINACION DE OBRAS CIVILES",
    "DIVISION DE SERVICIOS GENERALES",
    "SECCION DE TRANSPORTE",
    "DEPARTAMENTO DE PROVEEDURIA",
    "CENTRAL TELEFONICA",
    "DEPARTAMENTO DE MANTENIMIENTO, INSTALACIONES Y EQUIPOS",
    "DIRECCION GENERAL DE PREVENCION DEL DELITO",
    "DESPACHO DEL VICEMINISTRO (A) DE POLITICA INTERIOR Y SEGURIDAD JURIDICA",
    "DIRECCION DE BIENESTAR SOCIAL",
    "VICEMINISTERIO DE POLITICA INTERIOR Y SEGURIDAD JURIDICA",
    "OFICINA DE PROTECCION Y SEGURIDAD INTEGRAL",
    "DIRECCION DE SEGURIDAD FISICA Y LOGICA",
    "DIRECCION DE SEGURIDAD INDUSTRIAL E HIGIENE LABORAL",
    "COORDINACION DE SEGURIDAD INDUSTRIAL",
    "COORDINACION DE SEGURIDAD LOGICA",
    "COORDINACION DE HIGIENE LABORAL",
    "COORDINACION DE SEGURIDAD FISICA",
    "OFICINA DE ATENCION CIUDADANA",
    "OFICINA ADMINISTRATIVA DE LA SECRETARIA EJECUTIVA DEL CONSEJO GENERAL DE POLICIA",
    "DIRECCION GENERAL DE LA OFICINA DE GESTION HUMANA",
    "DIRECCION DE ADMINISTRACION DE PERSONAL",
    "DIRECCION DE ASESORIA Y ASUNTOS LEGALES",
    "DIRECCION DE PLANIFICACION Y DESARROLLO DE PERSONAL",
    "DIVISION DE RELACIONES LABORALES",
    "TRIBUNAL MILITAR QUINTO DE CONTROL",
    "SOUDE-SINDICATO",
    "DESPACHO DIRECCION GENERAL DE LA OFICINA DE GESTION HUMANA",
    "SUNTTRA-SINDCATO",
    "SINTRASDE-SINDICATO",
    "SUNBEP-SINDICATO",
    "SENAMECF",
    "SINATT-SINDICATO",
    "VICEMINISTERIO DEL SISTEMA INTEGRADO DE INVESTIGACION PENAL",
    "DESPACHO DEL VICEMINISTERIO DEL SISTEMA INTEGRADO DE INVESTIGACION PENAL",
    "DIRECCION GENERAL DE CONTROL OPERACIONAL DE LOS ORGANOS DE INVESTIGACION PENAL",
    "DIRECCION DE ASESORIA LABORAL",
    "DESPACHO DEL VICEMINISTERIO PARA LA GESTION DE RIESGO Y PROTECCION CIVIL",
    "DIRECCION GENERAL DE COORDINACION NACIONAL DE BOMBEROS Y BOMBERAS Y ADMINISTRACION DE EMERGENCIAS DE CARACTER CIVIL",
    "DIRECCION GENERAL DEL DESPACHO DEL VICEMINISTRO",
    "DIRECCION GENERAL DE GESTION EDUCATIVA PARA LA PREVENCION Y MANEJO INTEGRAL DE RIESGO",
    "COORDINACION DE LA DIRECCION GENERAL DEL DESPACHO",
    "COORDINACION NACIONAL ACADEMICA",
    "COORDINACION NACIONAL DE ESPECIALIDADES BOMBERILES",
    "DIRECCION DE SOPORTE INSTITUCIONAL A LA GESTION DE RIESGO",
    "DIRECCION DE APOYO TECNICO A LA GESTION INTEGRAL DE RIESGO",
    "VICEMINISTERIO PARA LA GESTION DE RIESGO Y PROTECCION CIVIL",
    "DIRECCION GENERAL DEL DESPACHO DEL VICEMINISTERIO DE INVESTIGACION PENAL",
    "DIRECCION GENERAL DE DISEÑO ESTRATEGICO DE INVESTIGACION PENAL",
    "DIRECCION GENERAL DE SISTEMAS DE INFORMACION DE INVESTIGACION PENAL",
    "DIRECCION DE DISEÑO DE FORMACION Y CAPACITACION",
    "DIRECCION DE ASISTENCIA TECNICA",
    "DIRECCION DE EVALUACION Y SEGUIMIENTO",
    "COORDINACION DE SERVICIOS ADMINISTRATIVOS",
    "DIRECCION DE HABILITACION",
    "DESPACHO DEL VICEMINISTRO DEL SISTEMA INTEGRADO DE INVESTIGACION PENAL",
    "DESPACHO DEL VICEMINISTRO DEL SISTEMA INTEGRADO DE POLICIA",
    "DIRECCION GENERAL DE SUPERVISION DISCIPLINARIA DE LOS CUERPOS DE POLICIA",
    "DIRECCION GENERAL DEL SERVICIO DE POLICIA",
    "DIRECCION DE GESTION OPERATIVA",
    "DIRECCION DE GESTION POLICIAL",
    "DIRECCION DE INSPECCION E INSTRUCCION DISCIPLINARIA",
    "DIRECCION DE SUPERVISION FISCALIZACION Y ASISTENCIA TECNICA",
    "DIRECCION GENERAL DE OFICINAS TECNICAS",
    "DIRECCION GENERAL DE SUPERVISION DISCIPLINARIA (DIGESUDIS)",
    "VICEMINISTERIO DEL SISTEMA INTEGRADO DE POLICIA",
    "DIRECCION DE DERECHOS HUMANOS",
    "DIRECCION GENERAL DEL CEREMONIAL Y ACERVO HISTORICO",
    "DIRECCION GENERAL DE ASUNTOS POLITICOS Y SOCIALES",
    "DIRECCION GENERAL DE ARTICULACION PARA JUSTICIA Y PAZ",
    "DIRECCION GENERAL DE DERECHOS HUMANOS",
    "DIRECCION GENERAL DE JUSTICIA, INSTITUCIONES RELIGIOSAS Y CULTOS",
    "COORDINACION DE TALENTO HUMANO",
    "COORDINACION DE DEPENDENCIAS FEDERALES LA BLANQUILLA",
    "DIRECCION GENERAL DEL CEREMONIAL Y ACERVO HISTORICO / CAMPO DE CARABOBO",
    "COORDINACION DE GESTION DE MUSEO",
    "DESPACHO DEL VICEMINISTERIO DE POLITICA INTERIOR Y SEGURIDAD JURIDICA",
    "DIRECCION GENERAL DEL CEREMONIAL Y ACERVO HISTORICO / PANTEON NACIONAL",
    "DIRECCION DE JUSTICIA Y CULTOS DESPACHO DEL DIRECTOR",
    "INSPECTORÍA GENERAL DE CULTOS",
    "MONUMENTO Y CAMPO DE CARABOBO",
    "VICEMINISTERIO DE PREVENCION Y SEGURIDAD CIUDADANA Y CUADRANTES DE PAZ",
    "DIRECCION GENERAL DE LOS SERVICIOS DE VIGILANCIA Y SEGURIDAD PRIVADA (DIGESERVISP)",
    "DIRECCION GENERAL DE SEGURIDAD CIUDADANA (DIGESEC)",
    "DIRECCION GENERAL DE CUADRANTES DE PAZ",
    "DIRECCION DE TECNOLOGIA Y MANTENIMIENTO",
    "COORDINACION DE OPERACIONES AEREAS",
    "COORDINACION DE MIRANDA",
    "DESPACHO DEL VICEMINISTRO DE PREVENCION Y SEGURIDAD CIUDADANA",
    "COORDINACION DE ADMINISTRACION",
    "COORDINACION CAPITAL DTTO FEDERAL",
    "COORDINACION DE MARACAY ESTADO ARAGUA",
    "COORDINACION DEL ESTADO BARINAS",
    "DESPACHO DEL VICEMINISTERIO DE PREVENCION Y SEGURIDAD CIUDADANA Y CUADRANTES DE PAZ",
    "DIRECCION DE OPERACIONES AEREAS",
    "GOES",
  ];

  const columns: ColumnDef<z.infer<typeof employeeRegisterSchema>>[] = [
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

  //1. initialize table throught this hook
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

  //

  const columnsInit: ColumnDef<z.infer<typeof employeeRegisterSchema>>[] = [
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

  //1. initialize table throught this hook
  const tableInit = useReactTable({
    //1.1 Define columns
    columns: columnsInit,
    //1.2 Define data
    data: [employeeInit],
    //1.3 call and pass the function getCoreRowModel()
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div>
      {employee && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-[800] p-12 m-auto flex flex-col gap-4"
          >
            <h1 className="text-2xl">Modificar trabajador</h1>
            <div className="flex flex-row flex-wrap gap-2 justify-between items-center">
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

              {/* apellidosYNombres */}

              <FormField
                control={form.control}
                name="apellidosYNombres"
                render={({ field }) => (
                  <FormItem className="w-[320px]">
                    <FormLabel>Apellidos y Nombres</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Escriba los Apellidos y Nombres"
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

              {/* denominacionCargo */}

              <FormField
                control={form.control}
                name="denominacionCargo"
                render={({ field }) => (
                  <FormItem className="w-[320px]">
                    <FormLabel>Denominacion de Cargo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione el Cargo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {denominacionCargo.map((selectValue, index) => {
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

              {/* denominacionCargoEspecifico */}

              <FormField
                control={form.control}
                name="denominacionCargoEspecifico"
                render={({ field }) => (
                  <FormItem className="w-[320px]">
                    <FormLabel>Denominacion de Cargo Especifico</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione el Cargo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {denominacionCargoEspecifico.map(
                          (selectValue, index) => {
                            return (
                              <SelectItem key={index} value={selectValue}>
                                {selectValue}
                              </SelectItem>
                            );
                          }
                        )}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* Grado */}

              <FormField
                control={form.control}
                name="grado"
                render={({ field }) => (
                  <FormItem className="w-[320px]">
                    <FormLabel>Grado</FormLabel>
                    <FormControl>
                      <Input placeholder="Escriba el grado" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Fecha Ingreso Organismo */}

              <FormField
                control={form.control}
                name="fechaIngresoOrganismo"
                render={({ field }) => (
                  <FormItem className="w-[320px]">
                    <FormLabel>Fecha Ingreso Organismo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the cedula"
                        type="date"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Fecha Ingreso APN */}

              <FormField
                control={form.control}
                name="fechaIngresoAPN"
                render={({ field }) => (
                  <FormItem className="w-[320px]">
                    <FormLabel>Fecha Ingreso APN</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the cedula"
                        type="date"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* tipoNomina */}

              <FormField
                control={form.control}
                name="tipoNomina"
                render={({ field }) => (
                  <FormItem className="w-[320px]">
                    <FormLabel>Tipo de Nómina</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione el Cargo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tipoNomina.map((selectValue, index) => {
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

              {/* ubicacionAdministrativa */}

              <FormField
                control={form.control}
                name="ubicacionAdministrativa"
                render={({ field }) => (
                  <FormItem className="w-[320px]">
                    <FormLabel>Ubicación Administrativa</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione el Cargo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ubicacionAdministrativa.map((selectValue, index) => {
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

              {/* ubicacionFisica */}

              <FormField
                control={form.control}
                name="ubicacionFisica"
                render={({ field }) => (
                  <FormItem className="w-[320px]">
                    <FormLabel>Ubicación Física</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione el Cargo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ubicacionFisica.map((selectValue, index) => {
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
      )}
      <dialog id="dialog" className="w-[90%] p-4 rounded m-auto">
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

          <Button onClick={editEmployee} className="bg-green-600">
            Confirmar
          </Button>
        </div>
      </dialog>
    </div>
  );
};

export default EditEmployeeForm;
