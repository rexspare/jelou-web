import { useEffect, useState } from "react";
import isEmpty from "lodash/isEmpty";

const SelectComponent = (props) => {
    const { value, onChange, options, name, title } = props;
    const [selectedValue, setSelectedValue] = useState(value);

    const entries = Array.isArray(options) ? options : Object.entries(options).map(([value, label]) => ({ value, label }));

    const handleChange = (e) => {
        onChange(e.target.value);
        setSelectedValue(e.target.value);
    };

    useEffect(()=>{setSelectedValue(value)},[value])

    return (
        <>
            {!isEmpty(title) && <div className="ml-4 mb-[0.3rem] font-bold">{title}</div>}
            <select
                className="py-auto mb-1 h-11 w-full rounded-lg border-1 border-neutral-200 px-4 text-sm"
                onChange={handleChange}
                value={selectedValue}
                name={name}>
                {entries.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </>
    );
};

export default SelectComponent;
