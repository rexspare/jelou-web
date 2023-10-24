import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { Fragment, useEffect, useRef, useState } from "react";

import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import some from "lodash/some";

import { useOnClickOutside } from "@apps/shared/hooks";
import { CleanIcon } from "@apps/shared/icons";
import { useTranslation } from "react-i18next";

// value: array of object(s)
// options: array of object(s)
// handleChange send the array of objects

const MultiFormCombobox = (props) => {
    const { label = "", handleChange, background, value, clearFilter, hasCleanFilter = true, className = "", placeholder, hasAllOption = false, position = "bottom" } = props;
    const [selected, setSelected] = useState(value);
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();
    const dropdownRef = useRef();

    const menuPosition = position === "top" ? "-top-2 origin-top-right -translate-y-full transform" : null;

    useOnClickOutside(dropdownRef, () => {
        setSelected(value);
        setOpen(false);
    });
    const input = useRef();
    const [query, setQuery] = useState("");

    useEffect(() => {
        if (isEmpty(value)) {
            input.current.value = "";
            setSelected([]);
        }
    }, [value]);

    let options = hasAllOption ? [{ id: -1, value: -1, name: "Todos" }, ...props.options] : props.options;

    let noOptionsMessage = props.noOptionsMessage ? props.noOptionsMessage : t("common.No hay opciones disponibles");

    const filteredOptions = query === "" ? options : options.filter((option) => option.name.toLowerCase().replace(/\s+/g, "").includes(query.toLowerCase().replace(/\s+/g, "")));

    useEffect(() => {
        if (!open) {
            setQuery("");
            if (!isEmpty(selected) && selected !== undefined) {
                if (selected.length === 1) {
                    input.current.value = selected[0].name;
                } else {
                    input.current.value = `${selected.length} ${t("MassAchivePost.titleResult")}`;
                }
            }
        }
        if (open) {
            setQuery("");
            input.current.focus();
        }
    }, [open]);

    useEffect(() => {
        if (!isEmpty(value)) {
            input.current.selectionStart = input.current.value.length;
            input.current.selectionEnd = input.current.value.length;
            setSelected(value);
            if (value.length === 1) {
                input.current.value = value[0].name;
            } else {
                input.current.value = `${value.length} ${t("MassAchivePost.titleResult")}`;
            }
        }
    }, [value]);

    const onChangeFinal = (event) => {
        let selection = [];
        let updateSelection = [];
        if (isEmpty(selected)) {
            if (event.id === -1) {
                selection = options;
            } else {
                selection = [event];
            }
        } else {
            if (event.id === -1) {
                const optionsF = [...options];
                if (selected.length === optionsF.length) {
                    selection = [];
                } else {
                    selection = options;
                }
            } else if (some(selected, event)) {
                updateSelection = selected.filter((op) => op.id !== event.id);
                updateSelection = updateSelection.filter((op) => op.id !== -1);
                selection = updateSelection;
            } else {
                let array = [...selected, event];
                const allOptions = options.length - 1;
                if (allOptions === array.length) {
                    array = options;
                }
                selection = array;
            }
        }
        if (input.current.value) {
            setQuery("");
        }
        setSelected(selection);
        handleChange(selection);
    };

    const onClick = () => {
        input.current.value = "";
        setQuery("");
        input.current.focus();
        setOpen(true);
    };

    const onChange = (event) => {
        setQuery(event.target.value);
    };

    const cleanFilter = () => {
        clearFilter();
        handleChange([]);
        setSelected([]);
        setOpen(false);
        input.current.value = "";
    };

    return (
        <div className="flex w-full rounded-xs" ref={dropdownRef}>
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
                            displayValue={(displayValue) => {
                                return !isEmpty(displayValue) && displayValue.length > 1
                                    ? `${displayValue.length} ${t("MassAchivePost.titleResult")}`
                                    : !isEmpty(displayValue)
                                    ? get(displayValue[0], "name", "")
                                    : "";
                            }}
                            onChange={onChange}
                            ref={input}
                        />
                        {!isEmpty(label) && (
                            <label htmlFor="email" className={`flex items-center`} style={{ backgroundColor: background }}>
                                {label}
                            </label>
                        )}
                        <Combobox.Button className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </Combobox.Button>
                    </div>
                    <Transition show={open} as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0" afterLeave={() => setQuery("")}>
                        <Combobox.Options
                            className={`${menuPosition}"ring-1 ring-opacity-5 scrollcontainer sm:text-sm" absolute right-0 z-20 mt-1 max-h-xxsm w-full overflow-auto rounded-[0.8125rem] bg-white pt-1 text-base shadow-lg focus:outline-none`}
                            static
                        >
                            {filteredOptions.length === 0 ? (
                                <div className="relative cursor-pointer select-none px-4 py-2 text-gray-400">{t(noOptionsMessage)}</div>
                            ) : filteredOptions.length === 0 && query !== "" ? (
                                <div className="relative cursor-pointer select-none px-4 py-2 text-gray-400">{t(noOptionsMessage)}</div>
                            ) : (
                                <>
                                    {filteredOptions.map((option) => {
                                        return (
                                            <Combobox.Option
                                                key={option.id}
                                                className={({ active }) => `border-btm relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? "bg-primary-200 text-white" : "text-gray-400"}`}
                                                value={option}
                                            >
                                                {({ active }) => (
                                                    <>
                                                        <span
                                                            className={`block whitespace-pre-line ${
                                                                some(selected, option) && active
                                                                    ? "bg-primary-200 font-medium text-white"
                                                                    : some(selected, option)
                                                                    ? "font-medium text-primary-200"
                                                                    : "font-normal"
                                                            }`}
                                                        >
                                                            {option.name}
                                                        </span>
                                                        {some(selected, option) ? (
                                                            <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? "text-white" : "text-primary-200"}`}>
                                                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                            </span>
                                                        ) : null}
                                                    </>
                                                )}
                                            </Combobox.Option>
                                        );
                                    })}
                                    {hasCleanFilter && (
                                        <div
                                            className="shadow-outline1 sticky bottom-0 z-10 flex h-[2.625rem] cursor-pointer items-center justify-center bg-primary-600 px-5 font-bold text-primary-200"
                                            onClick={cleanFilter}
                                        >
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
        </div>
    );
};

export default MultiFormCombobox;
