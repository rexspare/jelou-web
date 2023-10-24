import Icon from "./Icon";

export default function FilterIcon(props) {
    return (
        <Icon width={props.width} fill={props.fill} height={props.height} className={props.className} viewBox="0 0 18 18">
            <path
                d="M1.5 2.5C1.5 1.94771 1.94772 1.5 2.5 1.5H15.5C16.0523 1.5 16.5 1.94772 16.5 2.5V4.41912C16.5 4.68434 16.3946 4.93869 16.2071 5.12623L10.9596 10.3738C10.772 10.5613 10.6667 10.8157 10.6667 11.0809V13.1667L7.33333 16.5V11.0809C7.33333 10.8157 7.22798 10.5613 7.04044 10.3738L1.79289 5.12623C1.60536 4.93869 1.5 4.68434 1.5 4.41912V2.5Z"
                stroke={props.stroke}
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Icon>
    );
}
