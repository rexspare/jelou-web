export const EmptyNodeIcon = ({ width = 108, height = 108 }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="108" height="107" viewBox="0 0 108 107" fill="none">
            <rect x="1" y="1" width="98" height="97" rx="12" fill="#F1F3F5" />
            <path d="M1 13C1 6.37258 6.37258 1 13 1H87C93.6274 1 99 6.37258 99 13V25.5287H1V13Z" fill="white" />
            <g filter="url(#filter0_d_428_17118)">
                <rect x="2" y="2" width="96" height="95" rx="11" stroke="#DCDEE4" strokeWidth="2" shapeRendering="crispEdges" />
            </g>
            <g filter="url(#filter1_d_428_17118)">
                <rect x="12" y="33" width="76" height="54" rx="6" fill="white" />
            </g>
            <defs>
                <filter id="filter0_d_428_17118" x="0" y="0" width="108" height="107" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dx="4" dy="4" />
                    <feGaussianBlur stdDeviation="2.5" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0.721569 0 0 0 0 0.741176 0 0 0 0 0.788235 0 0 0 0.25 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_428_17118" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_428_17118" result="shape" />
                </filter>
                <filter id="filter1_d_428_17118" x="11" y="32" width="86" height="64" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dx="4" dy="4" />
                    <feGaussianBlur stdDeviation="2.5" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0.721569 0 0 0 0 0.741176 0 0 0 0 0.788235 0 0 0 0.1 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_428_17118" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_428_17118" result="shape" />
                </filter>
            </defs>
        </svg>
    );
};
