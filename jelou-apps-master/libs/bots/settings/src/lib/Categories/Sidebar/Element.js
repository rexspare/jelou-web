/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Input } from "@apps/shared/common";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

import get from "lodash/get";
import first from "lodash/first";
import last from "lodash/last";
import compact from "lodash/compact";

import { JelouLogoIcon, CloseIcon } from "@apps/shared/icons";
import slugify from "slugify";
import Tippy from "@tippyjs/react";
import { useTranslation } from "react-i18next";

const customStyles = {
    control: (base, state) => ({
        ...base,
        border: state.isFocused ? 0 : 0,
        backgroundColor: "unset",
        // This line disable the blue border
        boxShadow: state.isFocused ? 0 : 0,
        "&:hover": {
            border: state.isFocused ? 0 : 0,
        },
    }),
    multiValue: (styles, { data }) => {
        return {
            ...styles,
            backgroundColor: "#f2f8ff",
            borderRadius: "0.938rem",
        };
    },
    multiValueLabel: (styles, { data }) => ({
        ...styles,
        color: "grey",
    }),
};

const Element = (props) => {
    const { element } = props;
    const [name, setName] = useState(() => element.name || "");
    const [label, setLabel] = useState(() => element.label || "");
    const [type, setType] = useState(() => element.type || "text");
    const [option, setOption] = useState({});
    const [optionValue, setOptionValue] = useState("");
    const [validations, setValidations] = useState([]);
    const [options, setOptions] = useState(() => element.options || []);
    const [selectedValidationOptions, setSelectedValidationOptions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const { t } = useTranslation();

    const validationOptions = [
        {
            value: "required",
            label: t("botsSettingsCategoriesSidebarElement.required"),
        },
        {
            value: "numeric",
            label: t("botsSettingsCategoriesSidebarElement.number"),
        },
        { value: "min", label: t("botsSettingsCategoriesSidebarElement.min") },
        { value: "max", label: t("botsSettingsCategoriesSidebarElement.max") },
        { value: "email", label: t("botsSettingsCategoriesSidebarElement.email") },
    ];

    useEffect(() => {
        // Calculate rules
        const rules = get(element, "rules.rules", "");
        let rulesArray = rules.split("|");

        rulesArray = rulesArray.map((rule) => {
            const ruleName = first(rule.split(":"));
            const val = validationOptions.find((validation) => validation.value === ruleName);
            return {
                ...val,
                value: rule,
            };
        });

        rulesArray = compact(rulesArray);
        setValidations(rulesArray);

        const selectedValidations = rulesArray.map((rule) => {
            const ruleName = first(rule.value.split(":"));
            const val = validationOptions.find((validation) => validation.value === ruleName);

            if (!val) {
                return null;
            }

            let label = val.label;
            if (val.value === "min" || val.value === "max") {
                const ruleValue = last(rule.value.split(":"));
                label = `${label}: ${ruleValue}`;
            }

            return {
                value: val.value,
                label,
            };
        });

        setSelectedValidationOptions(compact(selectedValidations));
    }, [element]);

    useEffect(() => {
        buildElementPayload();
        //}, [label, type, validations]);
    }, [label, type, validations]);

    useEffect(() => {
        buildElementPayload();
    }, [options]);

    const handleSelectChange = (values, validation) => {
        if (validation.action === "remove-value") {
            return handleRemoveValue(validation);
        }

        const value = get(validation, "option.value");
        const option = get(validation, "option");
        setSelectedValidationOptions([...selectedValidationOptions, option]);
        switch (value) {
            case "min":
            case "max":
                setOption(option);
                setShowModal(true);
                break;
            default:
                setValidations([...validations, option]);
                break;
        }

        buildElementPayload();
    };

    const handleRemoveValue = (validation) => {
        const value = get(validation, "removedValue.value");

        // Remove from validations
        setValidations((validations) => {
            return validations.filter((item) => {
                const ruleName = first(item.value.split(":"));
                return value !== ruleName;
            });
        });

        // Remove from selected validations
        setSelectedValidationOptions((selectedValidationOptions) => {
            return selectedValidationOptions.filter((item) => {
                const ruleName = first(item.value.split(":"));
                return value !== ruleName;
            });
        });
    };

    const handleSetOptionValue = () => {
        const parsedOption = {
            ...option,
            value: `${option.value}:${optionValue}`,
        };

        setValidations([...validations, parsedOption]);

        // Mutate validations labels
        setSelectedValidationOptions(
            selectedValidationOptions.map((validation) => {
                if (validation.value === option.value) {
                    return {
                        ...validation,
                        label: `${validation.label}: ${optionValue}`,
                    };
                }

                return validation;
            })
        );

        setShowModal(false);
        buildElementPayload();
    };

    const handleNameChange = ({ target }) => {
        setLabel(target.value);
        const slug = slugify(target.value, {
            replacement: "_",
            lower: true,
            strict: true,
        });
        setName(slug);
    };

    const handleTypeChange = ({ target }) => {
        setType(target.value);
    };

    const buildElementPayload = () => {
        const isObligatory = !!validations.find((validation) => {
            return validation.value === "required";
        });

        const values = compact(validations.map((validation) => validation.value));

        let payload = {
            ...element,
            name,
            label,
            type,
            //...(type === "select" ? { options } : {}),
            rules: {
                rules: values.join("|"),
                isObligatory,
            },
        };
        if (type === "select") {
            payload.options = options;
        }

        props.handleElementChange(payload);
    };

    return (
        <div className="mb-10">
            <div className="w-full max-w-lg rounded-lg border-2 border-gray-45 py-6 px-8">
                <label className="mb-4 block">
                    <span className="mb-2 block font-bold text-gray-400">{t("botsSettingsCategoriesSidebarElement.name")}</span>
                    <Input
                        className="input-login"
                        type="text"
                        defaultValue={label}
                        placeholder={t("botsSettingsCategoriesSidebarElement.fieldName")}
                        onChange={handleNameChange}
                    />
                </label>
                <label className="mb-4 block">
                    <span className="mb-2 block font-bold text-gray-400">{t("botsSettingsCategoriesSidebarElement.type")}</span>
                    <select
                        className="input-login"
                        value={type}
                        onChange={handleTypeChange}
                        placeholder={t("botsSettingsCategoriesSidebarElement.selectType")}>
                        <option value="text">{t("botsSettingsCategoriesSidebarElement.text")}</option>
                        <option value="textbox">{t("botsSettingsCategoriesSidebarElement.paragraph")}</option>
                        <option value="select">{t("botsSettingsCategoriesSidebarElement.list")}</option>
                        <option value="date">{t("botsSettingsCategoriesSidebarElement.date")}</option>
                    </select>
                </label>

                {type === "select" && (
                    <label className="mb-4 block">
                        <span className="mb-2 block font-bold text-gray-400">{t("botsSettingsCategoriesSidebarElement.values")}</span>
                        <div className="multiSelect form-multiselect relative w-full rounded-full p-2">
                            <CreatableSelect
                                isClearable
                                value={options}
                                isMulti
                                styles={customStyles}
                                placeholder={t("botsSettingsCategoriesSidebarElement.addValues")}
                                onChange={(options) => {
                                    setOptions(options);
                                }}
                            />
                        </div>
                    </label>
                )}
                <label className="mb-4 block">
                    <span className="mb-2 block font-bold text-gray-400">{t("botsSettingsCategoriesSidebarElement.validation")}</span>
                    <div className="multiSelect form-multiselect relative w-full rounded-full p-2">
                        <Select
                            options={validationOptions}
                            value={selectedValidationOptions}
                            isMulti
                            styles={customStyles}
                            placeholder={t("botsSettingsCategoriesSidebarElement.selectValidation")}
                            onChange={handleSelectChange}
                        />
                    </div>
                </label>

                <div className="mt-8 flex justify-end">
                    <Tippy content={t("botsSettingsCategoriesSidebarElement.deleteElement")} placement={"bottom"} touch={false}>
                        <div>
                            <button onClick={() => props.handleElementDelete(element.id)}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    className="h-6 w-6 text-gray-400 hover:text-red-400"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                </svg>
                            </button>
                        </div>
                    </Tippy>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-x-0 top-0 z-50 overflow-auto sm:inset-0 sm:flex sm:items-center sm:justify-center">
                    <div className="fixed inset-0 transition-opacity" onClick={() => setShowModal(false)}>
                        <div className="absolute inset-0 z-20 bg-gray-490/75" />
                    </div>
                    <div className="w-full max-w-sm transform rounded-lg bg-white px-6 pt-5 pb-4 shadow-modal transition-all">
                        <div className="border-border-lighter mb-3 flex items-center justify-between border-b-1 pb-4 sm:mb-6">
                            <div className="flex items-center">
                                <div className="bg-primary mr-2 flex h-8 w-8 items-center justify-center rounded-full sm:h-10 sm:w-10 md:mr-4">
                                    <JelouLogoIcon width="1.875rem" height="2.5rem" />
                                </div>
                                <div className="text-lg font-medium text-gray-400">
                                    {t("botsSettingsCategoriesSidebarElement.insertValue")} {option.value === "max" ? "Máximo" : "Mínimo"}
                                </div>
                            </div>
                            <span onClick={() => setShowModal(false)}>
                                <CloseIcon className="cursor-pointer fill-current text-gray-75" width="1rem" height="1rem" />
                            </span>
                        </div>
                        <div className="relative">
                            <Input
                                className="input-login"
                                type="number"
                                value={optionValue}
                                placeholder={t("botsSettingsCategoriesSidebarElement.example")}
                                onChange={({ target }) => setOptionValue(target.value)}
                            />
                        </div>
                        <div className="mt-9 flex flex-col justify-end pb-4 md:flex-row">
                            <div className="mt-6 md:mt-0">
                                <button
                                    type="submit"
                                    className="w-32 rounded-20 border-1 border-transparent bg-gray-10 p-2 text-base font-bold text-gray-400 focus:outline-none"
                                    onClick={() => setShowModal(false)}>
                                    {t("botsSettingsCategoriesSidebarElement.cancel")}
                                </button>
                            </div>
                            <div className="mt-6 ml-3 md:mt-0">
                                <button type="submit" className="button-primary w-32" onClick={handleSetOptionValue}>
                                    {t("botsSettingsCategoriesSidebarElement.accept")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Element;
