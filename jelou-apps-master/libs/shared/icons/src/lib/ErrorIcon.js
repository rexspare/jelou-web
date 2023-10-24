import React from "react";
import Icon from "./Icon";

const ErrorIcon = ({ width = 15, height = 15, stroke = "#D6806F" } = {}) => {
    return (
        <Icon viewBox="0 0 15 15" width={width} height={height} fill="none">
            <path
                d="M6.496 1.55 1.27 10.278a1.234 1.234 0 0 0 1.055 1.852H12.78a1.233 1.233 0 0 0 1.055-1.852L8.607 1.551a1.234 1.234 0 0 0-2.11 0v0ZM7.552 4.723V7.19M7.552 9.66h.007"
                stroke={stroke}
                strokeWidth={1.4}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Icon>
    );
};
export default ErrorIcon;
