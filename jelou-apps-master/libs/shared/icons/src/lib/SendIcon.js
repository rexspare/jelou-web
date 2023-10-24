import React from "react";

import Icon from "./Icon";

const SendIcon = (props) => (
    <Icon viewBox="0 0 21 21" className={props.className} width={props.width} height={props.height}>
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.3893 18.3333C12.3718 18.3333 12.3552 18.3325 12.3385 18.3317C11.9618 18.3092 11.6477 18.0358 11.5727 17.6658L10.291 11.36C10.2243 11.0317 9.96849 10.7758 9.64016 10.7092L3.33433 9.42666C2.96433 9.3525 2.69099 9.03833 2.66849 8.66166C2.64599 8.28416 2.87849 7.93916 3.23683 7.82083L16.5702 3.37666C16.8693 3.275 17.1993 3.35333 17.4227 3.5775C17.646 3.80083 17.7235 4.13083 17.6243 4.43L13.1793 17.7633C13.066 18.1058 12.746 18.3333 12.3893 18.3333Z"
            fill={props.fill || "#ffff"}
        />
    </Icon>
);

export default SendIcon;
