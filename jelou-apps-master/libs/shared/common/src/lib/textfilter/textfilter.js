import React from "react";
import { DebounceInput } from "react-debounce-input";
import isEmpty from "lodash/isEmpty";

/* Components */
// import FilterContainer from "./FilterContainer";

const TextFilter = ({ filter, onChange, background, label = "", icon = {}, value = "" }) => {
    const handleChange = ({ target }) => {
        const { value } = target;
        // const { key } = filter;
        onChange(value);
    };

    return (
        // <FilterContainer filter={filter}>
        <div className="w-full rounded-[0.8125rem]">
            <div className="form">
                <DebounceInput
                    minLength={2}
                    debounceTimeout={600}
                    onChange={handleChange}
                    className="form__input !font-semibold !text-primary-200"
                    placeholder={" "}
                    value={value}
                />
                {(!isEmpty(label) || !isEmpty(icon)) && (
                    <label
                        htmlFor="email"
                        className={`form__label lg: pointer-events-none flex w-3/4 truncate lg:w-max `}
                        style={{ backgroundColor: background }}>
                        {!isEmpty(icon) && icon}
                        <span className="pl-1">{label}</span>
                    </label>
                )}
            </div>
        </div>
        // </FilterContainer>
    );
};

export default TextFilter;
