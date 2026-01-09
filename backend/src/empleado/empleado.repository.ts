import { DatabasePool } from "../lib/mysql";
import { CrudRepository, IEmpleadoRepository } from "../interfaces/interfaces";
import { Empleado } from "../lib/dto";
import { EmpleadoItemRs } from "./response/empleado-item-rs";

export class EmpleadoRepository implements CrudRepository<Empleado>, IEmpleadoRepository {
    
    private db = DatabasePool.getInstance().pool;

    async create(data: Empleado): Promise<Empleado | null> {
        const query = `
            INSERT INTO empleados (
                nombre, 
                email, 
                contrasena, 
                telefono, 
                departamento_id, 
                salario, 
                fecha_ingreso
            ) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        const values = [
            data.nombre,
            data.email,
            data.contrasena,
            data.telefono ?? null,
            data.departamento_id ?? null,
            data.salario ?? null,
            data.fecha_ingreso ?? null
        ];

        const [result] = await this.db.execute(query, values);
        const insertId = (result as any).insertId as number;
        
        return this.getById(insertId);
    }

    async getAll(): Promise<Empleado[]> {
        const query = `
            SELECT 
                id, 
                nombre, 
                email, 
                contrasena, 
                telefono, 
                departamento_id, 
                salario, 
                fecha_ingreso, 
                activo 
            FROM empleados
            WHERE activo = TRUE
        `;
        const [rows] = await this.db.execute(query) as [Empleado[], any];
        return rows;
    }

    async getById(id: number): Promise<Empleado | null> {
        const query = `
            SELECT 
                id, 
                nombre, 
                email, 
                contrasena, 
                telefono, 
                departamento_id, 
                salario, 
                fecha_ingreso, 
                activo
            FROM empleados 
            WHERE id = ?
        `;
        const [rows] = await this.db.execute(query, [id]) as [Empleado[], any];
        return rows[0] || null;
    }

    async update(id: number, data: Partial<Empleado>): Promise<Empleado> {
        const updates: string[] = [];
        const values: any[] = [];

        if (data.nombre !== undefined) {
            updates.push('nombre = ?');
            values.push(data.nombre);
        }
        if (data.email !== undefined) {
            updates.push('email = ?');
            values.push(data.email);
        }
        if (data.contrasena !== undefined) {
            updates.push('contrasena = ?');
            values.push(data.contrasena);
        }
        if (data.telefono !== undefined) {
            updates.push('telefono = ?');
            values.push(data.telefono ?? null);
        }
        if (data.departamento_id !== undefined) {
            updates.push('departamento_id = ?');
            values.push(data.departamento_id ?? null);
        }
        if (data.salario !== undefined) {
            updates.push('salario = ?');
            values.push(data.salario ?? null);
        }
        if (data.fecha_ingreso !== undefined) {
            updates.push('fecha_ingreso = ?');
            values.push(data.fecha_ingreso ?? null);
        }
        if (data.activo !== undefined) {
            updates.push('activo = ?');
            values.push(data.activo);
        }

        if (updates.length === 0) {
            throw new Error('Nada que actualizar');
        }

        const setClause = updates.join(', ');
        const query = `
            UPDATE empleados 
            SET ${setClause}
            WHERE id = ?
        `;
        values.push(id);

        const [result] = await this.db.execute(query, values);
        const affectedRows = (result as any).affectedRows;

        if (affectedRows === 0) {
            throw new Error('No se encontró empleado para actualizar');
        }

        const updated = await this.getById(id);
        if (!updated) throw new Error('Empleado no encontrado después de actualizar');

        return updated;
    }

    async delete(id: number): Promise<Empleado | null> {
        // Soft delete (marcar como inactivo)
        const query = 'UPDATE empleados SET activo = FALSE WHERE id = ?';
        await this.db.execute(query, [id]);
        return null;
    }

    // Hard delete (opcional)
    async hardDelete(id: number): Promise<void> {
        const query = 'DELETE FROM empleados WHERE id = ?';
        await this.db.execute(query, [id]);
    }

    async getAllItem(): Promise<EmpleadoItemRs[]> {
        const query = `
            SELECT 
                e.id, 
                e.nombre, 
                e.email,
                e.contrasena, 
                e.telefono, 
                e.salario, 
                e.fecha_ingreso, 
                e.activo,
                d.nombre as departamento,
                d.id as departamento_id
            FROM empleados e 
            LEFT JOIN departamentos d ON e.departamento_id = d.id
            WHERE e.activo = TRUE
        `;
        const [rows] = await this.db.execute(query) as [EmpleadoItemRs[], any];
        return rows;
    }

    async getItemById(id: number): Promise<EmpleadoItemRs | null> {
        const query = `
            SELECT 
                e.id, 
                e.nombre, 
                e.email,
                e.contrasena, 
                e.telefono, 
                e.salario, 
                e.fecha_ingreso, 
                e.activo,
                d.nombre as departamento,
                d.id as departamento_id
            FROM empleados e 
            LEFT JOIN departamentos d ON e.departamento_id = d.id
            WHERE e.id = ?
        `;
        const [rows] = await this.db.execute(query, [id]) as [EmpleadoItemRs[], any];
        return rows[0] || null;
    }

    async getByEmail(email: string): Promise<Empleado | null> {
        const query = `
            SELECT 
                id, 
                nombre, 
                email, 
                contrasena, 
                telefono, 
                departamento_id, 
                salario, 
                fecha_ingreso, 
                activo
            FROM empleados 
            WHERE email = ?
        `;
        const [rows] = await this.db.execute(query, [email]) as [Empleado[], any];
        return rows[0] || null;
    }

    async getByDepartamento(departamentoId: number): Promise<Empleado[]> {
        const query = `
            SELECT 
                id, 
                nombre, 
                email, 
                contrasena, 
                telefono, 
                departamento_id, 
                salario, 
                fecha_ingreso, 
                activo, 
                created_at 
            FROM empleados 
            WHERE departamento_id = ? AND activo = TRUE
        `;
        const [rows] = await this.db.execute(query, [departamentoId]) as [Empleado[], any];
        return rows;
    }
}