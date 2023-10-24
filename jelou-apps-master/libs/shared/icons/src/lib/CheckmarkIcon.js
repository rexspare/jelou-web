import React from "react";

import Icon from "./Icon";

const CheckmarkIcon = (props) => (
    <Icon viewBox="0 0 632 376" className={props.className} width={props.width} height={props.height} fill={props.fill}>
        <path
            d="M504.502,75.496c-9.997-9.998-26.205-9.998-36.204,0L161.594,382.203L43.702,264.311c-9.997-9.998-26.205-9.997-36.204,0
			c-9.998,9.997-9.998,26.205,0,36.203l135.994,135.992c9.994,9.997,26.214,9.99,36.204,0L504.502,111.7
			C514.5,101.703,514.499,85.494,504.502,75.496z"
            fill={props.fill ? props.fill : "#727C94"}
        />
    </Icon>
);

export default CheckmarkIcon;
