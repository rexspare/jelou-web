import Icon from "./Icon";

const MinusCircleIcon = (props) => (
    <Icon viewBox="0 0 18 18" className={props.className} width={props.width} height={props.height}>
        <path
            d="M11.25 9H6.75M15.75 9C15.75 12.7279 12.7279 15.75 9 15.75C5.27208 15.75 2.25 12.7279 2.25 9C2.25 5.27208 5.27208 2.25 9 2.25C12.7279 2.25 15.75 5.27208 15.75 9Z"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Icon>
);

export default MinusCircleIcon;
