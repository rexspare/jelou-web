import React from "react";

import Icon from "./Icon";

const IncreaseIcon = (props) => (
    <Icon viewBox="0 0 20 12" className={props.className} width={props.width} height={props.height}>
        <path d="M2 3a1 1 0 0 0-2 0v8a1 1 0 0 0 1 1h8a1 1 0 0 0 0-2H3.414L9 4.414l3.293 3.293a1 1 0 0 0 1.414 0l6-6A1 1 0 0 0 18.293.293L13 5.586 9.707 2.293a1 1 0 0 0-1.414 0L2 8.586V3z"></path>
    </Icon>
);

export default IncreaseIcon;
