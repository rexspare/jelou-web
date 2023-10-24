import Icon from "./Icon";

const UploadCircleIcon = (props) => (
    <Icon viewBox="0 0 18 19" className={props.className} width={props.width} height={props.height} fill={props.fill}>
      <path
        stroke="#00B3C7"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M6.25 8.083 9 5.333m0 0 2.75 2.75M9 5.333v7.334M9 .75a8.25 8.25 0 1 1 0 16.5A8.25 8.25 0 0 1 9 .75Z"
      />
    </Icon>
);

export default UploadCircleIcon;
