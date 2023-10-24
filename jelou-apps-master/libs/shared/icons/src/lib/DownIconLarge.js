import Icon from "./Icon";

const DownIconLarge = (props) => (
    <Icon viewBox="0 0 16 10" className={props.className} width={props.width || 17} height={props.height || 17} fill="none">
      <path 
        d="M15 1.5L8 8.5L1 1.5" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </Icon>
);

export default DownIconLarge;
