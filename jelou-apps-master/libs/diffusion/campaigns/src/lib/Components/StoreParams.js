import React, { useEffect, useState } from "react";
import first from "lodash/get";
import isEmpty from "lodash/get";
import { useTranslation } from "react-i18next";
import { TextFilter, ComboboxSelect } from "@apps/shared/common";

const StoreParams = (props) => {
    const { arrayParams, storeParam, removeStoreParams, updateStoreParams } = props;
    const { nameField, fieldNumber } = storeParam;
    const [field, setField] = useState({});

    useEffect(() => {
        const field = arrayParams.find((field) => field.id === fieldNumber);
        setField(field);
    }, [fieldNumber]);

    useEffect(() => {
        if (!isEmpty(arrayParams) && storeParam.field === "") {
            const column = first(arrayParams);
            if (column) {
                updateStoreParams(storeParam.id, {
                    ...storeParam,
                    field: column.title,
                });
            }
        }
    }, [arrayParams, storeParam, updateStoreParams]);

    const handleChange = (target) => {
        const { value } = target;
        const tmpParams = {
            ...storeParam,
        };

        if (typeof target === "string") {
            tmpParams.nameField = target;
        } else {
            tmpParams.fieldNumber = target.id;
            tmpParams.field = target.name;
            const field = arrayParams.find((field) => field.id === value);
            setField(field);
        }
        updateStoreParams(storeParam.id, tmpParams);
    };

    const { t } = useTranslation();

    return (
        <div className="border-options relative mb-4 flex max-w-xl items-center rounded-md border-1 p-3">
            <div className="mr-1 flex flex-1 flex-col">
                {/* <label
                    htmlFor="name"
                    className="relative mb-px pl-1 text-left text-xs font-medium uppercase tracking-wider text-gray-400 text-opacity-75"
                >
                    {t("StoreParams.fieldName")}
                </label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    value={nameField}
                    className="input-date outline-none"
                    placeholder={t("StoreParams.name")}
                    onChange={handleChange}
                /> */}
                <TextFilter filter={"text"} onChange={handleChange} background={"#fff"} label={t("StoreParams.name")} value={nameField} />
            </div>

            <div className="relative ml-1 flex flex-1 flex-col">
                <ComboboxSelect
                    options={arrayParams}
                    value={field}
                    label={t("StoreParams.field")}
                    handleChange={handleChange}
                    name={"field"}
                    background={"#fff"}
                    hasCleanFilter={false}
                />
            </div>

            <button
                className="hover:text-red-grad-500 absolute top-0 right-0 -mt-2 -mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-400 text-opacity-75 shadow-md"
                onClick={() => removeStoreParams(storeParam.id)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                </svg>
            </button>
        </div>
    );
};

export default StoreParams;
