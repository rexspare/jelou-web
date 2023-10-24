import React from 'react';

import Icon from './Icon';

const GridViewIcon = (props) => (
  <Icon
    viewBox="0 0 40 40"
    className={props.className}
    width={props.width}
    height={props.height}
    stroke={props.stroke}
    fill={'none'}
  >
    <path
      d="M0 7C0 3.13401 3.13401 0 7 0H40V40H7C3.13401 40 0 36.866 0 33V7Z"
      fill={props.selected ? 'rgba(0, 179, 199, 0.65)' : 'white'}
    />
    <rect
      x="9.75"
      y="9.75"
      width="7.3"
      height="7.3"
      rx="1.25"
      stroke={props.selected ? 'white' : 'rgba(114, 124, 148, 0.25)'}
      strokeWidth="1.5"
    />
    <rect
      x="9.75"
      y="22.95"
      width="7.3"
      height="7.3"
      rx="1.25"
      stroke={props.selected ? 'white' : 'rgba(114, 124, 148, 0.25)'}
      strokeWidth="1.5"
    />
    <rect
      x="22.95"
      y="9.75"
      width="7.3"
      height="7.3"
      rx="1.25"
      stroke={props.selected ? 'white' : 'rgba(114, 124, 148, 0.25)'}
      strokeWidth="1.5"
    />
    <rect
      x="22.95"
      y="22.95"
      width="7.3"
      height="7.3"
      rx="1.25"
      stroke={props.selected ? 'white' : 'rgba(114, 124, 148, 0.25)'}
      strokeWidth="1.5"
    />
  </Icon>
);

export default GridViewIcon;
