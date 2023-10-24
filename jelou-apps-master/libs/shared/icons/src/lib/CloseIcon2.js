import React from "react";

import Icon from "./Icon";

const CloseIcon2 = (props) => (
    <Icon fill="none" viewBox="0 0 16 16" className={props.className} width={props.width || 14} height={props.height || 14}>
        <path
            d="m.276 11.074 2.258 2.258L6.81 9.056l4.252 4.252 2.258-2.258-4.253-4.252 4.265-4.264L11.074.276 6.81 4.54 2.534.264.276 2.522l4.276 4.276-4.276 4.276Z"
            fill={props.fill ?? "#727C94"}
            fillOpacity={props.fillOpacity ?? "0.25"}
        />
    </Icon>
);

export default CloseIcon2;
