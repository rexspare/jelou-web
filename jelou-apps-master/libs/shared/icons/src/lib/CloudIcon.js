import React from "react";

import Icon from "./Icon";

const CloudIcon = (props) => (
    <Icon fill="none" viewBox="0 0 64 64" className={props.className} width={props.width || "64"} height={props.height || "64"}>
        <g clipPath="url(#clip0_3205_68051)">
            <path
                d="M48 26.6666H44.64C43.6423 22.8026 41.5808 19.2959 38.6897 16.545C35.7986 13.7941 32.1939 11.9093 28.2851 11.1047C24.3764 10.3001 20.3203 10.6081 16.5778 11.9935C12.8352 13.379 9.55638 15.7865 7.11375 18.9423C4.67111 22.0982 3.16265 25.8759 2.75976 29.8462C2.35687 33.8166 3.07572 37.8203 4.83461 41.4025C6.59351 44.9847 9.32192 48.0018 12.7098 50.1108C16.0977 52.2198 20.0093 53.3363 24 53.3333H48C51.5362 53.3333 54.9276 51.9285 57.4281 49.4281C59.9286 46.9276 61.3333 43.5362 61.3333 40C61.3333 36.4637 59.9286 33.0724 57.4281 30.5719C54.9276 28.0714 51.5362 26.6666 48 26.6666Z"
                stroke="#374361"
                strokeWidth="5.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </g>
        <defs>
            <clipPath id="clip0_3205_68051">
                <rect width="64" height="64" fill="white" />
            </clipPath>
        </defs>
    </Icon>
);

export default CloudIcon;
