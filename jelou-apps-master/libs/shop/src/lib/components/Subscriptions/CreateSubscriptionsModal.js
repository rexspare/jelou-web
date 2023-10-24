import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ErrorIcon } from "@apps/shared/icons";
import { ModalHeadless } from "@apps/shared/common";
import { useSubscriptionsActions } from "./subscriptions";

import { validateSubscriptionsData } from "./validateSubscriptionsData";
import { INPUTS_LIST_SUBSCRIPTIONS, CURRENCIES, INVOICE_INTERVALS } from "../../constants";

import { InputSelector } from "../CreateProduct/Manually/PrincipalDataPanel/InputSelector";

const CreateSubscriptionsModal = ({ isShow, onClose, setSubscriptionsList }) => {
    const { t } = useTranslation();
    const [emptyValue, setEmptyValue] = useState({});

    const { create, loading } = useSubscriptionsActions({ setSubscriptionsList, onClose });

    const handleCreateSubscriptionSubmit = (evt) => {
        evt.preventDefault();

        const formData = new FormData(evt.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const errors = validateSubscriptionsData(data);
        if (errors) return setEmptyValue(errors);

        setEmptyValue({});
        create({ dataForm: data });
    };

    return (
        <ModalHeadless
            closeModal={() => {
                onClose();
                setEmptyValue({});
            }}
            isShowModal={isShow}
            titleModal={t("shop.plans.create.title")}
            className="inline-block h-[45rem] w-92 transform overflow-hidden rounded-20 bg-white pl-8 text-left align-middle font-semibold text-gray-400 shadow-xl transition-all"
        >
            <form className="flex flex-col pr-6 text-13 font-medium" onSubmit={handleCreateSubscriptionSubmit}>
                <div className="flex h-[34rem] w-full flex-col gap-4 overflow-y-scroll pr-2">
                    {INPUTS_LIST_SUBSCRIPTIONS.map((input) => {
                        const { label, name, placeholder, type } = input;
                        const hasError = emptyValue[name];

                        return (
                            <>
                                {type === "select" && (
                                    <InputSelector
                                        name={name}
                                        label={label}
                                        disabled={loading}
                                        multiSelect={false}
                                        hasError={hasError}
                                        placeholder={placeholder}
                                        options={name === "currency" ? CURRENCIES : INVOICE_INTERVALS}
                                    />
                                )}
                                {type !== "select" && (
                                    <label key={name}>
                                        {label}
                                        <input
                                            {...(type === "number" && name !== "invoice_period" && { step: "0.01" })}
                                            name={name}
                                            type={type}
                                            placeholder={placeholder}
                                            className={`mt-1 block w-full rounded-lg font-normal text-[#707C95] text-opacity-75 placeholder:text-opacity-50 focus:ring-transparent ${
                                                hasError
                                                    ? "border-2 border-red-950 bg-red-1010 bg-opacity-10 focus:border-red-950"
                                                    : "border-none bg-primary-700 bg-opacity-75 focus:border-transparent"
                                            }`}
                                        />
                                        {hasError && (
                                            <div className="mt-2 ml-2 flex items-center gap-2 font-medium">
                                                <ErrorIcon /> <span className="text-red-1010">{hasError}</span>
                                            </div>
                                        )}
                                    </label>
                                )}
                            </>
                        );
                    })}
                </div>
                <div className="mt-8 flex justify-end gap-4">
                    <button
                        onClick={(evt) => {
                            evt.preventDefault();
                            onClose();
                            setEmptyValue({});
                        }}
                        className="h-10 w-28 rounded-20 bg-gray-10 font-semibold text-gray-400"
                    >
                        {t("buttons.cancel")}
                    </button>
                    <button disabled={loading} type="submit" className="button-gradient-xl flex items-center justify-center whitespace-nowrap">
                        {loading ? (
                            <span>
                                <svg className="sh-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </span>
                        ) : (
                            t("buttons.save")
                        )}
                    </button>
                </div>
            </form>
        </ModalHeadless>
    );
};

export default CreateSubscriptionsModal;
