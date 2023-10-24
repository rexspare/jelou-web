import React from "react";
import Icon from "./Icon";

const EmojiHappy = (props) => (
    <Icon viewBox="0 0 24 24" className={props.className} width={props.width} height={props.height}>
        <path
            d="M9.17157 14.8284C10.7337 16.3905 13.2663 16.3905 14.8284 14.8284M15 10H14.99M9 10H8.99M3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12Z"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Icon>
);

export default EmojiHappy;
