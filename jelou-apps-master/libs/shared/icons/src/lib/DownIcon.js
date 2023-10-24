import React from "react";

import Icon from "./Icon";

const DownIcon = (props) => (
    <Icon
        viewBox="0 0 20 20"
        className={props.className}
        width={props.width || "1.25rem"}
        height={props.height || "1.25rem"}
        stroke={props.stroke}
        fill={props.fill}>
        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
    </Icon>
);

export default DownIcon;
