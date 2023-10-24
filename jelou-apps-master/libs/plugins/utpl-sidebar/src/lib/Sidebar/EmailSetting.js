import React, { useEffect } from "react";
import get from "lodash/get";
import isFunction from "lodash/isFunction";
import isEmpty from "lodash/isEmpty";

const EmailSetting = (props) => {
    useEffect(() => {
        if (props.readOnly) {
            document.getElementById(props.id).setAttribute("readOnly", "");
        }
    });

    const inputStyle = `h-8 w-full px-3 font-medium bg-gray-10 text-gray-400 text-sm rounded-lg border-transparent focus:border-transparent focus:ring-transparent`;

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
