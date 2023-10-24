import Icon from "./Icon";

const LeftCircleIcon = (props) => (
    <Icon viewBox="0 0 30 30" className={props.className} width={props.width || 30} height={props.height || 30} fill="none">
        <g clipPath="url(#clip0_77_17620)">
            <path d="M17.5 20.8332L11.6667 14.9998L17.5 9.1665" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <rect x="0.5" y="0.5" width="29" height="29" rx="14.5" stroke="currentColor" />
        <defs>
            <clipPath id="clip0_77_17620">
                <rect width={props.width} height={props.height} rx="15" fill="white" />
            </clipPath>
        </defs>
    </Icon>
);

export default LeftCircleIcon;
