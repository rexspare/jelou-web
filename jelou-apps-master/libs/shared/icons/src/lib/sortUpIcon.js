import React from "react";

import Icon from "./Icon";

const SortUpIcon = (props) => (
    <Icon viewBox="0 0 512 512" className={props.className} width={props.width} height={props.height} stroke={props.stroke} fill={props.fill}>
        <path
            d="M374.176,110.386l-104-104.504c-0.006-0.006-0.013-0.011-0.019-0.018c-7.818-7.832-20.522-7.807-28.314,0.002
			c-0.006,0.006-0.013,0.011-0.019,0.018l-104,104.504c-7.791,7.829-7.762,20.493,0.068,28.285
			c7.829,7.792,20.492,7.762,28.284-0.067L236,68.442V492c0,11.046,8.954,20,20,20c11.046,0,20-8.954,20-20V68.442l69.824,70.162
			c7.792,7.829,20.455,7.859,28.284,0.067C381.939,130.878,381.966,118.214,374.176,110.386z"
        />
    </Icon>
);

export default SortUpIcon;
