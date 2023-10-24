import React from "react";
import SelectSearch from "react-select-search";
import truncate from "lodash/truncate";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import fuzzySearch from "../fuzzy-search/fuzzy-search";

/**
 * option props should be like { value, label }
 */
const SearchSelect = (props) => {
    const { title } = props;

    let options = isEmpty(props.options) ? [] : props.options;
    options = options.map((opt) => {
        const name = opt.label ? opt.label : opt.name || opt.names;
        return { ...opt, value: get(opt, "value", get(opt, 'id')).toString(), name: name };
    });
    let hasAll = true;
    hasAll = props.hasAll;

    let value = isEmpty(props.value) ? [] : props.value;

    return (
        <div className={`relative ${props.className}`}>
            {!isEmpty(title) && <div className="ml-5 mb-2 text-sm font-bold leading-5 text-gray-500 xxl:text-15">{title}</div>}
            <SelectSearch
                options={isEmpty(options) && hasAll ? [{ value: props.value, name: "Todas" }] : options}
                name={props.name}
                search={true}
                filterOptions={fuzzySearch}
                className="select-search flex h-10 items-center justify-between"
                renderValue={(valueProps) => {
                    const value = truncate(valueProps.value, {
                        length: 40,
                        separator: "...",
                    });
                    return <input {...valueProps} value={value} className="select-search__input" />;
                }}
                onChange={(evt) => {
                    props.onChange(evt);
                }}
                value={value}
                placeholder={props.placeholder}
            />
        </div>
    );
};

export default SearchSelect;
