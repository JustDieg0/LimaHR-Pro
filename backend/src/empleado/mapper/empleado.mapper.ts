import { Empleado } from "../../lib/dto";
import { EmpleadoDetailRs } from "../response/empleado-detail-rs";
import { EmpleadoItemRs } from "../response/empleado-item-rs";

export function toEmpleadoDetailRs(empleado: Empleado): EmpleadoDetailRs{
    return {
        id: empleado.id,
        nombre: empleado.nombre,
        email: empleado.email,
        contrasena: empleado.contrasena,
        telefono: empleado.telefono,
        departamento_id: empleado.departamento_id,
        salario: empleado.salario,
        fecha_ingreso: empleado.fecha_ingreso,
        activo: empleado.activo
    }
}

export function toEmpleadosDetailRsList(empleados : Empleado[]) : EmpleadoDetailRs[]{
    return empleados.map(empleado => toEmpleadoDetailRs(empleado))
}