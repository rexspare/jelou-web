import { InputErrorMessage } from "../InputErrorMessage";

export const InputNumber = ({ 
    name, 
    label, 
    value, 
    setValue, 
    disabled,
    hasError, 
    placeholder, 
    isPrices = false,
}) => {

    const handleChange = (e) => {
        setValue(e.target.value)
    }

    const classStyle = `mt-1 block w-full rounded-lg font-normal text-[#707C95] text-opacity-75 placeholder:text-opacity-50 focus:ring-transparent ${
        hasError
            ? "border-2 border-red-950 bg-red-1010 bg-opacity-10 focus:border-red-950"
            : "border-none bg-primary-700 bg-opacity-75 focus:border-transparent"
    }`

    return (
        <label className="font-medium">
            {label}
            {
                isPrices && (
                <input
                    step="0.01"
                    name={name}
                    type="number"
                    value={value}
                    disabled={disabled}
                    className={classStyle}
                    onChange={handleChange}
                    placeholder={placeholder}
                />
                )
            }
            {
                !isPrices && (
                    <input
                        step="0.01"
                        name={name}
                        type="number"
                        disabled={disabled}
                        defaultValue={value}
                        className={classStyle}
                        placeholder={placeholder}
                    />
                )
            }
            {hasError && <InputErrorMessage hasError={hasError} />}
        </label>
    );
};
