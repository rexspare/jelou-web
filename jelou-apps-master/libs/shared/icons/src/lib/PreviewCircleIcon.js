import React from "react";
import Icon from "./Icon";

const PreviewCircleIcon = (props) => (
    <Icon viewBox="0 0 32 32" className={props.className} width={props.width} height={props.height} fill="none">
        <path
            stroke="#00B3C7"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="m19.67 15.39-4.264-2.841a1.333 1.333 0 0 0-2.073 1.109v5.684c0 1.065 1.187 1.7 2.073 1.11l4.263-2.843a1.333 1.333 0 0 0 0-2.218Z"
        />
        <path
            stroke="#00B3C7"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M28 16.5c0 6.627-5.373 12-12 12s-12-5.373-12-12 5.373-12 12-12 12 5.373 12 12Z"
        />
    </Icon>
);

export default PreviewCircleIcon;
