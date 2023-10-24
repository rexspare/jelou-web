export const LibraryIcon = ({ width = 40, height = 40, color = "currentColor" }) => (
    <svg fill="none" width={width} height={height} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <path
            stroke={color}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.333 23.333v5m6.667-5v5m6.667-5v5M5 35h30M5 16.667h30m-30-5L20 5l15 6.667m-28.333 5h26.666V35H6.667V16.667Z"
        />
    </svg>
);
