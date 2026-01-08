import { body } from "express-validator";

export const departamentoCreateRq = () => [
    body("nombre")
        .trim()
        .notEmpty().withMessage("El nombre es obligatorio")
        .isString().withMessage("El nombre debe ser texto")
        .isLength({ min: 3, max: 100 }).withMessage("El nombre debe tener entre 3 y 50 caracteres")
]