import React from "react";

import Icon from "./Icon";

const SendIconInCircle = (props) => (
    <Icon viewBox="0 0 30 30" className={props.className} width={props.width || 30} height={props.height || 30} fill={props.fill}>
        <g clipPath="url(#clip0_169_26734)">
            <rect width={props.width || 30} height={props.height || 30} rx="15" fill={props.fill || "#00B3C7"} />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M22.498 8.12903C22.4859 7.97253 22.42 7.8194 22.3003 7.6997C22.105 7.50439 21.8207 7.45234 21.5779 7.54356L7.95658 12.311C7.69272 12.4034 7.51197 12.6474 7.50057 12.9268C7.48917 13.2061 7.64945 13.4641 7.90491 13.5776L13.8016 16.1984L16.4224 22.0951C16.5359 22.3506 16.7939 22.5108 17.0733 22.4995C17.3526 22.4881 17.5966 22.3073 17.689 22.0434L22.4569 8.42084C22.4919 8.32722 22.5056 8.22746 22.498 8.12903ZM19.2234 9.8124L10.0303 13.03L14.1672 14.8686L19.2234 9.8124ZM15.1314 15.8328L20.1876 10.7766L16.97 19.9697L15.1314 15.8328Z"
                fill={props.stroke || "white"}
            />
        </g>
        <defs>
            <clipPath id="clip0_169_26734">
                <rect width={props.width || 30} height={props.height || 30} rx="15" fill={props.stroke || "white"} />
            </clipPath>
        </defs>
    </Icon>
);

export default SendIconInCircle;
