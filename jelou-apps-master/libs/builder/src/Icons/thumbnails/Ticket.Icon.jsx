export const TicketIcon = ({ width = 40, height = 40, color = "currentColor" }) => (
    <svg fill="none" width={width} height={height} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <path
            fill={color}
            d="M35 16.666v1.5a1.5 1.5 0 0 0 1.5-1.5H35Zm0 6.667h1.5a1.5 1.5 0 0 0-1.5-1.5v1.5Zm-30 0v-1.5a1.5 1.5 0 0 0-1.5 1.5H5Zm0-6.667H3.5a1.5 1.5 0 0 0 1.5 1.5v-1.5Zm2-9.833a3.5 3.5 0 0 0-3.5 3.5h3a.5.5 0 0 1 .5-.5v-3Zm26 0H7v3h26v-3Zm3.5 3.5a3.5 3.5 0 0 0-3.5-3.5v3a.5.5 0 0 1 .5.5h3Zm0 6.333v-6.333h-3v6.333h3ZM33.167 20c0-1.013.82-1.834 1.833-1.834v-3A4.833 4.833 0 0 0 30.167 20h3ZM35 21.833A1.833 1.833 0 0 1 33.167 20h-3A4.833 4.833 0 0 0 35 24.833v-3Zm1.5 7.833v-6.333h-3v6.333h3Zm-3.5 3.5a3.5 3.5 0 0 0 3.5-3.5h-3a.5.5 0 0 1-.5.5v3Zm-26 0h26v-3H7v3Zm-3.5-3.5a3.5 3.5 0 0 0 3.5 3.5v-3a.5.5 0 0 1-.5-.5h-3Zm0-6.333v6.333h3v-6.333h-3ZM6.833 20c0 1.012-.82 1.833-1.833 1.833v3A4.833 4.833 0 0 0 9.833 20h-3ZM5 18.166c1.013 0 1.833.821 1.833 1.834h3A4.833 4.833 0 0 0 5 15.166v3Zm-1.5-7.833v6.333h3v-6.333h-3Z"
        />
        <path stroke={color} strokeLinecap="round" strokeWidth={2} d="M25 8.333v3.333" />
        <path stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M25 18.333v3.333M25 28.333v3.333" />
    </svg>
);
