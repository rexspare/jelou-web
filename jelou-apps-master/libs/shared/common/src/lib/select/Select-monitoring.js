export const Select = (props) => {
    return (
        <div className="block space-y-1">
            <div className="relative">
                <div className={`absolute ${props.className ? "" : "mt-1"} w-full rounded-md bg-white`}>
                    <select
                        className={props.className ? props.className : "input"}
                        value={props.value}
                        defaultValue={props.defaultValue}
                        onChange={props.onChange}
                        name={props.name}
                        disabled={props.disabled || false}>
                        {props.placeHolder && (
                            <option key="-1" value="-1" disabled>
                                {props.placeHolder}
                            </option>
                        )}
                        {props.options.map((option) => (
                            <option key={option[props.getId] || option.id} value={option[props.getId] || option.id}>
                                {option[props.getName] || option.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default Select;
