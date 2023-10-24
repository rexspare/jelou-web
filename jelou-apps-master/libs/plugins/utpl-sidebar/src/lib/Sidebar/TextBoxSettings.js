import React, { useEffect } from "react";
import get from "lodash/get";
import isFunction from "lodash/isFunction";
import isEmpty from "lodash/isEmpty";

const TextBoxSettings = (props) => {
    const textareaSyle =
        "resize-none w-full h-32 block font-medium bg-gray-10 text-gray-400 text-sm rounded-lg p-2 leading-6 border-transparent focus:border-transparent focus:ring-transparent";
    useEffect(() => {
        if (props.readOnly) {
            document.getElementById(props.id).setAttribute("readOnly", "");
        }
    });

    return (
        <div className="mb-4">
            <label htmlFor="medium" className="mb-1 block text-sm font-bold capitalize text-gray-400">
                {props.label}
            </label>
            <textarea
                id={props.id}
                name={props.name}
                className={textareaSyle}
                onChange={props.onChange || (() => void 0)}
                value={props.value || ""}
            />
            {!props.readOnly && isFunction(get(props, "getErrorMessage", "")) && !isEmpty(props.getErrorMessage()) && (
                <div className="mt-2 text-right text-xs italic text-red-500">{`* ${props.getErrorMessage()}`}</div>
            )}
        </div>
    );
};

export default TextBoxSettings;
