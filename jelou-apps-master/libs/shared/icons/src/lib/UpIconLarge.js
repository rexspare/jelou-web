import Icon from "./Icon";

const UpIconLarge = (props) => (
  <Icon viewBox="0 0 16 9" className={props.className} width={props.width || 17} height={props.height || 17} fill="none">
    <path 
      d="M1 8L8 0.999999L15 8" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Icon> 
);

export default UpIconLarge;
