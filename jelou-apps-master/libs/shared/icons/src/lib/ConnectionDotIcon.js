import Icon from "./Icon";

const ConnectionDotIcon = (props) => (
    <Icon viewBox="0 0 10 10" className={props.className} width={props.width} height={props.height}>
        <circle cx="5" cy="5" r="5" fill="currentColor" />
    </Icon>
);

export default ConnectionDotIcon;
