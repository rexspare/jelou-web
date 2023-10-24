/** @typedef {import('./types.priceData').CreatebleSelectorOptions} CreatebleSelectorOptions */
import { useState } from "react";
import { useTranslation } from "react-i18next";

import CreatableSelect from "react-select/creatable";

/**
 * @param {{
 * createCallback: (inputValue: string) => Promise<CreatebleSelectorOptions>,
 * options: CreatebleSelectorOptions[],
 * onChange: (option: CreatebleSelectorOptions) => void
 * }} props
 */
export const CreatebleSelector = ({ createCallback, options, onChange }) => {

    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);

    /** @param {CreatebleSelectorOptions} option */
    const handelChange = (option) => {
        onChange(option.value);
    };

    const handleCreate = (inputValue) => {
        setIsLoading(true);
        createCallback(inputValue).then(() => {
            setIsLoading(false);
        });
    };

    return (
        <div className="relative">
            <CreatableSelect
                formatCreateLabel={(inputValue) => `Crear nuevo tag: ${inputValue}`}
                value={null}
                onChange={handelChange}
                isDisabled={isLoading}
                isLoading={isLoading}
                onCreateOption={handleCreate}
                options={options}
                styles={handleStyles()}
                placeholder={t("shop.prices.tagsPlaceholder")}
            />
        </div>
    );
};

const handleStyles = () => ({
    container: () => ({ height: "2rem" }),
    dropdownIndicator: () => ({ display: "none" }),
    valueContainer: () => ({
        position: "relative",
        width: "15rem",
    }),
    clearIndicator: () => ({ display: "none" }),
    control: () => ({
        width: "15rem",
        display: "flex",
        border: "1px solid #00B3C7",
        borderRadius: "999999999px",
        height: "2rem",
        paddingLeft: "0.5rem",
    }),
    menu: () => ({
        borderRadius: "0.625rem",
        boxShadow: "0rem 0rem 0.625rem rgba(127, 128, 156, 0.15)",
        top: "2.5rem",
        position: "absolute",
        boxSizing: "border-box",
        width: "15rem",
        marginLeft: "4px",
        zIndex: 1,
        overflow: "hidden",
        backgroundColor: "white",
        maxHeight: "13rem",
    }),
    menuList: () => ({ top: "100%", backgroundColor: "white", maxHeight: "13rem", overflowY: "scroll" }),
    option: (_, { isSelected }) => ({
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
    }),
    input: () => ({ position: "absolute", top: "0.125rem" }),
    placeholder: () => ({
        height: "2rem",
        paddingTop: "0.125rem",
        color: "#a0aebf",
        fontWeight: "400",
    }),
    indicatorSeparator: () => ({ display: "none" }),
});
