/** Applies a conditional truncate and tooltip to a span or div element */

import { useState, useEffect } from "react";
import { default as Tippy } from "@tippyjs/react";

const ConditionalTruncateTippy = (props) => {
    const {
        text,
        charactersLimit = 0,
        textStyle = "",
        componentType = "span",
        placement = "auto",
        width = "",
        actionClick = null,
    } = props;
    const [shouldApplyTippy, setShouldApplyTippy] = useState(false);

    useEffect (() => {
        setShouldApplyTippy(text && text.length > charactersLimit);
    }, [text]);

    if (shouldApplyTippy) {
        return (
            <Tippy
                theme="light"
                placement={placement}
                touch={false}
                trigger="mouseenter"
                content={<span className="font-bold text-gray-400">{text}</span>}>
                {componentType === "span" ? (
                    <span
                        onClick={actionClick}
                        className={`overflow-hidden truncate ${actionClick && "cursor-pointer"} ${textStyle} ${width ?? "w-32"}`}>
                        {text}
                    </span>
                ) : (
                    <div onClick={actionClick}
                        className={`overflow-hidden truncate ${actionClick && "cursor-pointer"} ${textStyle} ${width ?? "w-32"} `}>
                        {text}
                    </div>
                )}
            </Tippy>
        );
    } else {
        return (
            <span onClick={actionClick} className={`${actionClick && "cursor-pointer"} ${textStyle}`}>
                {text}
            </span>
        );
    }
};

export default ConditionalTruncateTippy;
