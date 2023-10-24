import React, { useEffect } from "react";
import get from "lodash/get";
import isFunction from "lodash/isFunction";
import isEmpty from "lodash/isEmpty";

const SidebarElement = (props) => {
    const { cursorAllowed = true } = props;

    useEffect(() => {
        if (props.readOnly) {
            document.getElementById(props.id).setAttribute("readOnly", "");
        }
    });

    const inputStyle = "h-8 w-full font-medium bg-gray-10 text-gray-400 text-sm appearance-none rounded-xs bg-white border-0";

    return (
        <div className="mb-4">
            <label htmlFor="medium" className="mb-1 block text-sm font-bold capitalize text-gray-400">
                {props.label}
            </label>
            <input
                type="date"
                id={props.id}
                name={props.name}
                className={inputStyle}
                onChange={props.onChange || (() => void 0)}
                disabled={cursorAllowed ? false : true}
                value={props.value || ""}
            />
            {isFunction(get(props, "getErrorMessage", false)) && !isEmpty(props.getErrorMessage()) && (
                <div className="mt-2 text-right text-xs italic text-red-500">{`* ${props.getErrorMessage()}`}</div>
            )}
        </div>
    );
};

export default SidebarElement;

// value={storeParams.observations} onChange={handleChange}
