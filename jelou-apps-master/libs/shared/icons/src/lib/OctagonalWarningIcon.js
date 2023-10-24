import Icon from "./Icon";

const OctagonalWarningIcon = (props) => (
    <Icon viewBox="0 0 20 20" className={props.className} width={props.width} height={props.height}>
        <g clip-path="url(#clip0_4334_12488)">
            <path
                d="M6.54996 1.66675H13.45L18.3333 6.55008V13.4501L13.45 18.3334H6.54996L1.66663 13.4501V6.55008L6.54996 1.66675Z"
                stroke="#EC5F4F"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
            <path d="M10 6.66675V10.0001" stroke="#EC5F4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 13.3333H10.0083" stroke="#EC5F4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
            <clipPath id="clip0_4334_12488">
                <rect width="20" height="20" fill="white" />
            </clipPath>
        </defs>
    </Icon>
);

export default OctagonalWarningIcon;
