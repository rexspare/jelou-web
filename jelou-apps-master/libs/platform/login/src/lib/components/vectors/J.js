import React from "react";

const J = (props) => (
    <Icon viewBox="0 0 306 552" className={props.className} width={props.width} height={props.height} style={props.style}>
        <path
            d="M-153.108 551.884C100.07 551.884 306 345.062 306 90.1009V-341.372H65.3023V89.2095C65.3023 148.938 43.0156 201.535 1.11633 243.434C-41.6744 286.225 -96.0542 309.403 -153.108 309.403C-211.054 309.403 -268.109 285.334 -310.008 243.434C-344.775 208.667 -366.171 164.093 -372.411 115.062H-614C-599.736 356.651 -395.589 551.884 -153.108 551.884Z"
            fill="rgba(249,251,254)"
        />
    </Icon>
);

const Icon = (props) => (
    <div className="flex flex-col items-center">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            height={props.height}
            width={props.width}
            viewBox={props.viewBox}
            className={props.className}
            fill={props.fill}
            stroke={props.stroke}>
            {props.children}
        </svg>
    </div>
);

export default J;
