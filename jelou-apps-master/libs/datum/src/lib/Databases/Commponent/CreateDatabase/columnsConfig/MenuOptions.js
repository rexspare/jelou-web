import { CloseIcon, ErrorIcon } from "@apps/shared/icons";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export function OpctionsMenu({ hasError = null, onChange = () => null, savedOptions = [] } = {}) {
    const [OptionsFilter, setOptionsFilter] = useState(savedOptions);
    const { t } = useTranslation();
    const optionInput = useRef(null);

    const handleDeleteOptionFilter = (option) => {
        setOptionsFilter((preState) => preState.filter((opt) => opt.value !== option.value));
    };

    const handleAddOptionFilter = (evt) => {
        evt.preventDefault();

        const inputValue = optionInput.current.value;
        if (inputValue === "") {
            return;
        }

        const option = {
            name: inputValue,
            value: inputValue,
            order: OptionsFilter.length,
        };

        setOptionsFilter((preState) => [...preState, option]);
        onChange(option);
        optionInput.current.value = "";
    };

    return (
        <div className="mt-2">
            <label>
                {t("datum.options")}
                <div className="flex flex-col gap-2 mt-1">
                    {OptionsFilter &&
                        OptionsFilter.map((option) => {
                            return (
                                <div key={option.value} className="flex justify-between w-full px-3 py-2">
                                    <span>• {option.name}</span>
                                    <button
                                        type="button"
                                        onClick={(evt) => {
                                            evt.preventDefault();
                                            evt.stopPropagation();
                                            handleDeleteOptionFilter(option);
                                        }}
                                        className="">
                                        <CloseIcon width="10px" height="10px" fill="currentColor" />
                                    </button>
                                </div>
                            );
                        })}
                </div>
            </label>

            <div className="mt-2">
                <input
                    onBlur={handleAddOptionFilter}
                    ref={optionInput}
                    name="optionFilter"
                    type="text"
                    placeholder="Escribe una opción"
                    className="w-full mt-1 font-normal border-none rounded-10 bg-primary-700 placeholder:text-opacity-50 focus:border-transparent focus:ring-transparent focus-visible:outline-none"
                />
                {hasError && (
                    <div className="flex items-center gap-2 font-medium">
                        <ErrorIcon /> <span className="text-red-1010">{hasError}</span>
                    </div>
                )}
                <button onClick={handleAddOptionFilter} className="my-4 text-primary-200">
                    + {t("datum.addOption")}
                </button>
            </div>
        </div>
    );
}
