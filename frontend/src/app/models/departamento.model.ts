export interface Departamento {
  id: number;
  nombre: string;
  jefe_id?: number; 
  created_at?: String;
}

export interface DepartamentoItem {
  id: number;
  nombre: string;
  jefe: string;
  created_at: string;
}