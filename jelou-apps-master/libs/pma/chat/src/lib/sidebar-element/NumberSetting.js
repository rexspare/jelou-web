import React, { useEffect } from "react";
import get from "lodash/get";
import isFunction from "lodash/isFunction";
import isEmpty from "lodash/isEmpty";

// const inputStyle = "h-8 w-full font-medium text-gray-450 text-sm";

const SidebarElement = (props) => {
    const { cursorAllowed = true } = props;
    const error = props.getErrorMessage();

    useEffect(() => {
        if (props.readOnly) {
            document.getElementById(props.id).setAttribute("readOnly", "");
        }
    });

    const inputStyle = `h-8 w-full px-3 font-medium bg-gray-10 text-gray-400 text-sm rounded-lg border-transparent focus:border-transparent focus:ring-transparent ${
        cursorAllowed ? "" : "cursor-not-allowed"
    }`;

    return (
        <div className="mb-4">
            <label htmlFor="medium" className="mb-1 block text-sm font-bold uppercase text-gray-400">
                {props.label}
            </label>
            <input
                type="number"
                id={props.id}
                name={props.name}
                autoComplete="off"
                className={inputStyle}
                onChange={props.onChange || (() => void 0)}
                disabled={cursorAllowed ? false : true}
                value={props.value || ""}
            />
            {isFunction(get(props, "getErrorMessage", false)) && !isEmpty(error) && (
                <div className="mt-2 text-right text-xs italic text-red-500">{`* ${props.getErrorMessage()}`}</div>
            )}
        </div>
    );
};

export default SidebarElement;
