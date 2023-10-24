import React from "react";
import { useTranslation } from "react-i18next";
import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";

const MultiCheckboxSelect = (props) => {
    const customStyles = {
        menulist: (provided, state) => ({
            ...provided,
            borderRadius: "1.5rem ",
        }),
        option: (provided, state) => ({
            ...provided,
            borderTop: "0.1px solid rgba(166, 180, 208, 0.15);",
        }),
        container: (provided, state) => ({
            ...provided,
            boxShadow: "0px 0px 7px rgba(127, 128, 156, 0.3)",
            borderRadius: ".9rem",
            zIndex: "999",
        }),
    };

    const { id, name, placeholderButtonLabel, options, value, onChange, isDisabled, active, showName } = props;
    const { t } = useTranslation();

    let className = props.className ? props.className : "bd-react-select";

    function getDropdownButtonLabel({ placeholderButtonLabel, value }) {
        if (value && value.some((o) => o.value === "*")) {
            return (
                <span className={`css-1v99tuv ${active ? "font-semibold text-primary-200" : ""}`}>
                    {showName ? `${placeholderButtonLabel}: ${t("AdminFilters.all")}` : t("AdminFilters.all")}
                </span>
            );
        } else {
            return (
                <span className={`css-1v99tuv ${active ? "font-semibold text-primary-200" : ""}`}>
                    {showName
                        ? `${placeholderButtonLabel}: ${value.length} ${t("usersForm.selection")}`
                        : `${value.length} ${t("usersForm.selection")}`}
                </span>
            );
        }
    }

    return (
        <ReactMultiSelectCheckboxes
            classNamePrefix={className}
            styles={customStyles}
            id={id}
            name={name}
            placeholderButtonLabel={placeholderButtonLabel}
            getDropdownButtonLabel={getDropdownButtonLabel}
            options={[{ label: t("AdminFilters.all"), value: "*" }, ...options]}
            value={value}
            onChange={onChange}
            isDisabled={isDisabled}
        />
    );
};

export default MultiCheckboxSelect;
