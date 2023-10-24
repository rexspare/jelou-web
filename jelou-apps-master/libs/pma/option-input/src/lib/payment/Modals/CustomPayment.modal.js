import { useSelector } from "react-redux";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { generatePaymentData, getCredentials } from "../utils";
import { ID_FIELD_CUSTOM_PAYMENT } from "../constants.payments";
import { validateNumber, validatorPayment, validateCustomPaymentArray } from "../validator/index";
import { getPaymentLink } from "../service/customPayment";
import { SpinnerIcon } from "@apps/shared/icons";
import { renderMessage } from "@apps/shared/common";
import { ModalHeadless } from "@apps/pma/ui-shared";
import { MESSAGE_TYPES } from "@apps/shared/constants";

const CustomPaymentModal = ({ onClose, isOpen, setPaymentLink, setPaymentMessage }) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({});
    const [inputAmount, setInputAmount] = useState("");

    const company = useSelector((state) => state.company);
    const currentRoom = useSelector((state) => state.currentRoom);

    const INPUTS_CUSTOM_PAYMENT = [
        {
            id: 1,
            label: t("pma.name"),
            name: ID_FIELD_CUSTOM_PAYMENT.NAMES,
            placeholder: t("pma.clientName"),
            type: "text",
        },
        {
            id: 2,
            label: t("pma.surname"),
            name: ID_FIELD_CUSTOM_PAYMENT.SURNAME,
            placeholder: t("pma.clientSurname"),
            type: "text",
        },
        {
            id: 3,
            label: t("Email"),
            name: ID_FIELD_CUSTOM_PAYMENT.EMAIL,
            placeholder: t("pma.clientEmail"),
            type: "text",
        },
        {
            id: 4,
            label: t("pma.legalId"),
            name: ID_FIELD_CUSTOM_PAYMENT.LEGAL_ID,
            placeholder: t("pma.clientCedula"),
            type: "text",
        },
        {
            id: 5,
            label: t("pma.amount"),
            name: ID_FIELD_CUSTOM_PAYMENT.AMOUNT,
            placeholder: t("pma.amount"),
            type: "text",
        },
        {
            id: 6,
            label: t("pma.description"),
            name: ID_FIELD_CUSTOM_PAYMENT.DESCRIPTION,
            placeholder: t("pma.description"),
            type: "text",
        },
    ];

    const handleCustomPaymentSubmit = useCallback(async (evt, company) => {
        evt.preventDefault();

        const data = new FormData(evt.target);
        const values = Object.fromEntries(data);

        const dataParse = {
            ...values,
            [ID_FIELD_CUSTOM_PAYMENT.AMOUNT]: parseFloat(values[ID_FIELD_CUSTOM_PAYMENT.AMOUNT]),
        };

        setLoading(true);
        const { hasError, errors } = validatorPayment(dataParse, validateCustomPaymentArray);
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

        const { app_id, bearer_token, gateway_id, countryCode, senderId } = credentials;
        const paymentData = generatePaymentData({ gateway_id, values, country: countryCode, reference_id: senderId });

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
    }, []);

    return (
        <ModalHeadless className="w-80 p-2" closeModal={onClose} isOpen={isOpen} title={t("pma.customPayment")} classTitle="pl-4 my-3">
            <form onSubmit={(evt) => handleCustomPaymentSubmit(evt, company)} className="px-4 text-gray-400">
                <div className="max-h-sm space-y-3 overflow-y-scroll pr-1 text-sm">
                    {INPUTS_CUSTOM_PAYMENT.map((input) => {
                        const { id, label, name, placeholder, type } = input;
                        const errorMessage = error[name];

                        const styleInput = errorMessage
                            ? "border-2 border-secondary-250 bg-red-675 bg-opacity-10 focus:border-secondary-250"
                            : "border-none bg-primary-700 bg-opacity-75 focus:border-transparent";

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
                        className="flex h-8 items-center rounded-full bg-primary-700 px-4 py-2 text-center font-medium text-gray-400">
                        {t("buttons.cancel")}
                    </button>
                    <button className="flex h-8 min-w-20 items-center justify-center rounded-full bg-primary-200 px-4 py-2 text-center font-medium text-white">
                        {loading ? <SpinnerIcon /> : t("pma.Enviar")}
                    </button>
                </footer>
            </form>
        </ModalHeadless>
    );
};
export default CustomPaymentModal;
