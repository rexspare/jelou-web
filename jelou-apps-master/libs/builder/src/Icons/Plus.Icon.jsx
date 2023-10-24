export const PlusIcon = ({ width = 18, height = 18, color = "currentColor" }) => (
    <svg fill="none" width={width} height={height}>
        <path stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" d="M9 1.941V16.06M16.059 9H1.94" />
    </svg>
);

export const PlusIconRounded = ({ width = 20, height = 20, color = "currentColor" }) => (
    <svg width={width} height={height} fill="none" viewBox="0 0 20 20">
        <path stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 7.5v5m2.5-2.5h-5m10 0a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" />
    </svg>
);
