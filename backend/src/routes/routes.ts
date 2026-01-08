import { Router } from "express";
import departamentoController from "../departamento/departamento.controller";

const router = Router();

router.use("/departamentos", departamentoController)

export default router;