export interface Empleado {
  id: number;
  nombre: string;
  email: string; 
  contrasena: String;
  telefono?: string;
  departamento_id?: number;
  salario?: number;
  fecha_ingreso: string;
  activo?: boolean;
}

export interface EmpleadoItem {
  id: number;
  nombre: string;
  email: string; 
  contrasena: String;
  telefono?: string;
  departamento?: string;
  salario?: number;
  fecha_ingreso: string;
}