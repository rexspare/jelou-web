import React from "react";

const Icon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        strokeLinecap="round"
        strokeLinejoin="round"
        height={props.height}
        width={props.width}
        viewBox={props.viewBox}
        className={props.className}
        strokeWidth={props.strokeWidth}
        fill={props.fill}
        stroke={props.stroke}
        style={props.style}
    >
        {props.children}
    </svg>
);

export default Icon;
