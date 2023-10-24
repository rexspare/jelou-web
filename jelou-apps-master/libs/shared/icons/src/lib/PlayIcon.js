import React from "react";

import Icon from "./Icon";

const PlayIcon = (props) => (
    <Icon viewBox="0 0 42 42" className={props.className} width={props.width} height={props.height}>
        <path
            d="M20.583 41.166C31.9507 41.166 41.166 31.9507 41.166 20.583C41.166 9.21532 31.9507 0 20.583 0C9.21532 0 0 9.21532 0 20.583C0 31.9507 9.21532 41.166 20.583 41.166Z"
            fill={props.fill}
        />
        <path
            d="M30.0931 19.7588L16.2342 11.7572C15.6001 11.3907 14.807 11.8485 14.807 12.5815V28.5847C14.807 29.3169 15.6001 29.7754 16.2342 29.4089L30.0931 21.4073C30.728 21.0408 30.728 20.1253 30.0931 19.7588Z"
            fill="#E7F6F8"
        />
    </Icon>
);

export default PlayIcon;
