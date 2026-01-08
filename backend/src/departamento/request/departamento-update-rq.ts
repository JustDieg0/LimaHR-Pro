import { body } from "express-validator";

export const departamentoUpdateRq = () => [
    body("nombre")
        .optional()
        .trim()
        .notEmpty().withMessage("El nombre es obligatorio")
        .isString().withMessage("El nombre debe ser texto")
        .isLength({ min: 3, max: 100 }).withMessage("El nombre debe tener entre 3 y 50 caracteres")
]