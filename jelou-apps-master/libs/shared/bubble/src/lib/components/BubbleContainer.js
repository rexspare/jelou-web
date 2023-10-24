import React from "react";
import Tippy from "@tippyjs/react";
import toUpper from "lodash/toUpper";
import { ErrorIcon } from "@apps/shared/icons";

const BubbleContainer = (props) => {
    const { bubbleSide, children, repliesTo, textError } = props;
    const containerStyle = `${toUpper(props.type) === "STICKER" ? "" : "max-w-xxs mid:max-w-md xxl:max-w-md"} relative flex flex-col items-stretch ${
        bubbleSide === "right" ? "text-right" : bubbleSide === "right-bot" ? "text-right" : "text-left"
    }`;

    const style = {};

    if (repliesTo) {
        style.backgroundColor = bubbleSide === "right" ? "#E7F6F8" : "#F2F7FD";
        style.padding = "0 0 0.5rem 0";
        style.borderRadius = bubbleSide === "right" ? "0.625rem 0.625rem 0rem 0.625rem" : "0.625rem 0.625rem 0.625rem 0rem";
        style.textAlign = "left";
    }

    return (
        <>
            {bubbleSide === "right" && textError && (
                <div className="mr-2 flex items-center justify-center">
                    <Tippy content={textError} arrow={false} placement={"top"} theme="jelou" touch={false}>
                        <div>
                            <ErrorIcon stroke="#c53030" strokeWidth="5" width="20" height="20" />
                        </div>
                    </Tippy>
                </div>
            )}
            <div className={containerStyle} style={style} onMouseOver={props.setHover} onMouseLeave={props.setHoverFalse}>
                {children}
            </div>
        </>
    );
};

export default BubbleContainer;
