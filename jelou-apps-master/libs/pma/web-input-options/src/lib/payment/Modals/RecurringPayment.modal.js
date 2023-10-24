import { useSelector } from "react-redux";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ID_FIELD_CUSTOM_PAYMENT, RECURRING_PAYMENT_NAMES, TYPE_INPUTS } from "../constants.payments";
import { InputSelector } from "../selector.input";
import { validateNumber, validateRecurringPaymentArray, validatorPayment } from "../validator";
import { generateRecurringPaymentData, getCredentials } from "../utils";
import { getPaymentLink } from "../service/customPayment";
import { renderMessage } from "@apps/shared/common";
import { ModalHeadless } from "@apps/pma/ui-shared";
import { SpinnerIcon } from "@apps/shared/icons";
import { MESSAGE_TYPES } from "@apps/shared/constants";

const RecurringPaymentModal = ({ onClose, isOpen, setPaymentLink, setPaymentMessage, plans } = {}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({});
    const [inputAmount, setInputAmount] = useState("");

    const { t } = useTranslation();

    const company = useSelector((state) => state.company);
    const currentRoom = useSelector((state) => state.currentRoom);

    const plansOptions = plans ? plans.map((plan) => ({ value: plan.id, label: plan.name })) : [];

    const INPUTS_CUSTOM_PAYMENT = [
        {
            id: 1,
            label: t("pma.name"),
            name: RECURRING_PAYMENT_NAMES.NAMES,
            placeholder: t("pma.clientName"),
            type: TYPE_INPUTS.TEXT,
        },
        {
            id: 2,
            label: t("pma.surname"),
            name: RECURRING_PAYMENT_NAMES.SURNAME,
            placeholder: t("pma.clientSurname"),
            type: TYPE_INPUTS.TEXT,
        },
        {
            id: 3,
            label: t("pma.mail"),
            name: RECURRING_PAYMENT_NAMES.EMAIL,
            placeholder: t("pma.clientEmail"),
            type: TYPE_INPUTS.TEXT,
        },
        {
            id: 7,
            label: t("pma.phone"),
            name: RECURRING_PAYMENT_NAMES.PHONE,
            placeholder: t("pma.phonePlaceholder"),
            type: TYPE_INPUTS.TEXT,
        },
        {
            id: 4,
            label: t("pma.clientCedula"),
            name: RECURRING_PAYMENT_NAMES.LEGAL_ID,
            placeholder: t("pma.clientCedula"),
            type: TYPE_INPUTS.TEXT,
        },
        {
            id: 5,
            label: t("pma.address"),
            name: RECURRING_PAYMENT_NAMES.ADDRESS,
            placeholder: t("pma.addresPlaceholder"),
            type: TYPE_INPUTS.TEXT,
        },
        {
            id: 6,
            label: t("pma.plan"),
            name: RECURRING_PAYMENT_NAMES.PLAN,
            placeholder: t("pma.planPlaceholder"),
            type: TYPE_INPUTS.SELECTOR,
            options: plansOptions,
        },
    ];

    const handleRecurringPaymentSubmit = async (evt) => {
        evt.preventDefault();

        const data = new FormData(evt.target);
        const values = Object.fromEntries(data);

        setLoading(true);
        const { hasError, errors } = validatorPayment(values, validateRecurringPaymentArray);
        if (hasError) {
            setError(errors);
            setLoading(false);
            return;
        }
        setError({});

        const credentials = getCredentials({ company, currentRoom });
        if (!credentials) {
            setLoading(false);
            return;
        }

        const { [RECURRING_PAYMENT_NAMES.PLAN]: plan_ids, ...clientData } = values;

        const { app_id, bearer_token, gateway_id, countryCode, senderId } = credentials;
        const paymentData = generateRecurringPaymentData({
            clientData,
            plan_ids: [Number(plan_ids)],
            gateway_id,
            country: countryCode,
            reference_id: senderId,
        });

        getPaymentLink({ app_id, bearer_token, data: paymentData })
            .then((response) => {
                const { short_url } = response;
                setPaymentLink(short_url);
                setPaymentMessage(true);
                onClose();
            })
            .catch((error) => {
                console.error("handleCustomPayment ~ getPaymentLink", { error });
                renderMessage(error, MESSAGE_TYPES.ERROR);
            })
            .finally(() => setLoading(false));
    };

    return (
        <ModalHeadless className="w-80 p-2" closeModal={onClose} isOpen={isOpen} title={t("origin.recurringPayment")} classTitle="pl-4 my-3">
            <form onSubmit={handleRecurringPaymentSubmit} className="px-4 text-gray-400">
                <div className="max-h-96 space-y-3 overflow-y-scroll pb-8 pr-1 text-sm">
                    {INPUTS_CUSTOM_PAYMENT.map((input) => {
                        const { id, label, name, placeholder, type, options } = input;
                        const errorMessage = error[name];

                        const styleInput = errorMessage
                            ? "border-2 border-red-950 bg-red-1010 bg-opacity-10 focus:border-red-950"
                            : "border-none bg-primary-700 bg-opacity-75 focus:border-transparent";

                        if (type === TYPE_INPUTS.SELECTOR) {
                            return (
                                <InputSelector
                                    key={id}
                                    hasError={errorMessage}
                                    label={label}
                                    name={name}
                                    options={options}
                                    placeholder={placeholder}
                                />
                            );
                        }

                        return (
                            <label className="grid gap-1" key={id}>
                                <span>{label}</span>
                                <div className="grid w-full gap-1">
                                    <input
                                        className={`focus-within:ring-0 rounded-10 p-2 text-sm text-gray-400 placeholder:text-gray-400 placeholder:text-opacity-50 focus-within:outline-none ${styleInput}`}
                                        name={name}
                                        onChange={name === ID_FIELD_CUSTOM_PAYMENT.AMOUNT ? validateNumber({ setError, setInputAmount }) : undefined}
                                        placeholder={placeholder}
                                        type={type}
                                        value={name === ID_FIELD_CUSTOM_PAYMENT.AMOUNT ? inputAmount : undefined}
                                    />
                                    {errorMessage && <small className="mb-2 truncate text-11 italic text-rose-400">{errorMessage}</small>}
                                </div>
                            </label>
                        );
                    })}
                </div>

                <footer className="flex w-full items-center justify-end gap-3 py-6 text-sm">
                    <button
                        type={"button"}
                        onClick={onClose}
                        className="text-grey-300 h-8 rounded-full bg-primary-700 px-4 py-2 text-center font-medium">
                        {t("Cancelar")}
                    </button>
                    <button className="grid h-8 min-w-20 place-content-center rounded-full bg-primary-200 px-4 py-2 text-center font-medium text-white">
                        {loading ? <SpinnerIcon /> : t("Enviar")}
                    </button>
                </footer>
            </form>
        </ModalHeadless>
    );
};

export default RecurringPaymentModal;
