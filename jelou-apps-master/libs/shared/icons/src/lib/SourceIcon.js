import React from "react";
import Icon from "./Icon";

export default function SourceIcon(props) {
    return (
        <Icon viewBox="0 0 32 32" fill="none" className={props.className} width={props.width || 32} height={props.height || 32} stroke={props.stroke}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M21.3335 5.33325V21.3333L16.0002 18.6666L10.6668 21.3333V5.33325M8.00016 26.6666H24.0002C25.4729 26.6666 26.6668 25.4727 26.6668 23.9999V7.99992C26.6668 6.52716 25.4729 5.33325 24.0002 5.33325H8.00016C6.5274 5.33325 5.3335 6.52716 5.3335 7.99992V23.9999C5.3335 25.4727 6.5274 26.6666 8.00016 26.6666Z"
                    stroke="#00B3C7"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </Icon>
    );
}
