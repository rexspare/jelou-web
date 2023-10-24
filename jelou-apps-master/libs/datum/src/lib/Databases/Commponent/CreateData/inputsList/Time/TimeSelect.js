import Select from "react-select";

export function SelectTime({ options = [], isSearchable = false, onChangeOption = () => null, defaultValue = undefined, isDisable } = {}) {
    return (
        <Select
            isDisabled={isDisable}
            onChange={onChangeOption}
            styles={timeInputStyle}
            autoFocus={false}
            options={options}
            placeholder="00"
            defaultValue={defaultValue}
            isSearchable={isSearchable}
            classNamePrefix={"datumTime"}
        />
    );
}

const timeInputStyle = {
    control: (styles) => {
        return {
            // ...styles,
            backgroundColor: "rgba(242, 247, 253, 0.75)",
            display: "flex",
            height: "2.5rem",
            borderRadius: "0.5rem",

            width: "4.375rem",
            padding: 0,
            margin: 0,

            "&:hover": {
                cursor: "pointer",
                borderColor: "transparent",
            },
        };
    },
    valueContainer: (style) => {
        return {
            // ...style,
            alignItems: "center",
            padding: 0,
            paddingLeft: "0.375rem",
            display: "flex",
            justifyContent: "center",
            width: "100%",
        };
    },
    multiValue: (base) => {
        return {
            // ...base,
            backgroundColor: "transparent",
            borderColor: "#00B3C7",
            borderRadius: "999999999px",
            borderWidth: "1px",
            padding: 0,
        };
    },
    multiValueLabel: (base) => {
        return {
            // ...base,
            color: "#00B3C7",
            fontSize: "0.9375rem",
            fontWeight: "400",
            padding: 0,
        };
    },
    multiValueRemove: (base) => {
        return {
            // ...base,
            color: "#00B3C7",
            fontSize: "0.9375rem",
            fontWeight: "400",
            paddingLeft: 0,
            backgroundColor: "transparent",

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
    menu: () => {
        return {
            // ...styles,
            borderRadius: "0.6875rem",
            overflow: "hidden",
            boxShadow: "0rem 0rem 0.625rem rgba(127, 128, 156, 0.15)",
            top: "120%",
            position: "absolute",
            height: "12.25rem",
            boxSizing: "border-box",
            label: "menu",
            width: "4.375rem",
            marginLeft: "0.25rem",
            zIndex: 1,
            backgroundColor: "#fff",
        };
    },
    menuList: () => {
        return { top: "100%", backgroundColor: "white", height: "12.25rem", overflowY: "scroll" };
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
    input: (styles) => ({
        // ...styles,
        //  color: "rgba(166, 180, 208, 1)"
        color: "#707C95",
    }),
    placeholder: (styles) => ({
        // ...styles,
        color: "rgba(112, 124, 146, 0.5)",
        fontSize: "0.9375rem",
        fontWeight: "500",
    }),
    singleValue: (styles) => ({
        // ...styles,
        color: "#707C95",
        fontSize: "0.9375rem",
        fontWeight: "500",
    }),
    dropdownIndicator: (styles) => ({
        // ...styles,
        display: "none",
        // color: "rgba(166, 180, 208, 0.5)",
        // padding: "0 8px 0 0",
        // "&:hover": {
        //     color: "rgba(166, 180, 208, 1)",
        //     cursor: "pointer",
        // },
    }),
    indicatorSeparator: () => ({ display: "none" }),
};
