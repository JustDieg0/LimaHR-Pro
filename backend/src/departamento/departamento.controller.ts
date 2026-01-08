import { Request, Response, NextFunction, Router } from "express";
import { ApiResponse } from "../utils/api-response";
import { validateRequest } from "../utils/validate-request";
import { departamentoCreateRq } from "./request/departamento-create-rq";
import { departamentoUpdateRq } from "./request/departamento-update-rq";
import { DepartamentoDetailRs } from "./response/departamento-detail-rs";
import { DepartamentoService } from "./departamento.service";
import { DepartamentoItemRs } from "./response/departamento-item-rs";

const router = Router();
const departamentoService = new DepartamentoService();

//POST /departamentos

router.post("/",
    departamentoCreateRq(),
    validateRequest("Datos invalidos para crear un departamento"),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body;
            const newDepartamento = await departamentoService.createDepartamento(data);

            const response: ApiResponse<DepartamentoDetailRs> = {
                status: "success",
                message: "Departamento creado exitosamente",
                data: newDepartamento,
            };

            res.status(201).json(response);
        } catch (error) {
            next(error)
        }
    }
);

//GET /departamentos
router.get("/",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { format } = req.query;

            if( format ) {
                if ( format == "item") {
                    const departamentos = await departamentoService.getAllDepartamentosItem();
                    const response: ApiResponse<DepartamentoItemRs[]> = {
                        status: "success",
                        message: "Departamentos obtenidos correctamente",
                        data: departamentos,
                    };
                res.json(response);
                }
            }
                const departamentos = await departamentoService.getAllDepartamentos();
                const response: ApiResponse<DepartamentoDetailRs[]> = {
                    status: "success",
                    message: "Departamentos obtenidos correctamente",
                    data: departamentos,
                };
            res.json(response);
        }catch(error){
            next(error);
        }
    }
);

//GET /departamentos/:id

router.get("/:id",
    async (req: Request, res: Response, next: NextFunction) => {
        try{
            const id = Number(req.params.id);
            const departamento = await departamentoService.getDepartamentoById(id);

            const response: ApiResponse<DepartamentoDetailRs> = {
                status: "success",
                message: "Departamento obtenido correctamente",
                data: departamento,
            };

            res.json(response);
        }catch(error){
            next(error);
        }
    }
);

//PUT /departamentos/:id

router.put("/:id",
    departamentoUpdateRq(),
    validateRequest("Datos inválidos en update"),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id);
            const data = req.body;

            const updatedDepartamento = await departamentoService.updateDepartamento(id,data);

            const response: ApiResponse<DepartamentoDetailRs> = {
               status: "success",
                message: "Departamento actualizado correctamente",
                data: updatedDepartamento,
            };

            res.status(200).json(response);
        }catch(error){
            next(error);
        }
    }
)

//DELETE /departamentos/:id

router.delete("/:id",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id);
            await departamentoService.deleteDepartamento(id);

            const response: ApiResponse<null> = {
               status: "success",
                message: "Departamento eliminado correctamente",
                data: null,
            };

            res.status(200).json(response);
        }catch(error){
            next(error);
        }
    }
);

export default router;