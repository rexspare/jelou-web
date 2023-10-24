import { Combobox, Transition } from "@headlessui/react";
import {
    // CheckIcon,
    SelectorIcon,
} from "@heroicons/react/solid";
import { Fragment, useEffect, useRef, useState } from "react";

import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";

import { useOnClickOutside } from "@apps/shared/hooks";
import { CleanIcon } from "@apps/shared/icons";
import { useTranslation } from "react-i18next";

const ComboboxSelect = (props) => {
    const { label = "", icon = {}, handleChange, background, value, name, clearFilter, hasCleanFilter = true, className = "" } = props;

    const [selected, setSelected] = useState(value);
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();
    const dropdownRef = useRef();
    useOnClickOutside(dropdownRef, () => setOpen(false));
    const input = useRef();
    const [query, setQuery] = useState("");

    let options = props.options.map((option) => {
        const name = option.name || option.names;
        const value = option.value || option.id;
        return { ...option, name, value };
    });

    useEffect(() => {
        if (isEmpty(value)) {
            setSelected({});
        } else {
            setSelected(value);
        }
    }, [value]);

    let filteredOptions =
        query === ""
            ? options
            : options.filter((option) => option.name.toLowerCase().replace(/\s+/g, "").includes(query.toLowerCase().replace(/\s+/g, "")));

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
        <div className="flex w-full rounded-[0.8125rem]" ref={dropdownRef}>
            <Combobox value={selected} onChange={onChangeFinal}>
                <div className="relative w-full">
                    <div className="form cursor-pointer" onClick={onClick}>
                        <Combobox.Input
                            className={
                                className
                                    ? className
                                    : "form__input focus:ring-0 pointer-events-none w-full cursor-pointer truncate border-none py-2 !pr-8 pl-5  text-sm font-semibold leading-5 !text-primary-200"
                            }
                            placeholder="  "
                            autoComplete="off"
                            displayValue={(displayValue) => get(displayValue, "name", "")}
                            onChange={onChange}
                            ref={input}
                        />
                        {!isEmpty(label) && (
                            <label htmlFor="email" className={`form__label flex items-center`} style={{ backgroundColor: background }}>
                                {!isEmpty(icon) && <div className="pr-2">{icon}</div>}
                                {label}
                            </label>
                        )}
                        <Combobox.Button className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </Combobox.Button>
                    </div>
                    <Transition
                        show={open}
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => setQuery("")}>
                        <Combobox.Options
                            className="ring-1 ring-opacity-5 scrollcontainer absolute z-20 mt-1 max-h-xxsm w-full overflow-auto rounded-[0.8125rem] bg-white pt-1 text-base shadow-lg focus:outline-none sm:text-sm"
                            static>
                            {filteredOptions.length === 0 && query !== "" ? (
                                <div className="relative cursor-pointer select-none px-4 py-2 text-gray-400">Nothing found.</div>
                            ) : (
                                <>
                                    {filteredOptions.map((option, idx) => (
                                        <Combobox.Option
                                            key={option.id || idx}
                                            className={({ active }) =>
                                                `border-btm relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                                    active ? "bg-primary-200 text-white" : "bg-white text-gray-400"
                                                }`
                                            }
                                            value={option}>
                                            {({ selected, active }) => {
                                                let selectedFinal = isEqual(option, value);
                                                return (
                                                    <span
                                                        className={`block whitespace-pre-line break-words ${
                                                            selectedFinal && active
                                                                ? "font-medium text-white"
                                                                : selectedFinal
                                                                ? "font-medium text-primary-200"
                                                                : "font-normal"
                                                        }`}>
                                                        {option.name}
                                                    </span>
                                                );
                                            }}
                                        </Combobox.Option>
                                    ))}
                                    {hasCleanFilter && (
                                        <div
                                            className="sticky bottom-0 z-10 flex h-[2.625rem] cursor-pointer items-center justify-center bg-primary-600 px-5"
                                            onClick={cleanFilter}>
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

export default ComboboxSelect;
