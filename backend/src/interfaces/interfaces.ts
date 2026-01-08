import { DepartamentoItemRs } from "../departamento/response/departamento-item-rs";
import { Departamento, Empleado } from "../lib/dto";

export interface CrudRepository<T> {
  create(data: T): Promise<T | null>;
  getAll(): Promise<T[]>;
  getById(id: number): Promise<T | null>;
  update(id: number, data: Partial<T>): Promise<T | null>;
  delete(id: number): Promise<T | null>;
}

export interface IDepartamentoRepository {
    getByNombre(nombre: string): Promise<Departamento | null>
    getAllItem(): Promise<DepartamentoItemRs[]>
    getItemById(id : number): Promise<DepartamentoItemRs | null>
}

export interface IEmpleadoRepository {
    getByEmail(email: string): Promise<Empleado | null>
}