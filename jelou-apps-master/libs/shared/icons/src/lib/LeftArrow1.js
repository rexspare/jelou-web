import Icon from "./Icon";

const LeftArrow1 = (props) => (
    <Icon viewBox="0 0 30 30" className={props.className} width={props.width || 30} height={props.height || 30} fill="none">
        <g clipPath="url(#clip0_3022_65692)">
            <path
                d="M13.3333 20.8333L7.5 15M7.5 15L13.3333 9.16663M7.5 15L22.5 15"
                stroke="#00B3C7"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </g>
        <defs>
            <clipPath id="clip0_3022_65692">
                <rect width="30" height="30" rx="15" fill="white" />
            </clipPath>
        </defs>
    </Icon>
);

export default LeftArrow1;
