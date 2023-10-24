import React from "react";
// import Select from "react-select";
import get from "lodash/get";
import { withTranslation } from "react-i18next";
import { Select } from "@apps/pma/ui-shared";

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

const option = (props) => {
    const option = props.options.find((opt) => opt.value === props.value);

    if (option) {
        return option;
    }
    return "-1";
};

const selectSettings = (props) => {
    const { t } = props;

    return (
        <div className="mb-4">
            <label htmlFor="medium" className="mb-1 block rounded-10 text-sm font-bold capitalize text-gray-400">
                {props.label}
            </label>
            {props.readOnly ? (
                <Select
                    styles={style}
                    className="h-8 w-full rounded-10 bg-gray-10 text-sm font-normal"
                    name={props.name}
                    isDisabled={true}
                    options={props.options}
                    value={option(props)}
                    placeholder={t("pma.Seleccione el estado")}
                />
            ) : (
                <Select
                    styles={style}
                    className="h-8 w-full rounded-10 bg-gray-10 text-sm font-normal"
                    name={props.name}
                    onChange={(e) => props.onChange(e, props.name)}
                    options={props.options}
                    value={option(props)}
                    placeholder={t("pma.Seleccione el estado")}
                />
            )}
            {get(props, "getErrorMessage") && <div className="mt-2 text-right text-xs italic text-red-500">{props.getErrorMessage()}</div>}
        </div>
    );
};

export default withTranslation()(selectSettings);
