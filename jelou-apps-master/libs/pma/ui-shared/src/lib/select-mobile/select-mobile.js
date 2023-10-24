import React from "react";
import { DownIcon } from "@apps/shared/icons";

const SelectMobile = (props) => {
    return (
        <div className={`relative block h-9 cursor-pointer sm:hidden`}>
            <div className="absolute mt-1 w-full rounded-md bg-white">
                <select
                    className="input-mobile"
                    value={props.value}
                    defaultValue={props.defaultValue}
                    onChange={props.onChange}
                    name={props.name}
                    disabled={props.disabled || false}>
                    {props.placeholder && (
                        <option key="-1" value="-1" disabled>
                            {props.placeholder}
                        </option>
                    )}
                    {props.options.map((option, index) => (
                        <option key={index} value={option[props.getId] || option.id || option.value} name={option.name}>
                            {option[props.getName] || option.name || option.label}
                        </option>
                    ))}
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
                    <DownIcon className={`text-primary fill-current`} width="1.25rem" height="1.25rem" />
                </span>
            </div>
        </div>
    );
};

export default SelectMobile;
