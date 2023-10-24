import { z } from "zod";
import { t } from "i18next";
import { NAME_INPUTS_SUBSCRIPTIONS } from "../../constants";

const subscriptionsSchema = z.object({
    [NAME_INPUTS_SUBSCRIPTIONS.NAME]: z
        .string({ required_error: t("shop.plans.validation.name.required")   })
        .min(3, { message: t("shop.plans.validation.name.min") })
        .max(50, { message: t("shop.plans.validation.name.max") }),
    [NAME_INPUTS_SUBSCRIPTIONS.DESCRIPTION]: z
        .string(),
    [NAME_INPUTS_SUBSCRIPTIONS.PRICE]: z.coerce
        .number({ required_error: t("shop.plans.validation.price.required")})
        .min(1, { message: t("shop.plans.validation.price.min") })
        .max(999999, { message: t("shop.plans.validation.price.max") }),
    [NAME_INPUTS_SUBSCRIPTIONS.SIGNUP_FEE]: z.coerce
        .number({ required_error: t("shop.plans.validation.signupFee.required")})
        .min(1, { message: t("shop.plans.validation.signupFee.min") })
        .max(999999, { message: t("shop.plans.validation.signupFee.max") }),
    [NAME_INPUTS_SUBSCRIPTIONS.CURRENCY]: z
        .string()
        .min(1, { message: t("shop.plans.validation.currency.required") }),
    [NAME_INPUTS_SUBSCRIPTIONS.INVOICE_PERIOD]: z.coerce
        .number({ required_error: t("shop.plans.validation.period.required")})
        .min(1, { message: t("shop.plans.validation.period.min") })
        .max(99999, { message: t("shop.plans.validation.period.max") }),
    [NAME_INPUTS_SUBSCRIPTIONS.INVOICE_INTERVAL]: z
        .string()
        .min(1, { message: t("shop.plans.validation.interval.required") })
});

export const validateSubscriptionsData = (data) => {
    const result = subscriptionsSchema.safeParse(data);

    return result.success ? null : result.error.formErrors.fieldErrors;
};
