import { useState } from "react";

export const TextInput = ({ keyInput, type, name, defaultValue, handleChangeDataForm, isRequired, isDisable } = {}) => {
    const [value, setValue] = useState(defaultValue ?? "");
    const hanldeChange = (evt) => {
        const { value } = evt.target;
        setValue(value);
        handleChangeDataForm({ value, name: keyInput, type });
    };

    return (
        <label>
            {name}
            <input
                className="block w-full mt-1 mb-4 font-normal bg-opacity-75 border-none rounded-lg bg-primary-700 placeholder:text-opacity-50 focus:border-transparent focus:ring-transparent"
                name={keyInput}
                onChange={hanldeChange}
                placeholder={name}
                required={isRequired}
                type="text"
                value={value}
                readOnly={isDisable}
            />
        </label>
    );
};
