import Icon from "./Icon";

const CheckCircleIconPrimary = (props) => (
    <Icon viewBox="0 0 26 27" className={props.className} width={props.width} height={props.height} fill={props.fill}>
      <circle cx={13} cy={13} r={13} fill={props.fillCircle || "#00B3C7"} />
      <path
        stroke={props.stroke || "#fff"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="m7.75 13.75 3 3 7.5-7.5"
      />
    </Icon>
);

export default CheckCircleIconPrimary;
