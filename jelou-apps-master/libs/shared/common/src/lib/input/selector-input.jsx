import Select from "react-select";

import { InputErrorMessage } from "./ShowErrors.Input";

import { isEmpty } from "lodash";
import Tippy from "@tippyjs/react";
import { QuestionIcon } from "@apps/shared/icons";

function TippyWrapper(props) {
    const { children, content } = props;
    return (
        <Tippy theme="tomato" arrow content={content}>
            {children}
        </Tippy>
    );
}
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
    labelClassName = "flex block font-medium mb-1",
    className = "font-medium",
    tippyContent = undefined,
    menuListTop = false,
    menuShouldScrollIntoView = false
}) => {
    const _defaultValue = options && options.filter((option) => String(defaultValue).includes(String(option.value)));
    const _defaultLabel = options && options.filter((option) => String(defaultValue).includes(String(option.label)));

    const defaultOptions = options && options.length > 0 && defaultValue ? (!isEmpty(_defaultValue) ? _defaultValue : _defaultLabel) : null;

    const parsedValue = options && options.length > 0 && value ? options.filter((option) => String(value).includes(String(option.value))) : null;

    return (
        <label className={className}>
            <div className={inline ? "flex items-center gap-3" : ""}>
                {label && (
                    <span className={labelClassName}>
                        {label}
                        {tippyContent && (
                            <TippyWrapper content={tippyContent}>
                                <span className="cursor-pointer text-primary-200 hover:text-primary-200">
                                    <QuestionIcon width={13} height={13} />
                                </span>
                            </TippyWrapper>
                        )}
                    </span>
                )}
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
                    styles={SERVICES_STYLES({ inputHasError: Boolean(hasError), menuListTop })}
                    value={isControlled ? parsedValue : value}
                    menuShouldScrollIntoView={menuShouldScrollIntoView}
                />
            </div>
            {hasError && <InputErrorMessage hasError={hasError} />}
        </label>
    );
};

const SERVICES_STYLES = ({ inputHasError = false, menuListTop } = {}) => {
    const selectForm = {
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
                top: menuListTop ? "110%" : "130%",
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
            return { top: "100%", backgroundColor: "white", maxHeight: "13rem", overflowY: "auto" };
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
                width: "100%",
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
            color: "#707C95",
            fontSize: "0.9375rem",
            fontWeight: "300",
            padding: "0.5rem",
            textOverflow: "ellipsis",
        }),
        dropdownIndicator: (base, state) => ({
            transform: state.selectProps.menuIsOpen ? "rotate(-180deg)" : "rotate(0)",
            color: "#707C95",
            padding: state.selectProps.menuIsOpen ? "0 0 0 8px" : "0 8px 0 0",
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
};
