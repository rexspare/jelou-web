const CloseIcon = ({ width = 16, height = 16, color = "currentColor", fillOpacity = 0.6 } = {}) => (
    <svg width={width} height={height} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
        <path d="M6 18L18 6M6 6L18 18" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default CloseIcon;
