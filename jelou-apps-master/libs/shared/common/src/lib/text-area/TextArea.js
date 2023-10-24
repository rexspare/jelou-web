import TextareaAutosize from 'react-autosize-textarea';

const TextArea = (props) => {
  const textArea = props.isTriggers ? props.className : 'input w-full py-2 text-sm';
  const minHeight = props.minHeight ? props.minHeight : 80;
  const wrapClass = props.className ? props.className : 'w-full flex-1 mt-1';
  const disabled = props.disabled ? props.disabled : false;
  const placeHolder2 = props.placeholder;

  return (
    <div className={wrapClass}>
      <TextareaAutosize
        className={textArea}
        style={{ minHeight: minHeight }}
        placeholder={placeHolder2}
        onChange={props.onChange}
        value={props.value}
        defaultValue={props.defaultValue}
        name={props.name}
        disabled={disabled}
      />
    </div>
  );
};

export default TextArea;
