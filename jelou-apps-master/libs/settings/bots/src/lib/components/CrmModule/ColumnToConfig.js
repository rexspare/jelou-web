import { CloseIcon } from "@apps/shared/icons";
import { mergeById } from "@apps/shared/utils";
import compact from "lodash/compact";
import first from "lodash/first";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import last from "lodash/last";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SelectSearch, { fuzzySearch } from "react-select-search";
import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";

const ColumnToConfig = (props) => {
    const { columnInfo, configInProcess, handleColumnChange, setShowSavingWarning, setConfigInProcess, notify, notifyError } = props;

    const { t } = useTranslation();
    const [checkIsRequired, setCheckIsRequired] = useState(false);
    const [checkMinChars, setCheckMinChars] = useState(false);
    const [checkMaxChars, setCheckMaxChars] = useState(false);
    const [minChars, setMinValue] = useState("");
    const [maxChars, setMaxValue] = useState("");
    const [format, setFormat] = useState("text");
    const [columnLabel, setColumnLabel] = useState("");
    const [columnName, setColumnName] = useState("");
    const [menuOptions, setMenuOptions] = useState([]);
    const [validations, setValidations] = useState([]);
    const [typeColumn, setTypeColumn] = useState("text");

    const disableSaveButton = !configInProcess;
    const { type, name, rules: columnRules } = columnInfo;

    const setConfiguration = () => {
        let validationsCopy = [...validations];
        setCheckMinChars(false);
        setCheckMaxChars(false);
        const rules = get(columnRules, "rules", "");
        const options = get(columnInfo, "options", []);
        !isEmpty(options) ? setMenuOptions(options) : setMenuOptions([]);
        const { isObligatory = false } = columnRules || {};
        let requiredObj = {
            label: "required",
            value: "required",
        };

        if (!validations.find((obj) => obj.label === "required")) {
            isObligatory && validationsCopy.push(requiredObj);
        } else {
            if (!isObligatory) {
                validationsCopy = validations.filter((validation) => validation.label !== "required");
            }
        }
        let rulesArray = rules.split("|");
        setCheckIsRequired(isObligatory);
        const formatValue = textFormatOptions.find((validation) => rulesArray.some((element) => element === validation.value));
        !isEmpty(formatValue) ? setFormat(formatValue.value) : setFormat("text");
        !isEmpty(type) ? setTypeColumn(type) : setTypeColumn("text");
        !isEmpty(name) ? setColumnLabel(name) : setColumnLabel("");
        !isEmpty(name) ? setColumnName(name) : setColumnName("");

        rulesArray.forEach((rule) => {
            const ruleName = first(rule.split(":"));
            if (ruleName === "digits") {
                const digits = last(rule.split(":"));
                let obj = {
                    label: "min",
                    value: `min:${digits}`,
                };
                validationsCopy = mergeById(validationsCopy, obj, "label");
                setValidations(validationsCopy);
                setCheckMinChars(true);
                setMinValue(digits);

                let obj2 = {
                    label: "max",
                    value: `max:${digits}`,
                };

                validationsCopy = mergeById(validationsCopy, obj2, "label");
                setValidations(validationsCopy);
                setCheckMaxChars(true);
                setMaxValue(digits);
            }
            if (ruleName === "digits_between") {
                const min = rule.split(":")[1].split(",")[0];
                const max = rule.split(":")[1].split(",")[1];
                let obj = {
                    label: "min",
                    value: `min:${min}`,
                };
                validationsCopy = mergeById(validationsCopy, obj, "label");
                setValidations(validationsCopy);
                setCheckMinChars(true);
                setMinValue(min);
                let obj2 = {
                    label: "max",
                    value: `max:${max}`,
                };
                validationsCopy = mergeById(validationsCopy, obj2, "label");
                setValidations(validationsCopy);
                setCheckMaxChars(true);
                setMaxValue(max);
            }

            if (ruleName === "min" || ruleName === "minDigits") {
                setCheckMinChars(true);
                setMinValue(last(rule.split(":")));
                let obj = {
                    label: "min",
                    value: `min:${last(rule.split(":"))}`,
                };
                validationsCopy = mergeById(validationsCopy, obj, "label");
                setValidations(validationsCopy);
            }
            if (ruleName === "max" || ruleName === "maxDigits") {
                let obj = {
                    label: "max",
                    value: `max:${last(rule.split(":"))}`,
                };

                validationsCopy = mergeById(validationsCopy, obj, "label");
                setValidations(validationsCopy);
                setCheckMaxChars(true);
                setMaxValue(last(rule.split(":")));
            }
        });
    };

    useEffect(() => {
        setConfiguration();
    }, [columnInfo]);

    const unsetCheckboxValidations = () => {
        let validationsCopy = [...validations];

        if (!isEmpty(validations)) {
            if (validations.find((obj) => obj.label === "min") && !checkMinChars) {
                setMinValue("");
                validationsCopy = validationsCopy.filter((validation) => validation.label !== "min");
            }
            if (validations.find((obj) => obj.label === "max") && !checkMaxChars) {
                setMaxValue("");
                validationsCopy = validationsCopy.filter((validation) => validation.label !== "max");
            }
            setValidations(validationsCopy);
        }
    };

    useEffect(() => {
        unsetCheckboxValidations();
    }, [checkMinChars, checkMaxChars]);

    const handleChangeValidation = (e) => {
        setConfigInProcess(true);

        const inputId = e.target.id;
        if (e.target.checked && (inputId === "checkMin" || inputId === "checkMax")) {
            let obj = {
                label: inputId === "checkMin" ? "min" : "max",
                value: "",
            };
            let validationsCopy = [...validations];
            validationsCopy.push(obj);
            setValidations(validationsCopy);
            return;
        }

        if (inputId === "minValue") {
            let filteredValidation = first(validations.filter((validation) => validation.label === "min"));
            filteredValidation.value = `min:${e.target.value}`;
            const finalValidation = mergeById(validations, filteredValidation, "label");
            setValidations(finalValidation);
        }
        if (inputId === "maxValue") {
            let filteredValidation = first(validations.filter((validation) => validation.label === "max"));
            filteredValidation.value = `max:${e.target.value}`;
            const finalValidation = mergeById(validations, filteredValidation, "label");
            setValidations(finalValidation);
        }
    };
    const parseValues = (values) => {
        if (format && !values.some((value) => value.includes(format))) {
            values.push(format);
        }

        if (format !== "numeric") return values;
        const min = values.find((value) => value.includes("min"));
        const max = values.find((value) => value.includes("max"));
        if (min && max) {
            const minNumber = min.split(":")[1];
            const maxNumber = max.split(":")[1];
            // iterate over string values and remove that values that includes min or max
            let filteredValues = [];
            values.forEach((value) => {
                if (value.includes("min") || value.includes("max")) {
                    return;
                } else {
                    return filteredValues.push(value);
                }
            });

            if (Number(minNumber) === Number(maxNumber)) {
                return [...filteredValues, `digits:${minNumber}`];
            } else {
                return [...filteredValues, `digits_between:${minNumber},${maxNumber}`];
            }
        }
        if (min && !max) {
            const minNumber = min.split(":")[1];
            let filteredValues = [];
            values.forEach((value) => {
                if (value.includes("min") || value.includes("max")) {
                    return;
                } else {
                    return filteredValues.push(value);
                }
            });

            return [...filteredValues, `minDigits:${minNumber}`];
        }
        if (!min && max) {
            const maxNumber = max.split(":")[1];
            let filteredValues = [];
            values.forEach((value) => {
                if (value.includes("min") || value.includes("max")) {
                    return;
                } else {
                    return filteredValues.push(value);
                }
            });
            return [...filteredValues, `maxDigits:${maxNumber}`];
        }
        return values;
    };

    const buildColumnPayload = () => {
        const values = compact(validations.map((validation) => validation.value));
        const formatedValues = parseValues(values);
        const columnInfoCopy = { ...columnInfo };
        let payload;
        delete columnInfoCopy.options;

        payload = {
            ...columnInfoCopy,
            name: columnName,
            label: columnLabel,
            ...(typeColumn === "select" ? { options: menuOptions } : {}),
            type: typeColumn,
            rules: {
                rules: formatedValues.join("|"),
                isObligatory: checkIsRequired,
            },
        };

        handleColumnChange(payload);
    };

    const handleSaveColumn = () => {
        const subject = /^-[0-9]+\d*$|^-+|^0+/;
        let save = true;
        if (checkMinChars && (minChars.match(subject) || isEmpty(minChars))) {
            notifyError(t("settings.crm.emptyField"));
            setInputWarning("minValue");
            save = false;
        } else {
            unsetInputWarning("minValue");
        }
        if (checkMaxChars && (maxChars.match(subject) || isEmpty(maxChars))) {
            notifyError(t("settings.crm.emptyField"));
            setInputWarning("maxValue");
            save = false;
        } else {
            unsetInputWarning("maxValue");
        }
        const allowSaving = () => {
            if (!save) {
                return;
            }

            buildColumnPayload();
            notify(t("settings.crm.changesColumnSave"));
            setShowSavingWarning(true);
            setConfigInProcess(false);
        };

        allowSaving();
    };

    // const validationOptions = [
    //     {
    //         value: "characters",
    //         name: t("Caracteres"),
    //     },
    //     {
    //         value: "value",
    //         name: t("Valor"),
    //     },
    // ];

    const typeOptions = [
        {
            value: "text",
            name: t("botsSettingsCategoriesSidebarElement.text"),
        },
        {
            value: "select",
            name: t("settings.crm.menuOpc"),
        },
        {
            value: "textbox",
            name: t("settings.crm.paragraph"),
        },
        {
            value: "date",
            name: t("SelectSend.date"),
        },
    ];

    const textFormatOptions = [
        {
            value: "text",
            name: t("botsSettingsCategoriesSidebarElement.text"),
        },
        {
            value: "email",
            name: t("shop.client.email"),
        },
        {
            value: "numeric",
            name: t("botsSettingsCategoriesSidebarElement.number"),
        },
    ];

    const handleChangecolumnName = ({ target }) => {
        setConfigInProcess(true);

        setColumnLabel(target.value);
        const slug = slugify(target.value, {
            replacement: "_",
            lower: true,
            strict: true,
        });
        setColumnName(slug);
    };

    const handleChangeFormat = (optionSelected) => {
        let validationsCopy = [...validations];
        if (optionSelected !== "" && optionSelected !== "text") {
            let formatObj = {
                label: "format",
                value: optionSelected,
            };

            if (!validationsCopy.find((obj) => obj.label === "format")) {
                validationsCopy.push(formatObj);
            } else {
                validationsCopy = mergeById(validationsCopy, formatObj, "label");
            }
        } else {
            validationsCopy = validationsCopy.filter((validation) => validation.value !== "text");
            validationsCopy = validationsCopy.filter((validation) => validation.value !== "email");
            validationsCopy = validationsCopy.filter((validation) => validation.value !== "numeric");
        }
        setConfigInProcess(true);
        setCheckMinChars(false);
        setCheckMaxChars(false);
        if (optionSelected !== "select") {
            setMenuOptions([]);
        }
        setFormat(optionSelected);
        setValidations(validationsCopy);
    };

    const setInputWarning = (id) => {
        let inputIncomplete;
        inputIncomplete = document.getElementById(id);
        inputIncomplete.classList.remove("border-none");
        inputIncomplete.classList.add("border-default", "border-red-500");
        inputIncomplete.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    };

    const unsetInputWarning = (id) => {
        let inputComplete;
        inputComplete = document.getElementById(id);
        const hasClass = inputComplete?.classList.contains("border-red-500");
        if (hasClass) {
            inputComplete.classList.remove("border-default", "border-red-500");
            inputComplete.classList.add("border-none");
        }
    };

    const handleSetIsRequired = (e) => {
        setConfigInProcess(true);

        let validationsCopy = [...validations];
        let requiredObj = {
            label: "required",
            value: "required",
        };

        if (!validations.find((obj) => obj.label === "required")) {
            e.target.checked && validationsCopy.push(requiredObj);
        } else {
            if (!e.target.checked) {
                validationsCopy = validations.filter((validation) => validation.label !== "required");
            }
        }

        setValidations(validationsCopy);
    };

    const handleChangeTypeColumn = (optionSelected) => {
        setConfigInProcess(true);
        setCheckMinChars(false);
        setCheckMaxChars(false);
        if (optionSelected !== "select") {
            setMenuOptions([]);
        }
        if (optionSelected !== "text") {
            setFormat("");
        } else {
            setFormat("text");
        }
        setTypeColumn(optionSelected);
    };

    const handleChangeOption = (evt, index) => {
        const field = {
            id: evt.target.id,
            value: evt.target.value,
            label: evt.target.value,
        };

        const mergedOptions = mergeById(menuOptions, field, "id");

        setMenuOptions(mergedOptions);
    };

    const handleDeleteOption = (optionId) => {
        const filteredOptions = menuOptions.filter((option) => option.id !== optionId);
        setMenuOptions(filteredOptions);
    };

    const handleAddField = () => {
        setConfigInProcess(true);

        const field = {
            id: uuidv4(),
            value: "",
        };

        setMenuOptions((prev) => [...prev, field]);
    };

    const getValidationType = (typeColumn) => {
        switch (typeColumn) {
            case "text":
                return getValidationFormat(format);
            case "select":
                return (
                    <div>
                        {menuOptions.map((option, index) => (
                            <label className="relative flex flex-col justify-center " key={index}>
                                <input
                                    required
                                    id={option.id}
                                    type="text"
                                    onChange={(evt) => handleChangeOption(evt)}
                                    value={option.value}
                                    placeholder={t("common.option")}
                                    className={`mt-1 w-full rounded-10 border-none bg-primary-700 text-15 font-normal placeholder:text-opacity-50 focus:border-transparent focus:ring-transparent focus-visible:outline-none`}
                                />
                                <button className="absolute right-2" onClick={() => handleDeleteOption(option.id)}>
                                    <CloseIcon className="cursor-pointer fill-current text-[#727C94] opacity-50" width="8" height="8" />
                                </button>
                            </label>
                        ))}

                        <button onClick={handleAddField} className="my-4 ml-8 text-primary-200">
                            + {t("settings.crm.addOpt")}
                        </button>
                    </div>
                );
            case "textbox":
                return getValidationOptions("characters");
            case "date":
                return;
            default:
                break;
        }
    };

    const getValidationOptions = (validationOption) => {
        switch (validationOption) {
            case "characters":
                return (
                    <>
                        <label className="flex cursor-pointer items-center gap-3 font-bold">
                            <input
                                id="checkMin"
                                onChange={(evt) => {
                                    setCheckMinChars(evt.target.checked);
                                    handleChangeValidation(evt);
                                }}
                                checked={checkMinChars}
                                type="checkbox"
                                className={`rounded-default border-primary-200 text-primary-200 focus:ring-transparent `}
                            />
                            <p className="w-full">{t("settings.crm.minChar")}</p>
                            <input
                                id="minValue"
                                disabled={!checkMinChars}
                                required={checkMinChars}
                                type="number"
                                min={0}
                                step={"1"}
                                pattern="^[-/d]/d*$"
                                value={minChars}
                                onChange={(evt) => {
                                    setMinValue(evt.target.value);
                                    handleChangeValidation(evt);
                                }}
                                placeholder={t("Min.")}
                                className={`mt-1 w-full rounded-10 border-none bg-primary-700 text-15 font-normal placeholder:text-opacity-50 focus:border-transparent focus:ring-transparent focus-visible:outline-none`}
                            />
                        </label>
                        <label className="flex cursor-pointer items-center gap-3 font-bold">
                            <input
                                id="checkMax"
                                onChange={(evt) => {
                                    setCheckMaxChars(evt.target.checked);
                                    handleChangeValidation(evt);
                                }}
                                value={checkMaxChars}
                                checked={checkMaxChars}
                                type="checkbox"
                                className={`rounded-default border-primary-200 text-primary-200 focus:ring-transparent `}
                            />
                            <p className="w-full">{t("settings.crm.maxChar")}</p>
                            <input
                                required
                                disabled={!checkMaxChars}
                                id="maxValue"
                                type="number"
                                min={0}
                                step={"1"}
                                pattern="^[-/d]/d*$"
                                onChange={(evt) => {
                                    setMaxValue(evt.target.value);
                                    handleChangeValidation(evt);
                                }}
                                value={maxChars}
                                placeholder={t("Max.")}
                                className={`mt-1 w-full rounded-10 border-none bg-primary-700 text-15 font-normal placeholder:text-opacity-50 focus:border-transparent focus:ring-transparent focus-visible:outline-none
                                      
                                    `}
                            />
                        </label>
                    </>
                );
            case "value":
                return (
                    <>
                        <label className="flex cursor-pointer items-center gap-3 font-bold">
                            <input type="checkbox" className={`rounded-default border-primary-200 text-primary-200 focus:ring-transparent `} />
                            <p className="w-full">{t("settings.crm.minValue")}</p>
                            <input
                                type="number"
                                min={0}
                                step={"1"}
                                pattern="^[-/d]/d*$"
                                placeholder={t("Min.")}
                                className={`mt-1 w-full rounded-10 border-none bg-primary-700 text-15 font-normal placeholder:text-opacity-50 focus:border-transparent focus:ring-transparent focus-visible:outline-none`}
                            />
                        </label>
                        <label className="flex cursor-pointer items-center gap-3 font-bold">
                            <input type="checkbox" className={`rounded-default border-primary-200 text-primary-200 focus:ring-transparent `} />
                            <p className="w-full">{t("settings.crm.maxValue")}</p>
                            <input
                                type="number"
                                min={0}
                                step={"1"}
                                pattern="^[-/d]/d*$"
                                placeholder={t("Max.")}
                                className={`mt-1 w-full rounded-10 border-none bg-primary-700 text-15 font-normal placeholder:text-opacity-50 focus:border-transparent focus:ring-transparent focus-visible:outline-none
                                      
                                    `}
                            />
                        </label>
                    </>
                );

            default:
                break;
        }
    };

    const getValidationFormat = (format) => {
        switch (format) {
            case "text":
            case "numeric":
                return (
                    <>
                        <label className="flex cursor-pointer items-center gap-3 font-bold">
                            <input
                                id="checkMin"
                                onChange={(evt) => {
                                    setCheckMinChars(evt.target.checked);
                                    handleChangeValidation(evt);
                                }}
                                checked={checkMinChars}
                                type="checkbox"
                                className={`rounded-default border-primary-200 text-primary-200 focus:ring-transparent `}
                            />
                            <p className="w-full">{t("settings.crm.minChar")}</p>
                            <input
                                id="minValue"
                                disabled={!checkMinChars}
                                required={checkMinChars}
                                type="number"
                                min={0}
                                step={"1"}
                                pattern="^[-/d]/d*$"
                                value={minChars}
                                onChange={(evt) => {
                                    setMinValue(evt.target.value);
                                    handleChangeValidation(evt);
                                }}
                                placeholder={t("Min.")}
                                className={`mt-1 w-full rounded-10 border-none bg-primary-700 text-15 font-normal placeholder:text-opacity-50 focus:border-transparent focus:ring-transparent focus-visible:outline-none`}
                            />
                        </label>
                        <label className="flex cursor-pointer items-center gap-3 font-bold">
                            <input
                                id="checkMax"
                                onChange={(evt) => {
                                    setCheckMaxChars(evt.target.checked);
                                    handleChangeValidation(evt);
                                }}
                                value={checkMaxChars}
                                checked={checkMaxChars}
                                type="checkbox"
                                className={`rounded-default border-primary-200 text-primary-200 focus:ring-transparent `}
                            />
                            <p className="w-full">{t("settings.crm.maxChar")}</p>
                            <input
                                required
                                disabled={!checkMaxChars}
                                id="maxValue"
                                type="number"
                                min={0}
                                step={"1"}
                                pattern="^[-/d]/d*$"
                                onChange={(evt) => {
                                    setMaxValue(evt.target.value);
                                    handleChangeValidation(evt);
                                }}
                                value={maxChars}
                                placeholder={t("Max.")}
                                className={`mt-1 w-full rounded-10 border-none bg-primary-700 text-15 font-normal placeholder:text-opacity-50 focus:border-transparent focus:ring-transparent focus-visible:outline-none
                                      
                                    `}
                            />
                        </label>
                    </>
                );

            // case "number":
            //     return (
            //         <div className="pt-3">
            //             {/* <div className="relative mb-4">
            //                 <SelectSearch
            //                     // disabled={disableHours || disableClick}
            //                     options={validationOptions}
            //                     className="moduleSelect timeSelect mt-3 text-sm"
            //                     filterOptions={fuzzySearch}
            //                     // value={validationOption}
            //                     search
            //                     // placeholder={t("schedule.select")}
            //                     // onChange={(value) => setValidationOption(value)}
            //                 />
            //             </div> */}
            //             {getValidationOptions(validationOption)}
            //         </div>
            //     );

            case "email":
                return;

            default:
                break;
        }
    };
    return (
        <form onSubmit={(evt) => evt.preventDefault()} className="grid gap-4 px-10 py-8 text-sm font-medium text-gray-400 text-opacity-75">
            <div className="rounded-1 border-0.5 border-gray-400 border-opacity-10 p-4">
                <label className="flex flex-col">
                    {t("datum.fieldName")}
                    <input
                        type="text"
                        onChange={handleChangecolumnName}
                        value={columnLabel}
                        placeholder={t("datum.placeholders.fieldName")}
                        className={`mt-1 w-full rounded-xs border-none bg-primary-700 text-15 font-normal placeholder:text-opacity-50 focus:border-transparent focus:ring-transparent focus-visible:outline-none`}
                    />
                </label>
                <div>
                    <div className="pt-3">
                        {t("datum.type")}
                        <div className="relative mb-4">
                            <SelectSearch
                                // disabled={disableHours || disableClick}
                                options={typeOptions}
                                className="moduleSelect timeSelect mt-3 text-sm"
                                filterOptions={fuzzySearch}
                                value={typeColumn}
                                search
                                // placeholder={t("schedule.select")}
                                onChange={(value) => handleChangeTypeColumn(value)}
                            />
                        </div>
                    </div>
                    {typeColumn === "text" && (
                        <div>
                            {t("settings.crm.format")}
                            <div className="relative mb-4">
                                <SelectSearch
                                    // disabled={disableHours || disableClick}
                                    options={textFormatOptions}
                                    className="moduleSelect timeSelect mt-3 text-sm"
                                    filterOptions={fuzzySearch}
                                    value={format}
                                    search
                                    // placeholder={t("schedule.select")}
                                    onChange={(value) => handleChangeFormat(value)}
                                />
                            </div>
                        </div>
                    )}

                    {/* <div>
                        <p className="text-15 text-gray-400 text-opacity-80">{typeColumn !== "select" ? t("Validacion") : t("Opciones")}</p>
                    </div> */}

                    {getValidationType(typeColumn)}

                    <label className="flex cursor-pointer items-center gap-3 pt-2 font-bold">
                        <input
                            // disabled={disableCheckFilter}

                            onChange={(evt) => {
                                handleSetIsRequired(evt);
                                setCheckIsRequired(evt.target.checked);
                            }}
                            value={checkIsRequired}
                            checked={checkIsRequired}
                            type="checkbox"
                            className={`rounded-default border-primary-200 text-primary-200 focus:ring-transparent `}
                        />
                        {t("settings.crm.obligatoryField")}
                    </label>
                </div>
                <footer className="flex w-full justify-end">
                    <button
                        disabled={disableSaveButton}
                        className="flex w-24 cursor-pointer items-center justify-center rounded-full border-1 border-primary-200 py-1 text-left text-primary-200 disabled:cursor-not-allowed"
                        onClick={(e) => {
                            handleSaveColumn();
                        }}
                        type="submit"
                    >
                        {t("buttons.save")}
                    </button>
                </footer>
            </div>
        </form>
    );
};

export default ColumnToConfig;
