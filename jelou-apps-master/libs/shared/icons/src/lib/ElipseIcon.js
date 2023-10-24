import React from "react";
import Icon from "./Icon";

const ElipseIcon = (props) => (
    <Icon viewBox="0 0 12 12" className={props.className} width={props.width} height={props.height}>
        <circle cx="6" cy="6" r="6" fill={props.fill} />
    </Icon>
);

export default ElipseIcon;
