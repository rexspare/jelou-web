const inputStyle = 'input';

const Input = (props) => (
  <input
    id={props.id}
    min={props.min || null}
    autoFocus={props.autoFocus || false}
    name={props.name || null}
    type={props.type || null}
    className={props.className || inputStyle}
    disabled={props.disabled}
    defaultValue={props.defaultValue}
    required={props.required || null}
    onChange={props.onChange}
    placeholder={props.placeholder}
    ref={props.ref}
    value={props.value}
    onKeyPress={props.onKeyPress || null}
    autoComplete={props.autoComplete || null}
    readOnly={props.readOnly}
    onFocus={props.onFocus}
  />
);

export default Input;
