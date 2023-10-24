import React from "react";

const O = (props) => {
    return (
        <svg
            width="750"
            height="350"
            viewBox="0 0 867 456"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={props.className}
            style={props.style}
        >
            <circle cx="433.5" cy="433.5" r="433.5" fill="white" />
            <circle cx="433.5" cy="433.5" r="431" stroke="#00B3C7" strokeOpacity="0.1" strokeWidth="5" />
        </svg>
    );
};

export default O;
