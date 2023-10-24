import React from "react";

import Icon from "./Icon";

const MoreIcon = (props) => (
    <Icon viewBox="0 0 24 24" className={props.className} width={props.width || "1.5rem"} height={props.height || "1.5rem"}>
        <g filter="url(#filter0_dd)">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M19 11H13V5C13 4.447 12.552 4 12 4C11.448 4 11 4.447 11 5V11H5C4.448 11 4 11.447 4 12C4 12.553 4.448 13 5 13H11V19C11 19.553 11.448 20 12 20C12.552 20 13 19.553 13 19V13H19C19.552 13 20 12.553 20 12C20 11.447 19.552 11 19 11Z"
                fill={props.fill}
                fillOpacity={props.fillOpacity}
            />
            <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="4" y="4" width="16" height="16">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M19 11H13V5C13 4.447 12.552 4 12 4C11.448 4 11 4.447 11 5V11H5C4.448 11 4 11.447 4 12C4 12.553 4.448 13 5 13H11V19C11 19.553 11.448 20 12 20C12.552 20 13 19.553 13 19V13H19C19.552 13 20 12.553 20 12C20 11.447 19.552 11 19 11Z"
                    fill={props.fill}
                    fillOpacity={props.fillOpacity}
                />
            </mask>
            <g mask="url(#mask0)">
                <g filter="url(#filter1_dd)">
                    <rect width="24" height="24" fill={props.fill} fillOpacity={props.fillOpacity} />
                </g>
            </g>
        </g>
        <defs>
            <filter id="filter0_dd" x="-2" y="-1" width="28" height="28" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dy="1" />
                <feGaussianBlur stdDeviation="0.5" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dy="1" />
                <feGaussianBlur stdDeviation="1" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0" />
                <feBlend mode="normal" in2="effect1_dropShadow" result="effect2_dropShadow" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow" result="shape" />
            </filter>
            <filter id="filter1_dd" x="-2" y="-1" width="28" height="28" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dy="1" />
                <feGaussianBlur stdDeviation="0.5" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dy="1" />
                <feGaussianBlur stdDeviation="1" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0" />
                <feBlend mode="normal" in2="effect1_dropShadow" result="effect2_dropShadow" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow" result="shape" />
            </filter>
        </defs>
    </Icon>
);

export default MoreIcon;
