import { useState } from "react";

import { InputErrorMessage } from "./ShowErrors.Input";

type DefaultProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
export type InputTextPorps = DefaultProps & {
    label?: string | JSX.Element;
    hasError?: string | null;
    inline?: boolean;
    labelClassName?: string;
};

export const TextInput = ({
    label,
    hasError,
    inline = false,
    onChange = undefined,
    labelClassName = "block font-medium mb-1",
    className = "bg-white h-12 pl-3 rounded-10 border-1 border-gray-330",
    value: externalValue = undefined,
    defaultValue: externalDefaultValue = undefined,
    ...rest
}: InputTextPorps) => {
    const [value, setValue] = useState(externalValue ?? externalDefaultValue ?? "");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setValue(value);
        if (onChange) onChange(event);
    };

    return (
        <>
            <div className={inline ? "flex items-center gap-3" : "relative"}>
                {label && <span className={`${labelClassName} flex items-center gap-2`}>{label}</span>}
                <input
                    onChange={handleChange}
                    value={value}
                    type="text"
                    className={`w-full rounded-10 text-gray-400 placeholder:text-13 placeholder:font-semibold placeholder:text-gray-330 focus:border-gray-340 disabled:cursor-not-allowed disabled:bg-opacity-50 ${className}${
                        inline ? "flex-1" : ""
                    } ${hasError ? "border-red-530 border-1" : ""}`}
                    {...rest}
                />
            </div>
            {hasError && <InputErrorMessage hasError={hasError} />}
        </>
    );
};

type InputTextAreaPorps = React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> & {
    labelClassName?: string;
    hasError?: string;
    label?: string;
};

export const TextAreaInput = ({
    label,
    hasError,
    onChange = undefined,
    labelClassName = "block font-medium",
    className = "bg-white px-2 rounded-10 border-1 border-gray-330 h-15",
    value: externalValue = undefined,
    defaultValue: externalDefaultValue = undefined,
    ...rest
}: InputTextAreaPorps) => {
    const [value, setValue] = useState(externalValue ?? externalDefaultValue ?? "");

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = event.target;
        setValue(value);
        if (onChange) onChange(event);
    };

    return (
        <label>
            {label && <span className={`mb-1 block font-medium ${labelClassName}`}>{label}</span>}
            <textarea
                onChange={handleChange}
                value={value}
                autoCapitalize="on"
                autoComplete="on"
                autoCorrect="on"
                className={`w-full resize-none rounded-10 py-2 pl-3 text-gray-400 placeholder:text-13 placeholder:font-semibold placeholder:text-gray-330 focus:border-gray-340  disabled:cursor-not-allowed disabled:bg-opacity-50 ${className} ${
                    hasError ? "border-red-530 border-1" : ""
                }`}
                spellCheck="true"
                {...rest}
            />
            {hasError && <InputErrorMessage hasError={hasError} />}
        </label>
    );
};
