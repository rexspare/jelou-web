import * as React from "react";
const AlertCircleYellow = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
        <path
            stroke={props.stroke ? props.stroke : "#987001"}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10ZM12 8v4M12 16h.01"
        />
    </svg>
);
export default AlertCircleYellow;