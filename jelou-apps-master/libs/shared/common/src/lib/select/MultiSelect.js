import Select from 'react-select';

const MultiSelect = (props) => {
  const { options, defaultValue } = props;

  const customStyles = {
    control: (base, state) => ({
      ...base,
      border: state.isFocused ? 0 : 0,
      backgroundColor: 'unset',
      // This line disable the blue border
      boxShadow: state.isFocused ? 0 : 0,
      '&:hover': {
        border: state.isFocused ? 0 : 0,
      },
    }),
    multiValue: (styles, { data }) => {
      return {
        ...styles,
        backgroundColor: '#f2f8ff',
        borderRadius: '0.938rem',
      };
    },
    multiValueLabel: (styles, { data }) => ({
      ...styles,
      color: 'grey',
    }),
  };

  return (
    <div className={`relative ${props.className}`}>
      <Select
        options={options}
        isMulti
        value={defaultValue}
        closeMenuOnSelect={false}
        name={props.name}
        styles={customStyles}
        required={props.required}
        placeholder={props.placeholder}
        onChange={(evt) => {
          props.onChange(evt);
        }}
      />
    </div>
  );
};

export default MultiSelect;
