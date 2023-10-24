import React from "react";

import Icon from "./Icon";

const ForwardIcon = (props) => (
    <Icon viewBox="0 0 24 21" className={props.className} width={props.width} height={props.height}>
        <path
            d="M22.5848 10.2907L14.7347 16.5987C14.0145 17.1774 12.9518 16.659 12.9518 15.7289L13.1326 13.1068C13.1326 12.4527 12.5758 11.9342 11.932 12C8.99739 12.3002 6.05011 15.0658 4.03465 17.3578L2.92039 18.6249C2.24903 19.3884 1 18.9083 1 17.8868C2.5 10.5 9.5 7.5 12.4803 6.60767C13.0543 6.55865 13.5 6.08244 13.5 5.5L12.9518 3.11307C12.9518 2.18316 14.0145 1.66474 14.7347 2.24329L22.5848 8.55129C23.1384 8.99611 23.1384 9.84588 22.5848 10.2907Z"
            fill="white"
            stroke={props.stroke}
            strokeWidth="2"
        />
    </Icon>
);

export default ForwardIcon;
