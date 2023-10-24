export const AnnotationIcon = ({ width = 40, height = 40, color = "currentColor" }) => (
    <svg fill="none" width={width} height={height} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <path
            stroke={color}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.667 13.334h16.666M11.667 20h6.666M20 33.334l-6.667-6.667h-5A3.333 3.333 0 0 1 5 23.334V10a3.333 3.333 0 0 1 3.333-3.333h23.334A3.333 3.333 0 0 1 35 10v13.334a3.333 3.333 0 0 1-3.333 3.333h-5L20 33.334Z"
        />
    </svg>
);
