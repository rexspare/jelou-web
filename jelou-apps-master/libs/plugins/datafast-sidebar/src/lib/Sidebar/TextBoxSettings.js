import React, { useEffect } from "react";
import get from "lodash/get";
import isFunction from "lodash/isFunction";
import isEmpty from "lodash/isEmpty";

const textareaSyle = "resize-none w-full h-32 block text-gray-400 font-medium text-sm leading-6 rounded-xs bg-gray-10 border-none";

const TextBoxSettings = (props) => {
    useEffect(() => {
        if (props.readOnly) {
            document.getElementById(props.id).setAttribute("readOnly", "");
        }
    });

    return (
        <div className="mb-4">
            <label htmlFor="medium" className="mb-1 block text-sm font-bold uppercase text-gray-400">
                {props.label}
            </label>
            <textarea
                id={props.id}
                name={props.name}
                className={textareaSyle}
                onChange={props.onChange || (() => void 0)}
                value={props.value || ""}
            />
            {!isEmpty(get(props, "errorCustome")) ? (
                <div className="mt-2 text-right text-xs italic text-red-500">{`* ${props.errorCustome}`}</div>
            ) : (
                <div />
            )}

            {!props.readOnly && isFunction(get(props, "getErrorMessage", "")) && !isEmpty(props.getErrorMessage()) && (
                <div className="mt-2 text-right text-xs italic text-red-500">{`* ${props.getErrorMessage()}`}</div>
            )}
        </div>
    );
};

export default TextBoxSettings;
