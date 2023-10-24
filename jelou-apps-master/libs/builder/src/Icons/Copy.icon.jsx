export const CopyIcon = ({ width = 20, height = 20, stroke = "currentColor" }) => (
  <svg
    fill="none"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 16V4a2 2 0 0 1 2-2h10M9 22h9a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z"
    />
  </svg>
);