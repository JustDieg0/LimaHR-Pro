import { Request, Response, NextFunction, Router } from "express";
import { ApiResponse } from "../utils/api-response";
import { validateRequest } from "../utils/validate-request";
import { empleadoCreateRq } from "./request/empleado-create-rq";
import { empleadoUpdateRq } from "./request/empleado-update-rq";
import { EmpleadoDetailRs } from "./response/empleado-detail-rs";
import { EmpleadoService } from "./empleado.service";
import { EmpleadoItemRs } from "./response/empleado-item-rs";

const router = Router();
const empleadoService = new EmpleadoService();

// POST /empleados
router.post("/",
    empleadoCreateRq(),
    validateRequest("Datos inválidos para crear un empleado"),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body;
            const newEmpleado = await empleadoService.createEmpleado(data);

            const response: ApiResponse<EmpleadoDetailRs> = {
                status: "success",
                message: "Empleado creado exitosamente",
                data: newEmpleado,
            };

            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    }
);

// GET /empleados
router.get("/",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { format } = req.query;

            if (format === "item") {
                const empleados = await empleadoService.getAllEmpleadosItem();
                const response: ApiResponse<EmpleadoItemRs[]> = {
                    status: "success",
                    message: "Empleados obtenidos correctamente",
                    data: empleados,
                };
                return res.json(response);
            }

            const empleados = await empleadoService.getAllEmpleados();
            const response: ApiResponse<EmpleadoDetailRs[]> = {
                status: "success",
                message: "Empleados obtenidos correctamente",
                data: empleados,
            };
            return res.json(response);
        } catch (error) {
            next(error);
        }
    }
);

// GET /empleados/:id
router.get("/:id",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id);
            const { format } = req.query;

            if (format === "item") {
                const empleado = await empleadoService.getEmpleadoByIdItem(id);
                const response: ApiResponse<EmpleadoItemRs> = {
                    status: "success",
                    message: "Empleado obtenido correctamente",
                    data: empleado,
                };
                return res.json(response);
            }

            const empleado = await empleadoService.getEmpleadoById(id);
            const response: ApiResponse<EmpleadoDetailRs> = {
                status: "success",
                message: "Empleado obtenido correctamente",
                data: empleado,
            };

            return res.json(response);
        } catch (error) {
            next(error);
        }
    }
);

// PUT /empleados/:id
router.put("/:id",
    empleadoUpdateRq(),
    validateRequest("Datos inválidos para actualizar empleado"),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id);
            const data = req.body;

            const updatedEmpleado = await empleadoService.updateEmpleado(id, data);

            const response: ApiResponse<EmpleadoDetailRs> = {
                status: "success",
                message: "Empleado actualizado correctamente",
                data: updatedEmpleado,
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
);


// DELETE /empleados/:id (soft delete)
router.delete("/:id",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id);
            await empleadoService.deleteEmpleado(id);

            const response: ApiResponse<null> = {
                status: "success",
                message: "Empleado eliminado correctamente",
                data: null,
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
);

export default router;
