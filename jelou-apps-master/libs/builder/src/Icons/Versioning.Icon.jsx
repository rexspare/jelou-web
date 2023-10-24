export const VersioningIcon = ({ width = 25, height = 25, fill = "currentColor" }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke={fill || "#374361"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 17L12 22L22 17" stroke={fill || "#374361"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 12L12 17L22 12" stroke={fill || "#374361"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
