export interface Departamento{
    id: number;
    nombre: string;
    jefe_id: number;
    created_at: Date;
}

export interface Empleado{
    id?: number;
    nombre: string;
    email: string;
    contrasena: string;
    telefono?: string;
    departamento_id?: number;
    salario?: number;
    fecha_ingreso?: Date;
    activo?: boolean;
}