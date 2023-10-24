import React from "react";
import Icon from "./Icon";

const RefreshIcon = (props) => {
    return (
        <Icon viewBox="0 0 23 24" className={props.className} width={props.width} height={props.height} fill="none" stroke={props.stroke}>
            <path
              stroke={props.fill ? props.fill : "#707C97"}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M1.333 1.333V8h.776m20.475 2.667C21.928 5.405 17.44 1.333 12 1.333A10.67 10.67 0 0 0 2.109 8m0 0H8m14.667 14.667V16h-.776m0 0A10.67 10.67 0 0 1 12 22.667c-5.44 0-9.928-4.072-10.584-9.334M21.89 16H16"
            />
    </Icon>
    );
};
export default RefreshIcon;
