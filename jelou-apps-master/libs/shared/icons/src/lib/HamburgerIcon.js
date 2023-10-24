import React from "react";
import Icon from "./Icon";

const HamburgerIcon = (props) => (
    <Icon
        viewBox="0 0 47 34"
        className={props.className}
        width={props.width}
        height={props.height}
        strokeWidth={props.strokeWidth}
        fill={props.fill}
        stroke={props.stroke}>
        <rect x="1" width="2.875rem" height="0.313rem" rx="2.5" fill="#A6B4D0" fillOpacity="0.5" />
        <rect x="1" y="15" width="2.875rem" height="0.313rem" rx="2.5" fill="#A6B4D0" fillOpacity="0.5" />
        <rect y="29" width="2.875rem" height="0.313rem" rx="2.5" fill="#A6B4D0" fillOpacity="0.5" />
    </Icon>
);

export default HamburgerIcon;
