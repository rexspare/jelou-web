import { isEmpty } from "lodash";
import Select, { StylesConfig } from "react-select";

import { InputErrorMessage } from "./ShowErrors.Input";
import { SelectorInputProps } from "./types.input";

export const InputSelector = ({
    hasError,
    label,
    name,
    selectorRef = undefined,
    placeholder,
    options = [],
    defaultValue = null,
    disabled = false,
    onChange = undefined,
    value = undefined,
    isSearchable = false,
    inline = false,
    isControlled = false,
    labelClassName = "block block font-medium mb-1",
}: SelectorInputProps) => {
    const _defaultValue = options && options.filter((option) => String(defaultValue).includes(String(option.value)));
    const _defaultLabel = options && options.filter((option) => String(defaultValue).includes(String(option.label)));

    const defaultOptions = options && options.length > 0 && defaultValue ? (!isEmpty(_defaultValue) ? _defaultValue : _defaultLabel) : null;

    const parsedValue = options && options.length > 0 && value ? options.filter((option) => String(value).includes(String(option.value))) : null;

    return (
        <label className="font-medium">
            <div className={inline ? "flex items-center gap-3" : ""}>
                {label && <span className={labelClassName}>{label}</span>}
                <Select
                    {...(onChange && { onChange })}
                    className={inline ? "flex-1" : ""}
                    defaultValue={defaultOptions}
                    isDisabled={disabled}
                    isMulti={false}
                    isSearchable={isSearchable}
                    name={name}
                    options={options}
                    placeholder={placeholder}
                    ref={selectorRef}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    styles={SERVICES_STYLES({ inputHasError: Boolean(hasError) })}
                    value={isControlled ? parsedValue : value}
                />
            </div>
            {hasError && <InputErrorMessage hasError={hasError} />}
        </label>
    );
};

interface IHandleStyles {
    valueContainer: StylesConfig["valueContainer"];
    clearIndicator: StylesConfig["clearIndicator"];
    control: StylesConfig["control"];
    menu: StylesConfig["menu"];
    menuList: StylesConfig["menuList"];
    option: StylesConfig["option"];
    input: StylesConfig["input"];
    placeholder: StylesConfig["placeholder"];
    singleValue: StylesConfig["singleValue"];
    dropdownIndicator: StylesConfig["dropdownIndicator"];
    indicatorSeparator: StylesConfig["indicatorSeparator"];
}

interface IHandleStylesError {
    clearIndicator: StylesConfig["clearIndicator"];
    control: StylesConfig["control"];
    menu: StylesConfig["menu"];
    menuList: StylesConfig["menuList"];
    option: StylesConfig["option"];
    input: StylesConfig["input"];
    placeholder: StylesConfig["placeholder"];
    singleValue: StylesConfig["singleValue"];
    dropdownIndicator: StylesConfig["dropdownIndicator"];
    indicatorSeparator: StylesConfig["indicatorSeparator"];
}

function SERVICES_STYLES({ inputHasError = false, menuListTop = false } = {}) {
    const selectForm: IHandleStyles = {
        valueContainer: (style) => {
            return {
                ...style,
                padding: 0,
                display: "flex",
                width: "100%",
            };
        },
        clearIndicator: (style) => ({
            ...style,
            display: "none",
        }),
        control: () => {
            return {
                // backgroundColor: '#EFF1F5',
                backgroundColor: "transparent",
                display: "flex",
                height: "3rem",
                border: "1px solid #CDD7E7",
                borderRadius: "0.625rem",
                textOverflow: "ellipsis",
                paddingLeft: "0.5rem",
                "&:hover": {
                    cursor: "pointer",
                },
            };
        },
        menu: () => {
            return {
                borderRadius: "0.625rem",
                boxShadow: "0rem 0rem 0.925rem rgba(127, 128, 156, 0.15)",
                top: menuListTop ? "0" : "130%",
                position: "absolute",
                width: "100%",
                boxSizing: "border-box",
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
                backgroundColor: isSelected ? "rgba(0, 179, 199, 0.1)" : "white",
                borderBottomWidth: "0.0313rem",
                borderColor: "rgba(166, 180, 208, 0.25)",
                color: isSelected ? "#00B3C7" : "#707C95",
                cursor: "pointer",
                fontWeight: isSelected ? 700 : 600,
                padding: "0.5rem",
                transition: "all ease-out 0.3s",
                paddingLeft: "2rem",
                "&:hover": {
                    color: "#00B3C7",
                    backgroundColor: "rgba(0, 179, 199, 0.1)",
                },
            };
        },
        input: () => ({
            color: "#707C95",
        }),
        placeholder: () => ({
            color: "#727C94",
            fontWeight: "500",
            fontSize: "0.9375rem",
        }),
        singleValue: () => ({
            color: "#00B3C7",
            fontSize: "0.9375rem",
            fontWeight: "600",
            padding: "0.5rem",
            textOverflow: "ellipsis",
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

    const selectFormError: IHandleStylesError = {
        clearIndicator: (style) => ({
            ...style,
            display: "none",
        }),
        control: (styles) => {
            return {
                ...styles,
                backgroundColor: "rgba(214, 128, 111, 0.10)",
                width: "100%",
                height: "3rem",
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
}
