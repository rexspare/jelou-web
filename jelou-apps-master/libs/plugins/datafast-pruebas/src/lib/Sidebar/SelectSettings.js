import React, { useState, useEffect } from "react";
import Select from "../Common/Select";
import get from "lodash/get";
import isFunction from "lodash/isFunction";
import isEmpty from "lodash/isEmpty";

const style = {
    valueContainer: (base) => ({
        ...base,
        paddingLeft: "2px!important",
        paddingRight: 0,
    }),
    singleValue: (base) => ({
        fontSize: "13px!important",
        fontWeight: "500!important",
        color: "#727C94!important",
    }),
    control: (base, state) => ({
        ...base,
        border: "0 !important",
        boxShadow: "0 !important",
        background: "#F2F7FD",
        color: "#727C94",
    }),
};

const selectSettings = (props) => {
    const [options, setOptions] = useState([]);

    const option = (props) => {
        useEffect(() => {
            setOptions(props.options);
        }, [props.options]);

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
                    styles={style}
                    className="h-8 w-full rounded-xs text-sm font-medium text-gray-400"
                    name={props.name}
                    isDisabled
                    options={options}
                    value={option(props)}
                    placeholder="Seleccione la categoría"
                />
            ) : (
                <Select
                    styles={style}
                    className="h-8 w-full rounded-xs text-sm"
                    name={props.name}
                    onChange={props.onChange}
                    options={options}
                    isLoading={props.isLoading}
                    value={option(props)}
                    placeholder={isEmpty(options) ? "Cargando..." : "Seleccione una opción"}
                    // filterOption={searchOption}
                />
            )}

            {!isEmpty(get(props, "errorCustome")) ? (
                <div className="mt-2 text-right text-xs italic text-red-500">{`* ${props.errorCustome}`}</div>
            ) : (
                <div />
            )}

            {!props.readOnly && isFunction(get(props, "getErrorMessage", "")) && !isEmpty(get(props, "getErrorMessage")) ? (
                <div className="mt-2 text-right text-xs italic text-red-500">{`* ${props.getErrorMessage()}`}</div>
            ) : (
                <div />
            )}
        </div>
    );
};

export default selectSettings;
