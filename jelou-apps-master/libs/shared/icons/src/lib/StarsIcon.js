import Icon from "./Icon";

const StarsIcon = (props) => (
    <Icon viewBox="0 0 18 18" className={props.className} width={props.width} height={props.height}>
        <path
            d="M3.16667 1.5V4.83333M1.5 3.16667H4.83333M4 13.1667V16.5M2.33333 14.8333H5.66667M9.83333 1.5L11.7381 7.21429L16.5 9L11.7381 10.7857L9.83333 16.5L7.92857 10.7857L3.16667 9L7.92857 7.21429L9.83333 1.5Z"
            stroke="currentColor"
            fill="none"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Icon>
);

export default StarsIcon;
