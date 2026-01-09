import { Router } from "express";
import departamentoController from "../departamento/departamento.controller";
import empleadoController from "../empleado/empleado.controller";

const router = Router();

router.use("/departamentos", departamentoController)
router.use("/empleados", empleadoController)

export default router;