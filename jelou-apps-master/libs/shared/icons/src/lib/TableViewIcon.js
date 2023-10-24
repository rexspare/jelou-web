import React from 'react';

import Icon from './Icon';

const TableViewIcon = (props) => (
  <Icon
    viewBox="0 0 40 40"
    className={props.className}
    width={props.width}
    height={props.height}
    stroke={props.stroke}
    fill={'none'}
  >
    <path
      d="M40 33C40 36.866 36.866 40 33 40L0 40L3.49691e-06 -3.49691e-06L33 -6.11959e-07C36.866 -2.73984e-07 40 3.13401 40 7L40 33Z"
      fill={props.selected ? 'rgba(0, 179, 199, 0.65)' : 'white'}
    />
    <rect
      x="8"
      y="11"
      width="24"
      height="4"
      rx="2"
      fill={props.selected ? 'white' : 'rgba(114, 124, 148, 0.25)'}
    />
    <rect
      x="8"
      y="18"
      width="24"
      height="4"
      rx="2"
      fill={props.selected ? 'white' : 'rgba(114, 124, 148, 0.25)'}
    />
    <rect
      x="8"
      y="25"
      width="24"
      height="4"
      rx="2"
      fill={props.selected ? 'white' : 'rgba(114, 124, 148, 0.25)'}
    />
  </Icon>
);

export default TableViewIcon;
