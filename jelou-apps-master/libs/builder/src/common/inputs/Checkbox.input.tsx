// import type { CheckboxProps } from "./types.input";

import { InputErrorMessage } from "./ShowErrors.Input";

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
    hasError?: string | null;
    label?: string;
    labelClassName?: string;
};

export const CheckboxInput = ({ label, hasError, labelClassName = "block", className = "checked:text-teal-953", ...rest }: Props) => {
    return (
        <label className="flex items-center space-x-4">
            <span className={labelClassName}>{label}</span>
            <input
                // {...(onChange && { onChange })}
                // disabled={disabled}
                // name={name}
                type="checkbox"
                // defaultChecked={defaultChecked}
                className={`h-4 w-4 rounded-xs border-gray-300 focus:ring-transparent ${className}`}
                {...rest}
            />
            {hasError && <InputErrorMessage hasError={hasError} />}
        </label>
    );
};
