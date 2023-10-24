import React, { useState } from "react";
import { DebounceInput } from "react-debounce-input";
import { CloseIcon } from "@apps/shared/icons";

const TextFilter = ({ setRequestParams, filter }) => {
    const [value, setValue] = useState("");
    const { key, label } = filter;

    const handleChange = ({ target }) => {
        const { value } = target;
        setValue(value);
        setRequestParams((preState) => ({ ...preState, [key]: value }));
    };

    const hanldeClearInputSearchClick = (evt) => {
        evt.preventDefault();
        setValue("");
        setRequestParams((preState) => ({ ...preState, [key]: "" }));
    };

    return (
        <div className="text-gray-475 relative inline-flex h-10 w-full items-center rounded-12 border-1.5 border-gray-100 border-opacity-50 bg-white px-3 text-left text-13 font-normal focus:outline-none">
            <label
                htmlFor="email"
                className={`label-top-animation whitespace-nowrap bg-white px-0.5 font-normal ${
                    value ? "absolute -translate-y-5" : "translate-y-0"
                }`}>
                {value && label}
            </label>
            <DebounceInput
                value={value ?? ""}
                className={`focus:ring-0 inputShop placeholder-gray-475 border-none bg-transparent text-sm leading-5 text-primary-200 ring-transparent focus:border-transparent focus:ring-transparent ${
                    value ? "font-bold" : "font-normal"
                }`}
                debounceTimeout={500}
                minLength={3}
                onChange={handleChange}
                placeholder={label}
                type="search"
            />
            {value && (
                <div className="flex w-full justify-end">
                    <button onClick={hanldeClearInputSearchClick}>
                        <CloseIcon width={10} height={10} fill="rgba(166, 180, 208,1)" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default TextFilter;
