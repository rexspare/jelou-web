const Icon = (props) => {
    const { isCenter = false } = props;
    return(
    <div className={`flex ${isCenter ? 'justify-center':'flex-col'} items-center`}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            height={props.height}
            width={props.width}
            viewBox={props.viewBox}
            className={props.className}
            fill={props.fill}
            stroke={props.stroke}>
            {props.children}
        </svg>
    </div>
);
    }

export default Icon;
