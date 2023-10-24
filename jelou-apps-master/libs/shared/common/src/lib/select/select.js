import React from "react";
import SelectSearch from "react-select-search";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";

const SearchSelect = (props) => {
    const { title } = props;
    let options = isEmpty(props.options) ? [] : props.options;
    options = options.map((opt) => {
        const name = opt.title ? opt.title : opt.name || opt.names;
        return { ...opt, value: get(opt, 'id', get(opt, 'value', '')).toString(), name: name };
    });
    let value = !isEmpty(props.value) ? props.value.toString() : [];

    return (
        <div className={`relative ${props.className}`}>
            {!isEmpty(title) && <div className="ml-5 mb-2 text-sm font-bold leading-5 text-gray-400 text-opacity-75 xxl:text-15">{title}</div>}
            <SelectSearch
                id={props.id}
                className={`select-search ${props.className}`}
                options={options}
                value={value}
                name={props.name}
                search
                required={props.required}
                placeholder={props.placeholder}
                onChange={(evt) => {
                    props.onChange(evt);
                }}
            />
        </div>
    );
};

export default SearchSelect;
