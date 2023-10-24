import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import isFunction from "lodash/isFunction";
import React, { useEffect, useState } from "react";
import Select from "../Common/Select";

const style = {
    valueContainer: (base) => ({
        ...base,
        paddingLeft: "2px!important",
        paddingRight: 0,
    }),
    singleValue: () => ({
        fontSize: "13px!important",
        fontWeight: "500!important",
        color: "#727C94!important",
    }),
    control: (base) => ({
        ...base,
        border: "0 !important",
        boxShadow: "0 !important",
        background: "#F2F7FD",
        color: "#727C94",
    }),
};

const SelectSettings = (props) => {
    const [options, setOptions] = useState([]);

    useEffect(() => {
        setOptions(props.options);
    }, [props.options]);

    const option = (props) => {
        const option = props.options.find((opt) => opt.value === props.value);
        if (option) {
            return option;
        }
        return "-1";
    };

    return (
        <div className="mb-4">
            <label htmlFor="medium" className="mb-1 block text-sm font-bold uppercase text-gray-400">
                {props.label}
            </label>
            {props.readOnly ? (
                <Select
                    required={props.required}
                    styles={style}
                    className="rounded text-grey-400 h-12 w-full text-sm font-medium"
                    name={props.name}
                    options={options}
                    value={option(props)}
                    placeholder="Seleccione la categoría"
                    isDisabled={props.isDisabled}
                />
            ) : (
                <Select
                    required={props.required}
                    styles={style}
                    className="h-8 w-full rounded-xs text-sm"
                    name={props.name}
                    onChange={props.onChange}
                    options={options}
                    isDisabled={props.isDisabled}
                    isLoading={props.isLoading}
                    value={option(props)}
                    placeholder={isEmpty(options) ? "Cargando..." : "Seleccione una opción"}
                    // filterOption={searchOption}
                />
            )}

            {!isEmpty(get(props, "errorCustome")) ? <div className="mt-2 text-right text-xs italic text-red-500">{`* ${props.errorCustome}`}</div> : <div />}

            {!props.readOnly && isFunction(get(props, "getErrorMessage", "")) && !isEmpty(get(props, "getErrorMessage")) ? (
                <div className="mt-2 text-right text-xs italic text-red-500">{`* ${props.getErrorMessage()}`}</div>
            ) : (
                <div />
            )}
        </div>
    );
};

export default SelectSettings;
