import React from "react";
import Select from "react-select";
import isEmpty from "lodash/isEmpty";

const ReactSelect = (props) => {
    const { onChange, name, placeholder, className, value, loading, noOptionsMessage, isDisabled = false, onBlur } = props;

    const groupStyles = {
        display: "flex",
        color: "#00B3C7",
        fontSize: 14,
        fontWeight: "bold",
        alignItems: "center",
        justifyContent: "space-between",
    };
    const groupBadgeStyles = {
        backgroundColor: "#EBECF0",
        borderRadius: "2em",
        color: "#172B4D",
        display: "inline-block",
        fontSize: 12,
        fontWeight: "normal",
        lineHeight: "1",
        minWidth: 1,
        padding: "0.16666666666667em 0.5em",
        textAlign: "center",
    };

    const formatGroupLabel = (data) => (
        <div style={groupStyles}>
            <span>{data.label}</span>
            <span style={groupBadgeStyles}>{data.options.length}</span>
        </div>
    );

    let options = isEmpty(props.options) ? [] : props.options;
    options = options.map((opt) => {
        const label = opt.label ? opt.label : opt.name || opt.names;
        return { ...opt, value: opt.value || opt.id, label: label };
    });

    return (
        <Select
            className={className}
            classNamePrefix={`ov-react-select`}
            name={name}
            options={options}
            formatGroupLabel={formatGroupLabel}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            isLoading={loading}
            noOptionsMessage={noOptionsMessage}
            isDisabled={isDisabled}
            onBlur={onBlur}
        />
    );
};

export default ReactSelect;
