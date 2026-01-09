export interface EmpleadoItemRs{
    id: number;
    nombre: string;
    email: string;
    contrasena: string;
    telefono: string;
    departamento: string;
    salario: number;
    fecha_ingreso: Date;
    activo: boolean;
}