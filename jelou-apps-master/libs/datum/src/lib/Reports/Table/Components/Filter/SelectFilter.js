import get from "lodash/get";
import React, { useEffect, useState } from "react";

import { ComboboxSelect } from "@apps/shared/common";

const SelectFilter = ({ filter, setRequestParams }) => {
    const { placeholder, key, label } = filter;
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState({});

    useEffect(() => {
        const filterOptions = get(filter, "options", []);
        setOptions(
            filterOptions.map((option) => ({
                name: option.label,
                value: option.value,
            }))
        );
    }, [filter]);

    const handleChange = (value) => {
        setValue(value);
        setRequestParams((preState) => ({ ...preState, [key]: value.value }));
    };

    const clearFilter = () => {
        setValue({});
        setRequestParams((preState) => ({ ...preState, [key]: "" }));
    };

    return (
        options &&
        options.length > 0 && (
            <div className="w-60">
                <ComboboxSelect
                    // icon={filter.icon}
                    background={"#fff"}
                    clearFilter={clearFilter}
                    handleChange={handleChange}
                    label={label}
                    name={key}
                    options={options}
                    placeholder={placeholder}
                    value={value}
                />
            </div>
        )
    );
};

export default SelectFilter;
