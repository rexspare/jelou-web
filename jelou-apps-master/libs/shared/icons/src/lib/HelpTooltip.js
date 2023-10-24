import React from "react";
import Tippy from "@tippyjs/react";

const HelpTooltip = (props) => {
    const { message } = props;
    return (
        <Tippy content={message} placement="bottom-start" theme="light">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" className="mr-1 h-5 w-5 text-gray-400" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </Tippy>
    );
};

export default HelpTooltip;
