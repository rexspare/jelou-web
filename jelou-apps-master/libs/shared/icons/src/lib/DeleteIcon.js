import * as React from "react";
const DeleteIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.width || 18} height={props.height || 18} fill="none" {...props}>
    <path
      stroke={props.stroke || "#727C94"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m14.25 5.25-.65 9.107a1.5 1.5 0 0 1-1.497 1.393H5.897A1.5 1.5 0 0 1 4.4 14.357L3.75 5.25m3.75 3v4.5m3-4.5v4.5m.75-7.5V3a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75v2.25M3 5.25h12"
    />
  </svg>
);
export default DeleteIcon;
