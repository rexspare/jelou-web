import Icon from "./Icon";

const RightIconLarge = (props) => (
    <Icon viewBox="0 0 9 17" className={props.className} width={props.width || 17} height={props.height || 17} fill="none">
        <path 
            d="M0.999999 1.5L8 8.5L1 15.5" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        />
    </Icon>
);

export default RightIconLarge;
