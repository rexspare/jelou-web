import { z } from "zod";

import { INPUTS_NAMES } from "../../../../constants";

const dateSchema = z
    .object({
        [INPUTS_NAMES.AVAILABLE_AT]: z.string().min(1, { message: "La fecha de activación es requerida" }),
        [INPUTS_NAMES.EXPIRES_AT]: z.string().min(1, { message: "La fecha de desactivación es requerida" }),
    })
    .strict();

export const validateDates = (data) => {
    const result = dateSchema.safeParse(data);

    return result.success ? null : result.error.formErrors.fieldErrors;
};
