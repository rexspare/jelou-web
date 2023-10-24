import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ErrorIcon } from "@apps/shared/icons";
import { TYPES_COLUMN } from "../../../../constants";

export const NumberInput = ({ name, defaultValue, handleChangeDataForm, keyInput, type, isRequired, isDisable } = {}) => {
    const [value, setValue] = useState(defaultValue ?? "");
    const [error, setError] = useState(null);
    const { t } = useTranslation();

    const handleChange = (evt) => {
        const { value } = evt.target;
        if (isNaN(value)) {
            const errorMessage = TYPES_COLUMN.double === type ? t("datum.error.onlyNumberWithDot") : t("datum.error.onlyNumber");
            setError(errorMessage);
            return;
        }

        if ((TYPES_COLUMN.integer === type && value.includes(".")) || value.includes(",")) {
            setError(t("datum.error.onlyNumber"));
            return;
        }

        setError(null);
        setValue(value);
        handleChangeDataForm({ value, name: keyInput, type });
    };

    return (
        <label>
            {name}
            <input
                value={value}
                onChange={handleChange}
                className={`mb-4 mt-1 block w-full rounded-lg font-normal placeholder:text-opacity-50 focus:ring-transparent ${
                    error
                        ? "border-2 border-red-950 bg-red-1010 bg-opacity-10 focus:border-red-950"
                        : "border-none bg-primary-700 bg-opacity-75 focus:border-transparent"
                }`}
                placeholder={name}
                type="text"
                name={keyInput}
                required={isRequired}
                readOnly={isDisable}
            />
            {error && (
                <div className="flex items-center gap-2 mb-4 font-medium">
                    <ErrorIcon /> <span className="text-red-1010">{error}</span>
                </div>
            )}
        </label>
    );
};
