export function CopyClicboardIcon({ width = 24, height = 24, fill = "currentColor" } = {}) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none" viewBox="0 0 24 24">
            <path stroke={fill} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 15h-9a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2Z" />
            <path stroke={fill} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 9H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1" />
        </svg>
    );
}
