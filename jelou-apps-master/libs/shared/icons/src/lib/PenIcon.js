import React from "react";

import Icon from "./Icon";

const PenIcon = (props) => (
    <Icon viewBox="0 0 24 24" className={props.className} width={props.width} height={props.height} stroke={props.stroke} fill={props.fill}>
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
        />
    </Icon>
);

export default PenIcon;
