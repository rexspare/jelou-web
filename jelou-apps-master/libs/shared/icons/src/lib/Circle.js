import React from "react";

import Icon from "./Icon";

const Circle = (props) => (
    <Icon viewBox="0 0 12 12" className={props.className} width={props.width} height={props.height} fill={props.fill}>
        <circle cx="6" cy="6" r="5.5" stroke="#727C94" strokeOpacity="0.75" />
    </Icon>
);
export default Circle;
