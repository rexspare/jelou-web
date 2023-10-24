import React from "react";
import Icon from "./Icon";

const ViewIcon = (props) => (
    <Icon viewBox="0 0 24 24" fill="none" className={props.className} width={props.width} stroke="currentColor" height={props.height}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
    </Icon>
);

export default ViewIcon;
