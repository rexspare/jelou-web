import React from "react";

import Icon from "./Icon";

const DocumentIcon = (props) => (
    <Icon viewBox="0 0 24 24" className={props.className} width={props.width} height={props.height}>
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M17.4445 20H6.55549C6.24949 20 6.00049 19.776 6.00049 19.5V4.5C6.00049 4.224 6.24949 4 6.55549 4H11.0005V8.15C11.0005 9.722 12.2175 11 13.7145 11H18.0005V19.5C18.0005 19.776 17.7505 20 17.4445 20ZM17.6495 9H13.7145C13.3205 9 13.0005 8.619 13.0005 8.15V4H13.1125L17.6495 9ZM19.7405 8.328L14.2965 2.328C14.1075 2.119 13.8385 2 13.5555 2H6.55549C5.14649 2 4.00049 3.122 4.00049 4.5V19.5C4.00049 20.878 5.14649 22 6.55549 22H17.4445C18.8535 22 20.0005 20.878 20.0005 19.5V9C20.0005 8.751 19.9075 8.512 19.7405 8.328Z"
            fill="fillCurrent"
        />
    </Icon>
);

export default DocumentIcon;
