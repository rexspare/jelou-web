import type { InputNumberProps } from "./types.input";

import { useCallback, useState } from "react";

import { InputErrorMessage } from "./ShowErrors.Input";

export const NumberInput = ({
    name,
    label,
    disabled,
    hasError,
    placeholder,
    defaultValue,
    onChange = undefined,
    labelClassName = "block",
    className = "bg-white px-3 py-6 h-8 rounded-10 border-1 border-gray-330 placeholder:text-gray-330 placeholder:text-13",
}: InputNumberProps) => {
    const [valueInput, setValueInput] = useState<string | undefined>(defaultValue);
    const [errors, setErrors] = useState<string | undefined>(hasError ?? undefined);

    const onChangeNumber = useCallback(
        (evt: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = evt.currentTarget;

            if (isNaN(Number(value))) {
                setErrors("Este campo solo acepta números");
                return;
            }

            setErrors(undefined);
            setValueInput(value);
            onChange && onChange(evt);
        },
        [onChange]
    );

    const isError = hasError || errors;

    return (
        <label className="flex flex-col">
            {label && <span className={labelClassName}>{label}</span>}
            <input
                name={name}
                value={valueInput}
                type="text"
                readOnly={disabled}
                min={0}
                placeholder={placeholder}
                // defaultValue={defaultValue}
                onChange={onChangeNumber}
                className={`h-8 w-full rounded-10 text-gray-400 placeholder:text-13 placeholder:font-semibold placeholder:text-gray-330 focus:border-gray-330 disabled:cursor-not-allowed disabled:bg-opacity-50 ${
                    disabled && "cursor-not-allowed"
                } ${className}${isError ? "border-red-530 border-1" : ""}`}
            />
            {isError && <InputErrorMessage hasError={isError} />}
        </label>
    );
};
