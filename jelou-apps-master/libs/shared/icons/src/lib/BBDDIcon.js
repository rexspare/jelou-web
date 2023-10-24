import Icon from "./Icon";

const BBDDIcon = (props) => {
    return (
        <Icon viewBox="0 0 31 30" className={props.className} width={props.width} height={props.height} fill="none" stroke={props.stroke}>
            <path
              stroke="#00B3C7"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 10.666c6.627 0 12-1.79 12-4 0-2.209-5.373-4-12-4s-12 1.791-12 4c0 2.21 5.373 4 12 4ZM28 16c0 2.213-5.333 4-12 4S4 18.213 4 16"
            />
            <path
              stroke="#00B3C7"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6.667v18.666c0 2.214 5.333 4 12 4s12-1.786 12-4V6.667"
            />
        </Icon>
    );
};
export default BBDDIcon;
