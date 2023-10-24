import Icon from "./Icon";

const EmptyDatastoreIcon = (props) => (
    <Icon viewBox="0 0 44 43" className={props.className} width={props.width} height={props.height} fill="none">
        <ellipse cx={21.5} cy={21} fill="#F7F8FA" rx={21.5} ry={21} />
        <circle cx={22} cy={21} r={12} fill="#959DAF" />
        <path
            stroke="#fff"
            strokeWidth={1.333}
            d="M16.666 17.667v6.666c0 1.473 2.388 2.667 5.333 2.667 2.946 0 5.334-1.194 5.334-2.667v-6.666m-10.667 0c0 1.472 2.388 2.666 5.333 2.666 2.946 0 5.334-1.194 5.334-2.666m-10.667 0c0-1.473 2.388-2.667 5.333-2.667 2.946 0 5.334 1.194 5.334 2.667m0 3.333c0 1.473-2.388 2.667-5.334 2.667-2.945 0-5.333-1.194-5.333-2.667"
        />
    </Icon>
);
export default EmptyDatastoreIcon;
