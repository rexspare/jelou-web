import React, { Fragment, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CloseIcon } from "../../Icons";
import { isEmpty } from "lodash";
import { MainDataInput } from "../../pages/Home/ToolKits/types.toolkits";

type option = {
    value: string;
    label: string;
    order?: number;
};

type OptionsMenuProps = {
    input: MainDataInput;
    onChange: (option: option) => void;
    setInputConfig: React.Dispatch<React.SetStateAction<MainDataInput>>;
};

const OptionsMenu = (props: OptionsMenuProps) => {
    const { input, setInputConfig, onChange } = props;
    const { t } = useTranslation();
    const [OptionsFilter, setOptionsFilter] = useState<option[]>([]);
    const optionInputName = t("datum.options");
    const addMoreOption = `+ ${t("datum.addOption")}`;

    const { configuration } = input;
    const { enumList: OptionsToShow = [] } = configuration || {};

    const optionInputRef = useRef<HTMLInputElement>(null);

    const handleAddOptionFilter = (evt: React.FocusEvent<HTMLElement>) => {
        evt.preventDefault();

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
        onChange(option);
        optionInputRef.current.value = "";
    };

    const handleDeleteOptionFilter = (option: option) => {
        const enumList = configuration?.enumList || [];
        const newEnumList = enumList.filter((opt) => opt.value !== option.value);
        setInputConfig((prevState) => ({ ...prevState, configuration: { enumList: newEnumList } }));
    };

    return (
        <Fragment>
            <label>
                <span className="mb-1 block font-medium">{optionInputName}</span>
                <ol className="mt-1 flex flex-col gap-2" id={"configuration"}>
                    {OptionsToShow &&
                        OptionsToShow.map((option) => {
                            return (
                                <li key={option.value} className="flex w-full justify-between px-3 py-2">
                                    <span>• {option.label}</span>
                                    <button
                                        type="button"
                                        onClick={(evt) => {
                                            evt.preventDefault();
                                            evt.stopPropagation();
                                            handleDeleteOptionFilter(option);
                                        }}
                                        className="">
                                        <CloseIcon width={10} height={10} />
                                    </button>
                                </li>
                            );
                        })}
                </ol>
            </label>
            <input
                onBlur={handleAddOptionFilter}
                ref={optionInputRef}
                type="text"
                placeholder="Escribe una opción"
                className="h-8 w-full rounded-10 border-1 border-gray-330 bg-white px-2 py-6 pl-3 text-gray-400 placeholder:text-13 placeholder:font-semibold placeholder:text-gray-330 disabled:cursor-not-allowed disabled:bg-opacity-50"
            />
            <button className="my-4 w-32 text-left text-primary-200">{addMoreOption}</button>
        </Fragment>
    );
};

export default OptionsMenu;
