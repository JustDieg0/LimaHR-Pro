import { Departamento } from "../../lib/dto";
import { DepartamentoDetailRs } from "../response/departamento-detail-rs";
import { DepartamentoItemRs } from "../response/departamento-item-rs";

export function toDepartamentoDetailRs(departamento: Departamento): DepartamentoDetailRs{
    return {
        id: departamento.id,
        nombre: departamento.nombre,
        jefe_id: departamento.jefe_id,
        created_at: departamento.created_at
    }
}

export function toDepartamentoItemRs(departamento: Departamento): DepartamentoItemRs{
    var jefe = ""
    return {
        id: departamento.id,
        nombre: departamento.nombre,
        jefe: jefe,
        created_at: departamento.created_at
    }
}

export function toDepartamentosDetailRsList(departamentos : Departamento[]) : DepartamentoDetailRs[]{
    return departamentos.map(departamento => toDepartamentoDetailRs(departamento))
}