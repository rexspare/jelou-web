import { Combobox, Transition } from "@headlessui/react";
import { SelectorIcon } from "@heroicons/react/solid";
import { Fragment, useEffect, useRef, useState } from "react";

import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";

import { useOnClickOutside } from "@apps/shared/hooks";
import { CleanIcon } from "@apps/shared/icons";
import { useTranslation } from "react-i18next";
import { BeatLoader } from "react-spinners";

import { useParams } from "react-router-dom";

const FormComboboxSelect = (props) => {
    const { label = "", handleChange, placeholder, background, value, defaultDatabase, name, clearFilter, hasCleanFilter = true, className = "", loading, positionTop = false } = props;

    const [selected, setSelected] = useState(value);
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();
    const dropdownRef = useRef();
    useOnClickOutside(dropdownRef, () => setOpen(false));
    const input = useRef();
    const [query, setQuery] = useState("");

    const { databaseId } = useParams();

    useEffect(() => {
        if (isEmpty(value)) {
            setSelected({});
        } else {
            setSelected(value);
        }
    }, [value]);

    const filteredOptions = query === "" ? props.options : props.options.filter((option) => String(option.name).toLowerCase().replace(/\s+/g, "").includes(query.toLowerCase().replace(/\s+/g, "")));

    useEffect(() => {
        if (!open) {
            setQuery("");
            if (!isEmpty(selected) && selected !== undefined) {
                input.current.value = selected.name;
            }
        }
        if (open) {
            setQuery("");
            input.current.focus();
        }
    }, [open]);

    useEffect(() => {
        if (!isEmpty(selected)) {
            input.current.selectionStart = input.current.value.length;
            input.current.selectionEnd = input.current.value.length;
        }
    }, [selected, open]);

    useEffect(() => {
        if (databaseId) {
            input.current.value = defaultDatabase?.name;
            input.current.disabled = true;
        }
    }, []);

    const onChangeFinal = (event) => {
        setSelected(event);
        handleChange(event);
        setOpen(false);
    };

    const onClick = () => {
        input.current.value = "";
        setOpen(!open);
    };

    const onChange = (event) => {
        setQuery(event.target.value);
    };

    const cleanFilter = () => {
        clearFilter(name);
        setSelected({});
        setOpen(false);
        input.current.value = "";
    };

    return (
        <div className="flex w-full rounded-xs" ref={dropdownRef}>
            {databaseId && (
                <Combobox>
                    <div className="relative w-full">
                        <div className="cursor-pointer">
                            <Combobox.Input
                                className={
                                    className
                                        ? className
                                        : "h-34 w-full flex-1 rounded-xs border-transparent bg-primary-700 px-2 text-15 text-gray-400 outline-none ring-transparent focus:border-transparent focus:ring-transparent"
                                }
                                placeholder={placeholder}
                                autoComplete="off"
                                displayValue={(displayValue) => get(displayValue, "name", "")}
                                ref={input}
                            />
                        </div>
                    </div>
                </Combobox>
            )}
            {!databaseId && (
                <Combobox value={selected} onChange={onChangeFinal}>
                    <div className="relative w-full">
                        <div className="cursor-pointer" onClick={onClick}>
                            <Combobox.Input
                                className={
                                    className
                                        ? className
                                        : "h-34 w-full flex-1 rounded-xs border-transparent bg-primary-700 px-2 text-15 text-gray-400 outline-none ring-transparent focus:border-transparent focus:ring-transparent"
                                }
                                placeholder={placeholder}
                                autoComplete="off"
                                displayValue={(displayValue) => get(displayValue, "name", "")}
                                onChange={onChange}
                                ref={input}
                            />

                            {!isEmpty(label) && (
                                <label htmlFor="email" className={`form__label flex`} style={{ backgroundColor: background }}>
                                    {label}
                                </label>
                            )}
                            <Combobox.Button className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </Combobox.Button>
                        </div>
                        <Transition show={open} as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0" afterLeave={() => setQuery("")}>
                            <Combobox.Options
                                className={`ring-1 ring-opacity-5 absolute z-20 mt-1 max-h-xxsm w-full overflow-auto rounded-[0.8125rem] bg-white pt-1 text-base shadow-lg focus:outline-none sm:text-sm ${
                                    positionTop ? "bottom-4.5" : ""
                                }`}
                                static
                            >
                                {loading ? (
                                    <div className="text-gray-400t relative cursor-pointer select-none px-4 py-2">
                                        <BeatLoader color={"#a6b4d03f"} size={10} />
                                    </div>
                                ) : filteredOptions.length === 0 && query !== "" ? (
                                    <div className="relative cursor-pointer select-none px-4 py-2 text-gray-400">Nothing found.</div>
                                ) : (
                                    <>
                                        {filteredOptions.map((option) => {
                                            let selectedFinal = isEqual(option, value);
                                            // eslint-disable-next-line no-prototype-builtins
                                            let exists = option.hasOwnProperty("isdisabled");
                                            let isDisable = exists ? (option) => option.isdisabled : false;
                                            return (
                                                <Combobox.Option
                                                    key={option.id}
                                                    className={({ active }) =>
                                                        `border-btm relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? "bg-primary-200 text-white" : "text-gray-400"} ${
                                                            isDisable ? "!bg-gray-5 text-gray-340" : ""
                                                        }`
                                                    }
                                                    value={option}
                                                    disabled={isDisable}
                                                >
                                                    {({ selected, active }) => {
                                                        return (
                                                            <span
                                                                className={`block whitespace-pre-line ${
                                                                    selectedFinal && active ? "font-medium text-white" : selectedFinal ? "font-medium text-primary-200" : "font-normal"
                                                                }  ${isDisable ? "text-gray-17" : ""} `}
                                                            >
                                                                {option.name}
                                                            </span>
                                                        );
                                                    }}
                                                </Combobox.Option>
                                            );
                                        })}
                                        {hasCleanFilter && (
                                            <div className="sticky bottom-0 z-10 flex h-[2.625rem] cursor-pointer items-center justify-center bg-primary-600 px-5" onClick={cleanFilter}>
                                                <span className="flex flex-row space-x-3 font-bold text-primary-200">
                                                    <CleanIcon className="fill-current text-primary-200" width="0.844rem" height="1.178rem" />
                                                    <span>{t("clients.clean")}</span>
                                                </span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </Combobox.Options>
                        </Transition>
                    </div>
                </Combobox>
            )}
        </div>
    );
};

export default FormComboboxSelect;
