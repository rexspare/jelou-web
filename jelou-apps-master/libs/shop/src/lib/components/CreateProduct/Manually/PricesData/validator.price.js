import { z } from "zod";

import { NAME_PRICES_INPUTS } from "../../../../constants";

const productSchema = z
    .object({
        [NAME_PRICES_INPUTS.VALUE]: z.string().min(1, { message: "El precio es requerido" }),
        [NAME_PRICES_INPUTS.CURRENCY]: z.string({ required_error: "La moneda es requerida" }).min(1, { message: "Debe elegir un tipo de moneda" }),
        [NAME_PRICES_INPUTS.ISEDIT]: z.boolean(),
        [NAME_PRICES_INPUTS.ISSAVED]: z.boolean(),
        [NAME_PRICES_INPUTS.PRICE_GROUP_TAGS]: z
            .array(z.string({ required_error: "La etiqueta es requerida" }))
            .min(1, { message: "Debe tener al menos una etiqueta" }),
    })
    .strict();

export const validatePriceData = (data) => {
    const result = productSchema.safeParse(data);

    return result.success ? null : result.error.formErrors.fieldErrors;
};
