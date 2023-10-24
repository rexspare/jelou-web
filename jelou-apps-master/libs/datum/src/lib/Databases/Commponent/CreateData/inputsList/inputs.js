import { useCallback, useState } from "react";

import { DateInput } from "./Date";
import { DateTimeInput } from "./DateTime";
import { NumberInput } from "./Number";
import { ACTION_MODALS, OPTIONS_INPUT_BOOLEAN, TYPES_COLUMN } from "../../../../constants";
import { SelectFormInput } from "@apps/shared/common";
import { TextInput } from "./Text";
import FileInput from "./Files";
import TimeInput from "./Time";
import { getOptionsKeyword } from "./utils";

const InputList = ({ setDisableButtonCreateData = () => null, oneDataBase, dispatch, dataRows = {}, actionModal = null } = {}) => {
    const [valueBoolean, setValueBoolean] = useState({});

    const handleChangeDataForm = useCallback(({ value, name, type }) => {
        dispatch({ type, name, value });
    }, []);

    const handleBooleanChange = ({ optionSelected, key, type }) => {
        setValueBoolean((preState) => ({ ...preState, [key]: optionSelected }));
        handleChangeDataForm({ value: optionSelected.value, name: key, type });
    };

    return (
        oneDataBase &&
        oneDataBase.columns.length > 0 &&
        oneDataBase.columns.map((column) => {
            const { name, key, isRequired, id, type, isEditable = true } = column || {};
            const isDisable = actionModal === ACTION_MODALS.UPDATE && isEditable === false;

            switch (type) {
                case TYPES_COLUMN.double:
                case TYPES_COLUMN.integer:
                    return (
                        <div key={key + id}>
                            <NumberInput
                                defaultValue={dataRows[key]}
                                handleChangeDataForm={handleChangeDataForm}
                                isRequired={isRequired}
                                keyInput={key}
                                name={name}
                                type={type}
                                isDisable={isDisable}
                            />
                        </div>
                    );

                case TYPES_COLUMN.keyword: {
                    const optionsSelect = getOptionsKeyword(name, oneDataBase.filters);
                    const defaultValue = optionsSelect.find((option) => option.value === dataRows[key]) || null;
                    return (
                        <label key={key + id}>
                            {name}
                            <div className="mb-4">
                                <SelectFormInput
                                    keyInput={key}
                                    onChange={handleBooleanChange}
                                    options={optionsSelect}
                                    placeholder={defaultValue ? defaultValue.value : name}
                                    type={type}
                                    isDisable={isDisable}
                                    value={valueBoolean[key]}
                                />
                            </div>
                        </label>
                    );
                }
                case TYPES_COLUMN.text:
                    return (
                        <div key={key + id}>
                            <TextInput
                                defaultValue={dataRows[key]}
                                handleChangeDataForm={handleChangeDataForm}
                                id={id}
                                isRequired={isRequired}
                                keyInput={key}
                                name={name}
                                type={type}
                                isDisable={isDisable}
                            />
                        </div>
                    );

                case TYPES_COLUMN.date:
                    return (
                        <label key={key + id}>
                            {name}
                            <DateInput
                                defaultValue={dataRows[key]}
                                handleChangeDataForm={handleChangeDataForm}
                                isRequired={isRequired}
                                keyInput={key}
                                label={name}
                                type={type}
                                isDisable={isDisable}
                            />
                        </label>
                    );

                case TYPES_COLUMN.dateTime:
                    return (
                        <label key={key + id}>
                            {name}
                            <DateTimeInput
                                onChange={handleChangeDataForm}
                                isDisable={isDisable}
                                defaultValue={dataRows[key]}
                                name={key}
                                label={name}
                                type={type}
                            />
                        </label>
                    );

                case TYPES_COLUMN.time:
                    return (
                        <div key={key + id} className="mb-4">
                            {name}
                            <TimeInput isDisable={isDisable} defaultValue={dataRows[key]} type={type} name={key} onChange={handleChangeDataForm} />
                        </div>
                    );

                case TYPES_COLUMN.file: {
                    const isUpdatingData = typeof dataRows[key] !== "undefined";
                    const urlArray = isUpdatingData ? dataRows[key].split(",") : [];

                    return (
                        <label key={key + id}>
                            {name}
                            <FileInput
                                isDisable={isDisable}
                                databaseSlug={oneDataBase.slug}
                                handleChangeDataForm={handleChangeDataForm}
                                key={key + id}
                                linkList={urlArray}
                                name={key}
                                setDisableButtonCreateData={setDisableButtonCreateData}
                                type={type}
                            />
                        </label>
                    );
                }
                case TYPES_COLUMN.boolean: {
                    const defaultValue = OPTIONS_INPUT_BOOLEAN.find((option) => option.value === dataRows[key]) || null;
                    const options = getOptionsKeyword(name, oneDataBase.filters);

                    return (
                        <label key={key + id}>
                            {name}
                            <div className="mb-4">
                                <SelectFormInput
                                    isDisable={isDisable}
                                    keyInput={key}
                                    onChange={handleBooleanChange}
                                    options={options}
                                    placeholder={name}
                                    type={type}
                                    value={defaultValue ?? valueBoolean[key]}
                                />
                            </div>
                        </label>
                    );
                }
                default:
                    return null;
            }
        })
    );
};

export default InputList;
