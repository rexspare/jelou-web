import { isEmpty } from "lodash";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { CloseIcon } from "@builder/Icons";
import { InputErrorMessage } from "@builder/common/inputs";
import { SelectOption } from "@builder/modules/workflow/doamin/workflow.domain";

type option = {
    value: string;
    label: string;
    order?: number;
};

export interface OptionsArrayProps {
    label: string;
    typeInput: string;
    variable: string;
    hasError: string | null;
    defaultValue?: option[];
}

export default function OptionsArray(props: OptionsArrayProps) {
    const { label, typeInput, variable, hasError, defaultValue } = props;
    const [optionsArray, setOptionsArray] = useState<option[]>(defaultValue || []);

    const { t } = useTranslation();
    const [OptionsFilter, setOptionsFilter] = useState<option[]>([]);
    const addMoreOption = `+ ${t("datum.addOption")}`;

    const optionInputRef = useRef<HTMLInputElement>(null);

    const handleAddOption = (option: SelectOption) => {
        setOptionsArray((prevState) => [...prevState, option]);
    };

    const handleAddOptionFilter = (evt: React.FocusEvent<HTMLElement>) => {
        evt.preventDefault();
        evt.stopPropagation();

        const inputValue = optionInputRef.current?.value || "";

        if (isEmpty(inputValue) || isEmpty(optionInputRef) || isEmpty(optionInputRef.current)) {
            return;
        }

        const option: option = {
            value: inputValue,
            label: inputValue,
            order: OptionsFilter.length,
        };

        setOptionsFilter((prevState) => [...prevState, option]);
        handleAddOption(option);
        optionInputRef.current.value = "";
    };

    const handleDeleteOptionFilter = (option: option) => {
        setOptionsArray((prevState) => prevState.filter((opt) => opt.value !== option.value));
    };

    const button = (evt: React.MouseEvent<HTMLElement>) => {
        evt.preventDefault();
    };

    return (
        <>
            <label>
                <span className="mb-1 block font-medium">{label}</span>
                <ol className="mt-1 flex flex-col gap-2" id={"configuration"}>
                    {optionsArray &&
                        optionsArray.map((option) => {
                            return (
                                <li key={option.value} className="flex w-full justify-between px-3 py-2">
                                    <span className="flex">
                                        • <input readOnly={true} value={option.label} name={`${variable}`} />
                                    </span>
                                    <button
                                        type="button"
                                        onClick={(evt) => {
                                            evt.preventDefault();
                                            evt.stopPropagation();
                                            handleDeleteOptionFilter(option);
                                        }}
                                    >
                                        <CloseIcon width={10} height={10} />
                                    </button>
                                </li>
                            );
                        })}
                </ol>
                <input
                    onBlur={handleAddOptionFilter}
                    ref={optionInputRef}
                    type={typeInput}
                    placeholder="Escribe una opción"
                    className="h-8 w-full rounded-10 border-1 border-gray-330 bg-white px-2 py-6 pl-3 text-gray-400 placeholder:text-13 placeholder:font-semibold placeholder:text-gray-330 disabled:cursor-not-allowed disabled:bg-opacity-50"
                />
            </label>
            <button onClick={button} className="my-1 w-32 text-left text-primary-200">
                {addMoreOption}
            </button>
            {hasError && <InputErrorMessage hasError={hasError} />}
        </>
    );
}
