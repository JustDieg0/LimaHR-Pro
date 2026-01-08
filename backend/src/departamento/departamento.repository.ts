import { DatabasePool } from "../lib/mysql";
import { CrudRepository, IDepartamentoRepository } from "../interfaces/interfaces";
import { Departamento } from "../lib/dto";
import { DepartamentoItemRs } from "./response/departamento-item-rs";

export class DepartamentoRepository implements CrudRepository<Departamento>, IDepartamentoRepository {
    
    private db = DatabasePool.getInstance().pool;

    async create(data: Departamento): Promise<Departamento | null> {
        const jefeId = data.jefe_id ?? null;

        const query = `
    INSERT INTO departamentos (nombre, jefe_id) 
    VALUES (?, ?)
  `;
        const [result] = await this.db.execute(query, [data.nombre, jefeId]);

        const insertId = (result as any).insertId as number;
        return this.getById(insertId);
    }

    async getAll(): Promise<Departamento[]> {
        const query = `
      SELECT id, nombre, jefe_id, created_at 
      FROM departamentos
    `;
        const [rows] = await this.db.execute(query) as [Departamento[], any];
        return rows;
    }

    async getById(id: number): Promise<Departamento | null> {
        const query = `
      SELECT id, nombre, jefe_id, created_at 
      FROM departamentos 
      WHERE id = ?
    `;
        const [rows] = await this.db.execute(query, [id]) as [Departamento[], any];
        return rows[0] || null;
    }

    async update(id: number, data: Partial<Departamento>): Promise<Departamento> {
        const updates: string[] = [];
        const values: any[] = [];  // ← SIN id aquí

        if (data.nombre !== undefined) {
            updates.push('nombre = ?');
            values.push(data.nombre);
        }
        if (data.jefe_id !== undefined) {
            updates.push('jefe_id = ?');
            values.push(data.jefe_id ?? null);  // undefined -> null
        }

        if (updates.length === 0) {
            throw new Error('Nada que actualizar');
        }

        const setClause = updates.join(', ');
        const query = `
    UPDATE departamentos 
    SET ${setClause}
    WHERE id = ?
  `;
        values.push(id);  // ← id SIEMPRE ÚLTIMO para WHERE

        const [result] = await this.db.execute(query, values);
        const affectedRows = (result as any).affectedRows;

        if (affectedRows === 0) {
            throw new Error('No se encontró departamento para actualizar');
        }

        const updated = await this.getById(id);
        if (!updated) throw new Error('Departamento perdido post-update');

        return updated;
    }

    async delete(id: number): Promise<Departamento | null> {
        const query = 'DELETE FROM departamentos WHERE id = ?';
        await this.db.execute(query, [id]);
        return null;
    }

    async getByNombre(nombre: string): Promise<Departamento | null> {
        const query = `
      SELECT id, nombre, jefe_id, created_at 
      FROM departamentos 
      WHERE nombre = ?
    `;
        const [rows] = await this.db.execute(query, [nombre]) as [Departamento[], any];
        return rows[0] || null;
    }

    async getAllItem(): Promise<DepartamentoItemRs[]> {
        const query = `
      SELECT d.id, d.nombre, e.nombre as jefe, d.created_at 
      FROM departamentos d LEFT JOIN empleados e ON d.jefe_id = e.id
    `;
        const [rows] = await this.db.execute(query) as [DepartamentoItemRs[], any];
        return rows;
    }
    async getItemById(id: number): Promise<DepartamentoItemRs | null> {
        const query = `
      SELECT d.id, d.nombre, e.nombre as jefe, d.created_at 
      FROM departamentos d INNER JOIN empleados e ON d.jefe_id = e.id
      WHERE d.id = ?
    `;
        const [rows] = await this.db.execute(query, [id]) as [DepartamentoItemRs[], any];
        return rows[0] || null;
    }
}