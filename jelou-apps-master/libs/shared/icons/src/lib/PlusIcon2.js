import Icon from "./Icon";

const PlusIcon2 = (props) => (
    <Icon viewBox="0 0 28 28" className={props.className} width={props.width} height={props.height} fill={"none"}>
        <circle cx="14" cy="14" r="14" fill="#00B3C7" fillOpacity={props.fillOpacity ? props.fillOpacity : props.fillOpacity} />
        <path d="M12.5504 21H15.4806V15.4558H21V12.5288H15.4806V7H12.5504V12.5288H7V15.4558H12.5504V21Z" fill="white" />
    </Icon>
);

export default PlusIcon2;
