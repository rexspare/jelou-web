const Toggle = (props) => (
  <div>
    <span
      onClick={props.onClick}
      className={`${props.online} relative inline-block flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:shadow-outline`}
      role="checkbox"
      tabIndex="0"
      name={props.name}
      aria-checked={props.value}
    >
      <span
        aria-hidden="true"
        className={`${props.translate} inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200`}
      ></span>
    </span>
  </div>
);

export default Toggle;
