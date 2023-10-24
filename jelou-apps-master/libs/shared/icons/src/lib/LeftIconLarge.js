import Icon from "./Icon";

const LeftIconLarge = (props) => (
    <Icon viewBox="0 0 9 17" className={props.className} width={props.width || 17} height={props.height || 17} fill="none">
        <path
            d="M8 15.5L1 8.5L8 1.5" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        />
    </Icon>
);

export default LeftIconLarge;
