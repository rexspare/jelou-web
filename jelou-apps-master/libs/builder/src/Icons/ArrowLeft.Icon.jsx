export function ArrowLeft({ width = 24, height = 24, fill = "currentColor" } = {}) {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.5 12H19.5M19.5 12L12.75 5.25M19.5 12L12.75 18.75" stroke={fill} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export const RotateArrow = ({ width = 18, height = 18, color = "currentColor" } = {}) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 16 16" fill="none">
            <g stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" clipPath="url(#a)">
                <path d="M.667 2.667v4h4" />
                <path d="M2.34 10a6 6 0 1 0 1.42-6.24L.667 6.667" />
            </g>
            <defs>
                <clipPath id="a">
                    <path fill="#fff" d="M0 0h16v16H0z" />
                </clipPath>
            </defs>
        </svg>
    );
};
