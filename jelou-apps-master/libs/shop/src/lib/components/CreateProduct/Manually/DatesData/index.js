import { useState } from "react";
import { useTranslation } from "react-i18next";
import getYear from "date-fns/getYear";
import range from "lodash/range";

import { DateInput } from "@apps/shared/common";
import { FooterBtns } from "../PrincipalDataPanel/FooterBtns";
import { HeaderPanel } from "../HeaderPanel";
import { INPUTS_NAMES, STEPS_IDS } from "../../../../constants";
import { validateDates } from "./validator.dates";
import { InputErrorMessage } from "../InputErrorMessage";

const NAME_CHECKBOX_INPUT = "desableDate";
const CHECKBOX_IS_CHECKED = "on";
const RANGE_YEARS = range(getYear(new Date()), 2031, 1);

const initialDisableDates = (product) => product[INPUTS_NAMES.AVAILABLE_AT] === null && product[INPUTS_NAMES.AVAILABLE_AT] === null;

export const DatesData = ({ closeModal, goBackPanel, product, loading, actionProduct, isUpdate }) => {
    const [disableDates, setDisableDates] = useState(initialDisableDates(product));
    const [hasError, setHasError] = useState({});

    const defaultValueAvailableDate = product[INPUTS_NAMES.AVAILABLE_AT];
    const defaultValueExpirationDate = product[INPUTS_NAMES.EXPIRES_AT];

    const { t } = useTranslation();

    const comeBackPanel = () => {
        isUpdate ? closeModal() : goBackPanel(STEPS_IDS.DATES, STEPS_IDS.PRICES);
    };

    const handleSubmitDate = (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());

        const shouldCloseModal = isUpdate === false;
        const dateIsDisable = data[NAME_CHECKBOX_INPUT] === CHECKBOX_IS_CHECKED;
        if (dateIsDisable) {
            setHasError({});
            actionProduct({ [INPUTS_NAMES.AVAILABLE_AT]: "", [INPUTS_NAMES.EXPIRES_AT]: "" }, shouldCloseModal);
            return;
        }

        const errors = validateDates(data);
        if (errors) {
            setHasError(errors);
            return;
        }

        setHasError({});
        actionProduct(data, shouldCloseModal);
    };

    const labelBtnSecondary = isUpdate ? t("buttons.close") : t("buttons.back");
    const labelBtnPrincipal = isUpdate ? t("buttons.save") : t("buttons.create");

    return (
        <>
            <HeaderPanel closeModal={closeModal} title={t("shop.validity.title")} />

            <form onSubmit={handleSubmitDate} className="flex h-[34rem] flex-col justify-between text-base">
                <div className="grid gap-4">
                    <label>
                        <span className={`mb-1 block font-medium ${disableDates ? "text-[#E8E8E8]" : "text-gray-400"}`}>
                            {t("shop.validity.dateActivation")}
                        </span>
                        <DateInput
                            minDate={new Date()}
                            defaultValue={defaultValueAvailableDate}
                            isDisable={disableDates}
                            keyInput={INPUTS_NAMES.AVAILABLE_AT}
                            placeholder={t("shop.validity.dateActivationPlaceholder")}
                            rangeOfYear={RANGE_YEARS}
                        />
                        {hasError[INPUTS_NAMES.AVAILABLE_AT] && <InputErrorMessage hasError={hasError[INPUTS_NAMES.AVAILABLE_AT]} />}
                    </label>

                    <label>
                        <span className={`mb-1 block font-medium ${disableDates ? "text-[#E8E8E8]" : "text-gray-400"}`}>
                            {t("shop.validity.dateDesactivation")}
                        </span>
                        <DateInput
                            minDate={new Date()}
                            defaultValue={defaultValueExpirationDate}
                            isDisable={disableDates}
                            keyInput={INPUTS_NAMES.EXPIRES_AT}
                            placeholder={t("shop.validity.dateDesactivationPlaceholder")}
                            rangeOfYear={RANGE_YEARS}
                        />
                        {hasError[INPUTS_NAMES.EXPIRES_AT] && <InputErrorMessage hasError={hasError[INPUTS_NAMES.EXPIRES_AT]} />}
                    </label>

                    <label className="check flex select-none items-center gap-4 font-semibold text-primary-200">
                        <input
                            onChange={(e) => setDisableDates(e.target.checked)}
                            defaultChecked={disableDates}
                            name={NAME_CHECKBOX_INPUT}
                            className="rounded-default border-primary-200 text-primary-200"
                            type={"checkbox"}
                        />
                        <span>{t("shop.validity.permanentProduct")}</span>
                    </label>
                </div>

                <FooterBtns
                    closeModal={comeBackPanel}
                    loading={loading}
                    labelBtnPrincipal={labelBtnPrincipal}
                    labelBtnSecondary={labelBtnSecondary}
                />
            </form>
        </>
    );
};
