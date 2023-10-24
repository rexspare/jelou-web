import Icon from "./Icon";

const Dots = (props) => (
    <Icon viewBox="0 0 36 36" className={props.className} width={props.width} height={props.height} fill={props.fill}>
        <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="4" y="15" width="28" height="6">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.5 18C4.5 16.344 5.844 15 7.5 15C9.156 15 10.5 16.344 10.5 18C10.5 19.656 9.156 21 7.5 21C5.844 21 4.5 19.656 4.5 18ZM18 15C16.344 15 15 16.344 15 18C15 19.656 16.344 21 18 21C19.656 21 21 19.656 21 18C21 16.344 19.656 15 18 15ZM28.5 15C26.844 15 25.5 16.344 25.5 18C25.5 19.656 26.844 21 28.5 21C30.156 21 31.5 19.656 31.5 18C31.5 16.344 30.156 15 28.5 15Z"
                fill="white"
            />
        </mask>
        <g mask="url(#mask0)">
            <rect width="36" height="36" fill={props.fill} />
        </g>
    </Icon>
);
export default Dots;
