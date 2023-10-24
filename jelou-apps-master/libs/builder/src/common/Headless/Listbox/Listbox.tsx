import { Listbox, Transition } from "@headlessui/react";
import React from "react";

import { ChevronDown, SpinnerIcon } from "@builder/Icons";

export type ListBoxElement<T = string> = {
    id: number | string;
    name: string;
    value: T;
    description?: string;
    separator?: boolean;
    Icon?: React.FC<React.SVGProps<SVGSVGElement>>;
    disabled?: boolean;
    clickableOnDisabled?: boolean;
};

export type ListBoxHeadlessProps<T> = {
    list: ListBoxElement<T>[];
    label?: string;
    isLoading?: boolean;
    value?: ListBoxElement<T>;
    setValue?: React.Dispatch<React.SetStateAction<ListBoxElement<T>>> | ((optionSelected: ListBoxElement<T>) => void);
    slideover?: boolean;
    showDescription?: boolean;
    placeholder?: string;
    name?: string;
    defaultValue?: ListBoxElement<T>;
};

export const ListBoxHeadless = <T extends string>({
    list,
    label,
    value: valueProp,
    setValue,
    isLoading = false,
    slideover = false,
    showDescription = true,
    placeholder,
    name,
    defaultValue,
}: ListBoxHeadlessProps<T>) => {
    const [selected, setSelected] = React.useState<ListBoxElement<T> | undefined | null>(valueProp ?? defaultValue ?? null);

    const ValueIcon = selected?.Icon;

    const onChange = (optionSelected: ListBoxElement<T>) => {
        setSelected(optionSelected);
        setValue && setValue(optionSelected);
    };

    return (
        <div className={`flex w-full items-center ${slideover ? "justify-start" : "justify-center"}`}>
            <div className={`w-full ${slideover ? "" : "mx-auto max-w-xs"}`}>
                <input type="hidden" name={name} defaultValue={defaultValue?.value} value={selected?.value ?? ""} />
                <Listbox defaultValue={defaultValue} as="div" value={selected} onChange={onChange} className="space-y-1">
                    {({ open }) => (
                        <>
                            {label && <Listbox.Label className="mb-1 block font-medium leading-5">{label}</Listbox.Label>}
                            <div className="relative">
                                <span className="inline-block w-full rounded-md">
                                    <Listbox.Button
                                        className={`relative h-12 w-full cursor-pointer rounded-10 border-1 border-gray-330 bg-white px-2 pl-3 text-left transition duration-150 ease-in-out sm:text-sm sm:leading-5 ${
                                            !selected ? "text-gray-330" : ""
                                        }`}
                                    >
                                        <div className="flex w-full items-center justify-between">
                                            <div className="flex items-center justify-center">
                                                {ValueIcon && (
                                                    <div id="ValueIcon" className="mr-2">
                                                        <ValueIcon width={20} height={20} />
                                                    </div>
                                                )}
                                                <span className="block truncate">{selected?.name ?? placeholder}</span>
                                            </div>
                                            <span id="ChevronDownIcon" className="pointer-events-none flex items-center pr-2">
                                                <ChevronDown />
                                            </span>
                                        </div>
                                    </Listbox.Button>
                                </span>
                                <Transition
                                    show={open}
                                    leave="transition ease-in duration-100"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                    className="absolute z-20 mt-1 w-full rounded-md bg-white shadow-lg"
                                >
                                    <Listbox.Options static className="max-h-[22rem] overflow-auto rounded-10 text-base leading-6 shadow-xs focus:outline-none sm:text-sm sm:leading-5">
                                        {isLoading ? (
                                            <div className="grid h-screen items-start justify-center pt-2">
                                                <span className="text-primary-200">
                                                    <SpinnerIcon width={50} />
                                                </span>
                                            </div>
                                        ) : (
                                            list.map((element) => {
                                                const { id, name, description, Icon, separator, disabled, clickableOnDisabled = false } = element;
                                                const disabledStyles =
                                                    disabled && !clickableOnDisabled
                                                        ? "cursor-not-allowed opacity-50"
                                                        : disabled && clickableOnDisabled
                                                        ? "opacity-50 cursor-pointer hover:bg-gray-400/30"
                                                        : "cursor-pointer";

                                                return (
                                                    <Listbox.Option disabled={disabled && !clickableOnDisabled} key={id} value={element}>
                                                        {({ selected, active }) => (
                                                            <div
                                                                className={`
                                  ${active ? "bg-primary-600" : ""}
                                  ${separator ? "border-b-1 border-gray-330" : ""}
                                  ${disabledStyles}
                                  relative z-20 select-none py-2 pl-4 pr-4`}
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    {Icon && (
                                                                        <div
                                                                            className={`
                                          ${active || selected ? "text-primary-200" : "text-gray-400"}`}
                                                                        >
                                                                            <Icon width={22} height={22} />
                                                                        </div>
                                                                    )}
                                                                    <div className="flex flex-col">
                                                                        <span
                                                                            className={`
                                        ${selected ? "font-bold text-primary-200" : "font-normal"}
                                        ${(disabled && clickableOnDisabled) || !active ? "text-current" : "text-primary-200"}
                                        block truncate`}
                                                                        >
                                                                            {name}
                                                                        </span>
                                                                        {description && showDescription && <span className="text-xs">{description}</span>}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Listbox.Option>
                                                );
                                            })
                                        )}
                                    </Listbox.Options>
                                </Transition>
                            </div>
                        </>
                    )}
                </Listbox>
            </div>
        </div>
    );
};
