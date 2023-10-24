import Icon from "./Icon";

const ArrowIcon = (props) => (
    <Icon viewBox="0 0 24 24" className={props.className} width={props.width} height={props.height} fill={props.fill}>
        <path
            d={
                `M10.4 12l5.3-5.3c0.4-0.4 0.4-1 0-1.4s-1-0.4-1.4 0l-6 6c-0.4 0.4-0.4 1 0 1.4l6 6c0.2 0.2 0.5 0.3 0.7 ` +
                `0.3s0.5-0.1 0.7-0.3c0.4-0.4 0.4-1 0-1.4l-5.3-5.3z`
            }
        />
    </Icon>
);

export default ArrowIcon;
