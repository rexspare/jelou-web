import { z } from "zod";
import { NAME_INPUTS_CATEGORY } from "../../constants";

const categoriesShema = z.object({
    [NAME_INPUTS_CATEGORY.NAME]: z
        .string({ required_error: "El nombre de la categoría es requerido" })
        .min(3, { message: "El nombre de la categoría debe tener mínimo 3 caracteres" })
        .max(50, { message: "El nombre de la categoría no puede tener más de 50 caracteres" }),
    [NAME_INPUTS_CATEGORY.DESCRIPTION]: z
        .string({ required_error: "La descripción de la categoría es requerida" })
        .min(3, { message: "La descripción de la categoría debe tener mínimo 3 caracteres" })
        .max(100, { message: "La descripción de la categoría no puede tener más de 50 caracteres" }),
});

export const validateCategoryData = (data) => {
    const result = categoriesShema.safeParse(data);

    return result.success ? null : result.error.formErrors.fieldErrors;
};
