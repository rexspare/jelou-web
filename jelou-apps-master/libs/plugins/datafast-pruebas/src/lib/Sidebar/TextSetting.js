import React, { useEffect, useRef, useState } from "react";
import get from "lodash/get";
import isFunction from "lodash/isFunction";
import isEmpty from "lodash/isEmpty";

const inputStyle = "h-8 w-full font-medium bg-gray-10 rounded-xs text-grey-dark text-sm border-none";

const TextSetting = (props) => {
    const textRef = useRef(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (props.readOnly) {
            document.getElementById(props.id).setAttribute("readOnly", "");
        }
    });
    const copyToClipboard = (e) => {
        if (props.readOnly && !isEmpty(props.value)) {
            textRef.current.select();
            document.execCommand("copy");
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 1000);
        }
    };
    return (
        <div className="mb-4">
            <label htmlFor="medium" className="mb-1 block text-sm font-bold uppercase text-gray-400">
                {props.label}
            </label>
            <input
                type="text"
                id={props.id}
                name={props.name}
                className={`${inputStyle} ${props.readOnly && "cursor-pointer"}`}
                onChange={props.onChange || (() => void 0)}
                onClick={copyToClipboard}
                value={props.value || ""}
                ref={textRef}
            />
            {copied && <div className="mt-2 text-right text-xs font-medium text-gray-400">{props.label} copiado al portapapeles</div>}
            {!props.readOnly && isFunction(get(props, "getErrorMessage", "")) && !isEmpty(props.getErrorMessage()) && (
                <div className="mt-2 text-right text-xs italic text-red-500">{`* ${props.getErrorMessage()}`}</div>
            )}
        </div>
    );
};

export default TextSetting;
