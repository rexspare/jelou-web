import { z } from "zod";

import { INPUTS_NAMES } from "../../../../constants";

const productSchema = z.object({
    [INPUTS_NAMES.NAME]: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
    [INPUTS_NAMES.SKU]: z.string().min(3, { message: "El SKU debe tener al menos 3 caracteres" }),
    [INPUTS_NAMES.PRICE]: z
        .string()
        .min(1, { message: "El precio base es requerido" })
        .refine((value) => !value.startsWith("-"), { message: "El precio base no puede iniciar con -" }),
    [INPUTS_NAMES.DESCRIPTION]: z.string().min(3, { message: "La descripción debe tener al menos 3 caracteres" }),
    [INPUTS_NAMES.CATEGORIES]: z
        .array(
            z.string({ required_error: "Debe seleccionar al menos una categoría" }).min(1, { message: "Debe seleccionar al menos una categoría" }),
            { required_error: "Debe seleccionar al menos una categoría" }
        )
        .min(1, { message: "Debe seleccionar al menos una categoría" }),
    [INPUTS_NAMES.DISCOUNT_TYPE]: z
        .string({ required_error: "El tipo de descuento es requerido" })
        .min(1, { message: "El tipo de descuento es requerido" }),
    [INPUTS_NAMES.HAS_TAX]: z.number().int().min(0, { message: "El impuesto es requerido" }).max(1, { message: "El impuesto es requerido" }),
    [INPUTS_NAMES.DISCOUNT]: z.string({ required_error: "El descuento es requerido" }).min(1, { message: "El descuento es requerido" }).optional(),
    [INPUTS_NAMES.STOCK_TYPE]: z.string({ required_error: "El tipo de stock es requerido" }).min(1, { message: "El tipo de stock es requerido" }),
    [INPUTS_NAMES.STOCK]: z
        .string({ required_error: "La cantidad de stock es requerida" })
        .min(1, { message: "La cantidad de stock es requerida" })
        .optional(),
});

export const validatePrincipalData = (data) => {
    const result = productSchema.safeParse(data);

    return result.success ? null : result.error.formErrors.fieldErrors;
};
