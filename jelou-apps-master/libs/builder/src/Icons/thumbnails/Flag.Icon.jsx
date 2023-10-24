export const FlagIcon = ({ width = 40, height = 40, color = "currentColor" }) => (
    <svg fill="none" width={width} height={height} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <path
            stroke={color}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 35v-6.667m0 0v-20A3.333 3.333 0 0 1 8.333 5h10.834l1.666 1.667H35l-5 10 5 10H20.833L19.167 25H8.333A3.333 3.333 0 0 0 5 28.333Zm15-22.5V15"
        />
    </svg>
);
