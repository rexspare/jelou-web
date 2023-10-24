import React, { useEffect } from "react";
import get from "lodash/get";
import isFunction from "lodash/isFunction";
import isEmpty from "lodash/isEmpty";

const inputStyle = "h-8 w-full border-b border-grey-lightest font-light text-gray-400";

const EmailSetting = (props) => {
    useEffect(() => {
        if (props.readOnly) {
            document.getElementById(props.id).setAttribute("readOnly", "");
        }
    });

    return (
        <div className="mb-4">
            <label htmlFor="medium" className="mb-1 block text-xs font-bold uppercase text-gray-400">
                {props.label}
            </label>
            <input
                type="text"
                id={props.id}
                name={props.name}
                className={inputStyle}
                onChange={props.onChange || (() => void 0)}
                value={props.value || ""}
            />
            {!props.readOnly &&
                (isFunction(get(props, "getErrorMessage", "")) && !isEmpty(props.getErrorMessage()) ? (
                    <div className="mt-2 text-right text-xs italic text-red-500">{`* ${props.getErrorMessage()}`}</div>
                ) : (
                    <div />
                ))}
        </div>
    );
};

export default EmailSetting;
