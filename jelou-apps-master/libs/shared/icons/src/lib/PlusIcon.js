import Icon from "./Icon";

const PlusIcon = (props) => (
    <Icon viewBox="0 0 10 10" className={props.className} width={props.width} height={props.height} fill={props.fill}>
        <path d="M3.96456 10H6.05759V6.03982H10V3.94911H6.05759V0H3.96456V3.94911H0V6.03982H3.96456V10Z" fill={props.fill} />
    </Icon>
);
export default PlusIcon;
