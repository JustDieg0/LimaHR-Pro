import { body } from "express-validator";

export const empleadoUpdateRq = () => [
    body("nombre")
        .trim()
        .optional()
        .notEmpty().withMessage("El nombre es obligatorio")
        .isString().withMessage("El nombre debe ser texto")
        .isLength({ min: 3, max: 100 }).withMessage("El nombre debe tener entre 3 y 50 caracteres"),
    body("email")
        .trim()
        .optional()
        .notEmpty().withMessage("El nombre es obligatorio")
        .isEmail().withMessage("El nombre debe ser un email")
        .isLength({ max: 100 }).withMessage("El email es de maximo 100 caracteres"),
    body("contrasena")
        .trim()
        .optional()
        .notEmpty().withMessage("La contraseña es obligatoria")
        .isStrongPassword({minLength: 8, minNumbers: 1, minSymbols: 1}).withMessage("La contraseña debe ser segura")
]