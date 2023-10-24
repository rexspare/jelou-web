import React from "react";

import Icon from "./Icon";

const LabelIcon = (props) => (
    <Icon viewBox="0 0 100 100" fill={props.fill} className={props.className} width={props.width} height={props.height}>
        <path
            d="M85.68,43.01l-0.29-0.39c-1.52-2.06-3.03-4.12-4.54-6.19c-2.15-2.94-4.3-5.88-6.48-8.81c-2.26-3.04-5.3-4.59-9.04-4.59
	c-12.92-0.02-25.83-0.01-38.75-0.01H19.1c-3.43,0-5.89,1.79-6.74,4.9c-0.16,0.58-0.24,1.25-0.24,2.02
	c-0.01,13.09-0.01,26.18-0.01,39.28c0,4.13,2.78,6.92,6.92,6.92h1.32c7.4,0,14.81,0.01,22.21,0.01c7.61,0,15.23,0,22.84-0.02
	c3.63,0,6.7-1.55,8.87-4.48c2.69-3.61,5.35-7.25,8.01-10.88c1.53-2.08,3.05-4.17,4.58-6.25c0.89-1.21,1.31-2.6,1.61-3.8l0.01-2.18
	l0.01-0.07C88.13,46.3,86.88,44.63,85.68,43.01z"
        />
    </Icon>
);

export default LabelIcon;
