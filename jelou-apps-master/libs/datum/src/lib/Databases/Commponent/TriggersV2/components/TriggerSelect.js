import Select from "react-select";
import { InputErrorMessage } from "./TriggerErrorMessage";

const TriggerSelect = ({ 
    name,
    value,
    options, 
    isAction,
    disabled, 
    hasError, 
    placeholder, 
    parsedEvents = [],
    onChange = undefined 
}) => {

    const parsedValue = 
        isAction ? options?.find((option) => option.value === value) : parsedEvents?.find((option) => option.value === value);

    return (
        <label className="font-medium">
            <Select
                name={name}
                isMulti={false}
                options={options}
                value={parsedValue}
                onChange={onChange}
                isSearchable={false}
                isDisabled={disabled}
                placeholder={placeholder}
                className="mt-1 datum-react-select"
                styles={handleStyles({ inputHasError: hasError })}
            />
            {hasError && <InputErrorMessage hasError={hasError} />}
        </label>
    );
};

export default TriggerSelect;

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
        control: () => {
            return {
                backgroundColor: "rgba(242, 247, 253, 0.75)",
                display: "flex",
                height: "2.5rem",
                borderRadius: "0.625rem",
                paddingLeft: "0.5rem",
                "&:hover": {
                    cursor: "pointer",
                    borderColor: "transparent",
                },
            };
        },
        menu: () => {
            return {
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
        option: ({ isSelected }) => {
            return {
                backgroundColor: "white",
                borderBottomWidth: "0.0313rem",
                borderColor: "rgba(166, 180, 208, 0.25)",
                color: isSelected ? "#00B3C7" : "#707C95",
                cursor: "pointer",
                fontWeight: isSelected ? 600 : 500,
                padding: "0.5rem",
                "&:hover": {
                    color: "#00B3C7",
                },
            };
        },
        input: () => ({
            color: "#707C95",
        }),
        placeholder: () => ({
            color: "#a0aebf",
            fontWeight: "400",
        }),
        singleValue: () => ({
            color: "rgba(112, 124, 146, 0.75)",
            fontSize: "0.9375rem",
            fontWeight: "400",
        }),
        dropdownIndicator: () => ({
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
                borderColor: "#A83927",
                borderRadius: "0.625rem",
                borderWidth: "0.125rem",
                boxShadow: "none",
                minHeight: "2.25rem",

                "&:hover": {
                    cursor: "text",
                },
            };
        },
        menu: () => {
            return {
                borderRadius: "0.625rem",
                boxShadow: "0rem 0rem 0.625rem rgba(127, 128, 156, 0.15)",
                top: "130%",
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
        option: ({ isSelected }) => {
            return {
                backgroundColor: "white",
                borderBottomWidth: "0.0313rem",
                borderColor: "rgba(166, 180, 208, 0.25)",
                color: isSelected ? "#00B3C7" : "#707C95",
                cursor: "pointer",
                fontWeight: isSelected ? 600 : 500,
                padding: "0.5rem",
                "&:hover": {
                    color: "#00B3C7",
                },
            };
        },
        input: (styles) => ({ ...styles, color: "rgba(166, 180, 208, 1)" }),
        placeholder: (styles) => ({
            ...styles,
            color: "#A6B4D0",
            fontWeight: "400",
        }),
        singleValue: (styles) => ({
            ...styles,
            color: "#A6B4D0",
            fontSize: "0.9375rem",
            fontWeight: "400",
        }),
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
