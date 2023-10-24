import ow from "ow";

import { ID_FIELD_CUSTOM_PAYMENT, RECURRING_PAYMENT_NAMES } from "../constants.payments";

export const validateNumber =
    ({ setInputAmount, setError }) =>
    (evt) => {
        const { value } = evt.target;

        if (isNaN(value)) {
            setError((preState) => ({ ...preState, [ID_FIELD_CUSTOM_PAYMENT.AMOUNT]: "Este campo solo admite números" }));
            return;
        }

        setInputAmount(value);
        setError((preState) => {
            const { [ID_FIELD_CUSTOM_PAYMENT.AMOUNT]: _, ...rest } = preState;
            return rest;
        });
    };

export const validateCustomPaymentArray = [
    {
        key: ID_FIELD_CUSTOM_PAYMENT.NAMES,
        validator: ow.string.minLength(3).not.numeric,
        message: "El nombre debe tener mínimo 3 caracteres",
    },
    {
        key: ID_FIELD_CUSTOM_PAYMENT.SURNAME,
        validator: ow.string.minLength(3).not.numeric,
        message: "El apellido debe tener mínimo 3 caracteres",
    },
    {
        key: ID_FIELD_CUSTOM_PAYMENT.AMOUNT,
        validator: ow.number.greaterThanOrEqual(0),
        message: "El valor mínimo para este campo es 0",
    },
    {
        key: ID_FIELD_CUSTOM_PAYMENT.DESCRIPTION,
        validator: ow.string.minLength(3),
        message: "La descripción debe tener mínimo 3 caracteres",
    },
    {
        key: ID_FIELD_CUSTOM_PAYMENT.EMAIL,
        // eslint-disable-next-line no-useless-escape
        validator: ow.string.matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
        message: "El correo no es válido",
    },
    {
        key: ID_FIELD_CUSTOM_PAYMENT.LEGAL_ID,
        validator: ow.string.length(10),
        message: "La cédula debe tener 10 dígitos",
    },
];

export const validateRecurringPaymentArray = [
    {
        key: RECURRING_PAYMENT_NAMES.NAMES,
        validator: ow.string.minLength(3).not.numeric,
        message: "El nombre debe tener mínimo 3 caracteres",
    },
    {
        key: RECURRING_PAYMENT_NAMES.SURNAME,
        validator: ow.string.minLength(3).not.numeric,
        message: "El apellido debe tener mínimo 3 caracteres",
    },
    {
        key: RECURRING_PAYMENT_NAMES.LEGAL_ID,
        validator: ow.string.length(10),
        message: "La cédula debe tener 10 dígitos",
    },
    {
        key: RECURRING_PAYMENT_NAMES.EMAIL,
        // eslint-disable-next-line no-useless-escape
        validator: ow.string.matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
        message: "El correo no es válido",
    },
    {
        key: RECURRING_PAYMENT_NAMES.ADDRESS,
        validator: ow.string.minLength(3),
        message: "La dirección debe tener mínimo 3 caracteres",
    },
    {
        key: RECURRING_PAYMENT_NAMES.PLAN,
        validator: ow.string.nonEmpty,
        message: "Debes selecionar un plan",
    },
    {
        key: RECURRING_PAYMENT_NAMES.PHONE,
        validator: ow.string.length(10).numeric,
        message: "El teléfono debe tener 10 dígitos",
    },
];

export const validatorPayment = (values, arrayInputs = []) => {
    let errors = {};
    arrayInputs.forEach(({ key, message, validator }) => {
        try {
            ow(values[key], validator);
        } catch (error) {
            errors[key] = message;
        }
    });

    const hasError = Object.keys(errors).length > 0;
    return { hasError, errors };
};
