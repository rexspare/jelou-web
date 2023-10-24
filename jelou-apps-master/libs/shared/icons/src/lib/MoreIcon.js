import Icon from "./Icon";

const MoreIcon = (props) => (
    <Icon viewBox="0 0 100 100" className={props.className} width={props.width || 100} height={props.height || 100}>
        <path d="M47.16,65.11V53.17H35.22v-6.3h11.94V34.96h6.3v11.91h11.88v6.3H53.46v11.94H47.16z" fill={props.fill ? props.fill : "#4EB1C4"} />
    </Icon>
);

export default MoreIcon;
