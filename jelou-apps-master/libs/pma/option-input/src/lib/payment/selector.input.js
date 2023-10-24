import Select from "react-select";

export const InputSelector = ({
  hasError,
  label,
  name,
  placeholder,
  multiSelect = false,
  options,
  defaultValue = null,
  disabled = false,
  onChange = undefined,
  value = undefined,
  isSearchable = false,
}) => {
  const defautlOptions =
    options && options.length > 0 && defaultValue ? options.filter((option) => String(defaultValue).includes(String(option.value))) : null;

  return (
    <label className="block font-medium">
      {label}
      <Select
        {...(onChange && { onChange })}
        className="datum-react-select mt-1"
        defaultValue={defautlOptions}
        isDisabled={disabled}
        isMulti={multiSelect}
        isSearchable={isSearchable}
        name={name}
        options={options}
        placeholder={placeholder}
        value={value}
        styles={handleStyles({ inputHasError: hasError })}
      />
      {hasError && <small className="mb-2 truncate text-11 italic text-rose-400">{hasError}</small>}
    </label>
  );
};

const handleStyles = ({ inputHasError = false, menuListTop = false } = {}) => {
  const selectForm = {
    valueContainer: (style) => {
      return {
        ...style,
        padding: 0,
        display: "flex",
        width: "100%",
      };
    },
    multiValue: (base) => {
      return {
        ...base,
        color: "#00B3C7",
        cursor: "pointer",
        backgroundColor: "transparent",
        padding: 0,
        borderColor: "#00B3C7",
        borderRadius: "999999999px",
        borderWidth: "1px",
      };
    },
    multiValueLabel: (base) => {
      return {
        ...base,
        padding: 0,
        color: "#00B3C7",
        fontSize: "0.9375rem",
        fontWeight: "400",
      };
    },
    multiValueRemove: (base) => {
      return {
        ...base,
        fontSize: "0.9375rem",
        fontWeight: "300",
        paddingLeft: 0,
        backgroundColor: "transparent",
        borderRadius: "999999999px",
        "&:hover": {
          color: "#00B3C7",
          cursor: "pointer",
          backgroundColor: "transparent",
        },
      };
    },
    clearIndicator: (style) => ({
      ...style,
      display: "none",
    }),
    control: (styles) => {
      return {
        // ...styles,
        backgroundColor: "rgba(242, 247, 253, 0.75)",
        display: "flex",
        height: "2rem",
        borderRadius: "0.625rem",
        paddingLeft: "0.5rem",
        // marginBottom: "1rem",

        // borderColor: "transparent",
        // borderRadius: "0.625rem",
        // borderWidth: "0.125rem",
        // boxShadow: "none",
        // minHeight: "2.25rem",
        // width: "100%",

        "&:hover": {
          cursor: "pointer",
          borderColor: "transparent",
        },
      };
    },
    menu: (styles) => {
      return {
        // ...styles,
        borderRadius: "0.625rem",
        boxShadow: "0rem 0rem 0.625rem rgba(127, 128, 156, 0.15)",
        top: menuListTop ? "0" : "130%",
        position: "absolute",

        boxSizing: "border-box",
        width: "98%",
        marginLeft: "4px",
        zIndex: 1,
        overflow: "hidden",
        backgroundColor: "white",
        maxHeight: "13rem",
      };
    },
    menuList: () => {
      return { top: "100%", backgroundColor: "white", maxHeight: "13rem", overflowY: "scroll" };
    },
    option: (styles, { isSelected }) => {
      return {
        // ...styles,
        backgroundColor: "white",
        borderBottomWidth: "0.0313rem",
        borderColor: "rgba(166, 180, 208, 0.25)",
        color: isSelected ? "#00B3C7" : "#707C95",
        cursor: "pointer",
        fontSize: "0.813rem",
        fontWeight: isSelected ? 600 : 500,
        padding: "0.5rem",
        // paddingLeft: isSelected ? "1.5rem" : "3.5rem",

        "&:hover": {
          color: "#00B3C7",
          // backgroundColor: "rgba(166, 180, 208, 0.10)",
        },
      };
    },
    input: (styles) => ({
      // ...styles,
      //  color: "rgba(166, 180, 208, 1)"
      color: "#727C94",
    }),
    placeholder: (styles) => ({
      // ...styles,
      // color: "rgba(112, 124, 146, 0.5)",
      color: "#DCDEE4",
      fontSize: "0.813rem",
      fontWeight: "600",
    }),
    singleValue: (styles) => ({
      // ...styles,
      color: "#727C94",
      fontSize: "0.813rem",
      fontWeight: "500",
    }),
    dropdownIndicator: (styles) => ({
      // ...styles,
      color: "rgba(166, 180, 208, 0.5)",
      padding: "0 8px 0 0",
      "&:hover": {
        color: "rgba(166, 180, 208, 1)",
        cursor: "pointer",
      },
      "& svg": {
        width: "0.9375rem",
      },
    }),
    indicatorSeparator: () => ({ display: "none" }),
  };

  const selectFormError = {
    clearIndicator: (style) => ({
      ...style,
      display: "none",
    }),
    control: (styles) => {
      return {
        ...styles,
        backgroundColor: "rgba(214, 128, 111, 0.10)",
        width: "100%",
        // height: "2.25rem",
        borderColor: "#A83927",
        borderRadius: "0.625rem",
        borderWidth: "0.125rem",
        boxShadow: "none",
        minHeight: "2.25rem",

        "&:hover": {
          cursor: "text",
          // borderColor: "transparent",
        },
      };
    },
    menu: (styles) => {
      return {
        // ...styles,
        borderRadius: "0.625rem",
        boxShadow: "0rem 0rem 0.625rem rgba(127, 128, 156, 0.15)",
        top: menuListTop ? "0" : "130%",

        position: "absolute",

        boxSizing: "border-box",
        width: "98%",
        marginLeft: "4px",
        zIndex: 1,
        overflow: "hidden",
        backgroundColor: "white",
        maxHeight: "13rem",
      };
    },
    menuList: () => {
      return { top: "100%", backgroundColor: "white", maxHeight: "13rem", overflowY: "scroll" };
    },
    option: (styles, { isSelected }) => {
      return {
        // ...styles,
        backgroundColor: "white",
        borderBottomWidth: "0.0313rem",
        borderColor: "rgba(166, 180, 208, 0.25)",
        color: isSelected ? "#00B3C7" : "#707C95",
        cursor: "pointer",
        fontWeight: isSelected ? 600 : 500,
        padding: "0.5rem",
        // paddingLeft: isSelected ? "1.5rem" : "3.5rem",

        "&:hover": {
          color: "#00B3C7",
          // backgroundColor: "rgba(166, 180, 208, 0.10)",
        },
      };
    },
    input: (styles) => ({ ...styles, color: "rgba(166, 180, 208, 1)" }),
    placeholder: (styles) => ({
      ...styles,
      color: "#A6B4D0",
      // fontSize: "0.9375rem",
      fontWeight: "400",
    }),
    singleValue: (styles) => ({
      ...styles,
      color: "#A6B4D0",
      fontSize: "0.9375rem",
      fontWeight: "400",
    }),
    // valueContainer: (styles) => ({ ...styles, padding: "0 8px" }),
    dropdownIndicator: (styles) => ({
      ...styles,
      color: "rgba(166, 180, 208, 0.5)",
      padding: "0 8px 0 0",
      "&:hover": {
        color: "rgba(166, 180, 208, 1)",
        cursor: "pointer",
      },
    }),
    indicatorSeparator: () => ({ display: "none" }),
  };
  return inputHasError ? selectFormError : selectForm;
};
