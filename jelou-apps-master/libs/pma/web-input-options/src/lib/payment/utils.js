import { renderMessage } from "@apps/shared/common";
import { MESSAGE_TYPES } from "@apps/shared/constants";
import { ID_FIELD_CUSTOM_PAYMENT, EXPIRY_TIME_LINK, PAYMENTS_TYPES } from "./constants.payments";

export const getCredentials = ({ company = {}, currentRoom = {} } = {}) => {
    const { jelou_pay = {} } = company?.properties?.shopCredentials || {};
    const { app_id = null, bearer_token = null, gateway_id = null } = jelou_pay;

    if (!app_id || !bearer_token || !gateway_id) {
        console.error("customPaymentLink invalid credentials", { app_id, bearer_token, gateway_id });
        renderMessage("No se encontraron las credenciales, por favor refresca e intenta de nuevo", MESSAGE_TYPES.ERROR);
        return null;
    }

    const { senderId = null, metadata = {} } = currentRoom;
    const { countryCode = "EC" } = metadata;

    if (!senderId) {
        console.error("customPaymentLink invalid senderId", { senderId });
        renderMessage("No se encontró un valor valioso para esta acción, por favor refresca e intenta de nuevo", MESSAGE_TYPES.ERROR);
        return null;
    }

    return { app_id, bearer_token, gateway_id, countryCode, senderId };
};

export const generatePaymentData = ({ values, gateway_id, country, reference_id }) => {
    return {
        gateway_id,
        type: PAYMENTS_TYPES.PAYMENT,
        client: {
            reference_id,
            country,
            phone: reference_id,
            names: values[ID_FIELD_CUSTOM_PAYMENT.NAMES],
            surname: values[ID_FIELD_CUSTOM_PAYMENT.SURNAME],
            email: values[ID_FIELD_CUSTOM_PAYMENT.EMAIL],
            legal_id: values[ID_FIELD_CUSTOM_PAYMENT.LEGAL_ID],
            legal_id_type: "ci",
        },
        order: {
            non_taxable_amount: values[ID_FIELD_CUSTOM_PAYMENT.AMOUNT],
            taxable_amount: 0,
            tax_percentage: 12,
        },
        order_details: [
            {
                name: values[ID_FIELD_CUSTOM_PAYMENT.DESCRIPTION],
                price: values[ID_FIELD_CUSTOM_PAYMENT.AMOUNT],
                quantity: 1,
                should_apply_tax: false,
            },
        ],
        ttl: EXPIRY_TIME_LINK,
    };
};

export const generateRecurringPaymentData = ({ gateway_id, plan_ids, clientData, country, reference_id }) => ({
    gateway_id,
    type: PAYMENTS_TYPES.SUSCRIPTION,
    client: {
        ...clientData,
        legal_id_type: "ci",
        country,
        reference_id,
    },
    // call_to_action: {
    //     url: "https://www.jelou.com",
    //     text: "Pagar",
    // },
    plan_ids,
});
