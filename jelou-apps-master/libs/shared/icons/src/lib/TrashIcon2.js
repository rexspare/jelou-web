import Icon from "./Icon";

const TrashIcon2 = (props) => (
    <Icon
      viewBox="0 0 25 24"
      className={props.className}
      width={props.width || 24}
      height={props.height || 24}
      fill="none"
    >
        <path
            d="M19.5001 7L18.6328 19.1425C18.558 20.1891 17.6872 21 16.6379 21H8.36236C7.31308 21 6.4422 20.1891 6.36744 19.1425L5.50012 7M10.5001 11V17M14.5001 11V17M15.5001 7V4C15.5001 3.44772 15.0524 3 14.5001 3H10.5001C9.94784 3 9.50012 3.44772 9.50012 4V7M4.50012 7H20.5001"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            stroke="currentColor"
        />
    </Icon>
);

export default TrashIcon2;
