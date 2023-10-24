import * as React from "react";

const CheckboxSelectedIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <rect width={18} height={18} x={3} y={3} fill="#2BD88F" rx={4} />
    <path
      fill="#F2F7FD"
      d="m14.72 8.79-4.29 4.3-1.65-1.65a1 1 0 1 0-1.41 1.41l2.35 2.36a1 1 0 0 0 1.41 0l5-5a.998.998 0 0 0 0-1.42 1 1 0 0 0-1.41 0Z"
    />
  </svg>
)
export default CheckboxSelectedIcon;