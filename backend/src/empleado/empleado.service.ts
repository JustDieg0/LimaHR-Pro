import { Empleado } from "../lib/dto";
import { EmpleadoDetailRs } from "./response/empleado-detail-rs";
import { EmpleadoItemRs } from "./response/empleado-item-rs";
import { ResourceNotFoundError, BadRequestError, DuplicateResourceError } from "../utils/error-types";
import { toEmpleadoDetailRs, toEmpleadosDetailRsList } from "./mapper/empleado.mapper";
import { EmpleadoRepository } from "./empleado.repository";

interface EmpleadoCreateInput {
    nombre: string;
    email: string;
    contrasena: string;
    telefono?: string;
    departamento_id?: number;
    salario?: number;
    fecha_ingreso?: Date;
}

interface EmpleadoUpdateInput {
    nombre?: string;
    email?: string;
    contrasena?: string;
    telefono?: string;
    departamento_id?: number;
    salario?: number;
    fecha_ingreso?: Date;
    activo?: boolean;
}

export class EmpleadoService {
    private empleadoRepository = new EmpleadoRepository();

    async createEmpleado(data: EmpleadoCreateInput): Promise<EmpleadoDetailRs> {
        const existingCorreo = await this.empleadoRepository.getByEmail(data.nombre);
        if (existingCorreo) {
            throw new DuplicateResourceError(`Ya existe un empleado ${data.email}.`);
        }

        const empleadoData : Empleado = {
            nombre: data.nombre,
            email: data.email,
            contrasena: data.contrasena
        }

        if (data.telefono) empleadoData.telefono = data.telefono;
        if (data.departamento_id) empleadoData.departamento_id = data.departamento_id;
        if (data.salario) empleadoData.salario = data.salario;
        if (data.fecha_ingreso) empleadoData.fecha_ingreso = data.fecha_ingreso;
        if (data.departamento_id) empleadoData.departamento_id = data.departamento_id;

        const empleado = await this.empleadoRepository.create(empleadoData)
        if(!empleado) {
            throw new BadRequestError(`No se logro crear un empleado.`);
        }
        return toEmpleadoDetailRs(empleado);
    }

    async getAllEmpleados() : Promise<EmpleadoDetailRs[]> {
        const empleados = await this.empleadoRepository.getAll();
        return toEmpleadosDetailRsList(empleados);
    }

    async getEmpleadoById(id: number): Promise<EmpleadoDetailRs> {
        const empleado = await this.empleadoRepository.getById(id);
        if (!empleado) {
            throw new ResourceNotFoundError("Empleado no encontrado.");
        }
        return toEmpleadoDetailRs(empleado);
    }

    async updateEmpleado(id: number, data: EmpleadoUpdateInput): Promise<EmpleadoDetailRs> {
        
        const existingEmpleado = await this.empleadoRepository.getById(id);
        if (!existingEmpleado) {
            throw new ResourceNotFoundError('Empleado no encontrado');
        }

        if (data.email) {
            if (!data.email.includes('@')) {
                throw new BadRequestError('Email inválido');
            }

            const duplicateEmail = await this.empleadoRepository.getByEmail(data.email);
            if (duplicateEmail && duplicateEmail.id !== id) {
                throw new DuplicateResourceError(`El email ${data.email} ya está en uso`);
            }
        }

        const updateData: Partial<Empleado> = {};

        if (data.nombre !== undefined) {
            updateData.nombre = data.nombre.trim();
        }
        if (data.email !== undefined) {
            updateData.email = data.email.toLowerCase().trim();
        }
        if (data.contrasena !== undefined) {
            updateData.contrasena = data.contrasena;
        }
        if (data.telefono !== undefined) {
            updateData.telefono = data.telefono;
        }
        if (data.departamento_id !== undefined) {
            updateData.departamento_id = data.departamento_id;
        }
        if (data.salario !== undefined) {
            updateData.salario = data.salario;
        }
        if (data.fecha_ingreso !== undefined) {
            updateData.fecha_ingreso = data.fecha_ingreso;
        }
        if (data.activo !== undefined) {
            updateData.activo = data.activo;
        }

        if (Object.keys(updateData).length === 0) {
            throw new BadRequestError('No hay datos para actualizar');
        }

        const updatedEmpleado = await this.empleadoRepository.update(id, updateData);

        if (!updatedEmpleado) {
            throw new BadRequestError('No se logró actualizar el empleado');
        }

        return toEmpleadoDetailRs(updatedEmpleado);
    }

    async deleteEmpleado(id: number) : Promise<void> {
        const existingEmpleado = await this.empleadoRepository.getById(id);
        if(! existingEmpleado) {
            throw new ResourceNotFoundError("No se encontro el empleado.");
        }

        await this.empleadoRepository.delete(id);
    }

    async getAllEmpleadosItem() : Promise<EmpleadoItemRs[]> {
        const empleados = await this.empleadoRepository.getAllItem();
        return empleados;
    }

    async getEmpleadoByIdItem(id: number): Promise<EmpleadoItemRs> {
        const empleado = await this.empleadoRepository.getItemById(id);
        if (!empleado) {
            throw new ResourceNotFoundError("Empleado no encontrado.");
        }
        return empleado;
    }
}