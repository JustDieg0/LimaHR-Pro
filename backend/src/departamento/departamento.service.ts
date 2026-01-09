import { Departamento } from "../lib/dto";
import { DepartamentoDetailRs } from "./response/departamento-detail-rs";
import { DepartamentoItemRs } from "./response/departamento-item-rs";
import { ResourceNotFoundError, BadRequestError, DuplicateResourceError } from "../utils/error-types";
import { toDepartamentoDetailRs, toDepartamentoItemRs, toDepartamentosDetailRsList } from "./mapper/departamento.mapper";
import { DepartamentoRepository } from "./departamento.repository";

interface DepartamentoCreateInput {
    nombre: string;
    jefe_id: number;
}

interface DepartamentoUpdateInput {
    nombre?: string;
    jefe_id?: number;
    created_at?: Date;
}

export class DepartamentoService {
    private departamentoRepository = new DepartamentoRepository();

    async createDepartamento(data: DepartamentoCreateInput): Promise<DepartamentoDetailRs> {
        const existingDepartamento = await this.departamentoRepository.getByNombre(data.nombre);
        if (existingDepartamento) {
            throw new DuplicateResourceError(`Ya existe un departamento ${data.nombre}.`);
        }

        const departamentoData : Departamento = {
            id: 0,
            nombre: data.nombre,
            jefe_id: data.jefe_id,
            created_at : new Date()
        }

        const departamento = await this.departamentoRepository.create(departamentoData)
        if(!departamento) {
            throw new BadRequestError(`No se logro crear un departamento.`);
        }
        return toDepartamentoDetailRs(departamento);
    }

    async getAllDepartamentos() : Promise<DepartamentoDetailRs[]> {
        const departamentos = await this.departamentoRepository.getAll();
        return toDepartamentosDetailRsList(departamentos);
    }

    async getDepartamentoById(id: number): Promise<DepartamentoDetailRs> {
        const departamento = await this.departamentoRepository.getById(id);
        if (!departamento) {
            throw new ResourceNotFoundError("Departamento no encontrado.");
        }
        return toDepartamentoDetailRs(departamento);
    }

    async updateDepartamento(id: number, data: DepartamentoUpdateInput): Promise<DepartamentoDetailRs> {
        const existingDepartamento = await this.departamentoRepository.getById(id);
        if (!existingDepartamento) {
            throw new ResourceNotFoundError("Departamento no encontrado.");
        }

        if (data.nombre || data.jefe_id || data.created_at) {
            const nombreToCheck = data.nombre ? data.nombre.trim() : existingDepartamento.nombre;

            /*const duplicatedDepartamento = await this.departamentoRepository.getByNombre(nombreToCheck)

            if (duplicatedDepartamento) {
                throw new DuplicateResourceError(`Ya existe un departamento ${nombreToCheck}`);
            }   */
        }

        const updateData : Partial<Departamento> = {};

        if (data.nombre) updateData.nombre = data.nombre.trim();
        if (data.jefe_id) updateData.jefe_id = data.jefe_id;
        if (data.created_at) updateData.created_at = data.created_at;

        const updatedDepartamento = await this.departamentoRepository.update(id,updateData);

        if (!updatedDepartamento) {
            throw new BadRequestError("No se logró actualizar el departamento");
        }
        return toDepartamentoDetailRs(updatedDepartamento);
    }

    async deleteDepartamento(id: number) : Promise<void> {
        const existingDepartamento = await this.departamentoRepository.getById(id);
        if(! existingDepartamento) {
            throw new ResourceNotFoundError("No se encontro el departamento.");
        }

        await this.departamentoRepository.delete(id);
    }

    async getAllDepartamentosItem() : Promise<DepartamentoItemRs[]> {
        const departamentos = await this.departamentoRepository.getAllItem();
        return departamentos;
    }

    async getDepartamentoByIdItem(id: number): Promise<DepartamentoItemRs> {
        const departamento = await this.departamentoRepository.getItemById(id);
        if (!departamento) {
            throw new ResourceNotFoundError("Departamento no encontrado.");
        }
        return departamento;
    }
}