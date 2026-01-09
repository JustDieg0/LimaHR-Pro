export interface EmpleadoDetailRs{
    id: number;
    nombre: string;
    email: string;
    contrasena: string;
    telefono: string;
    departamento_id: number;
    salario: number;
    fecha_ingreso: Date;
    activo: boolean;
}