import React, { useState, useEffect } from "react";
import Select from "../Common/Select";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";

const style = {
    valueContainer: (base) => ({
        ...base,
        paddingLeft: 0,
        paddingRight: 0,
    }),
    singleValue: (base) => ({
        fontSize: "14px!important",
        fontWeight: "500!important",
        color: "#7E819F!important",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    }),
    control: (base, state) => ({
        ...base,
        borderTop: "0 !important",
        borderLeft: "0 !important",
        borderRight: "0 !important",
        borderBottom: "1px solid #E0E4EC",
        boxShadow: "0 !important",
        borderRadius: "0 !important",
        "&:hover": {
            borderTop: "0 !important",
            borderLeft: "0 !important",
            borderRight: "0 !important",
            borderBottom: "1px solid #E0E4EC",
        },
    }),
};

const selectSettings = (props) => {
    const { selectValues, rules } = props;
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

            {!props.readOnly && rules.isObligatory && isEmpty(get(selectValues, props.name, "")) && (
                <div className="mt-2 text-right text-xs italic text-red-500">* Debes seleccionar una {props.label} </div>
            )}
        </div>
    );
};

export default selectSettings;
