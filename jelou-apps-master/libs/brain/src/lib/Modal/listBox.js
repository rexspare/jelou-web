import { DownIcon, SpinnerIcon } from "@apps/shared/icons";
import { Listbox, Transition } from "@headlessui/react";
import React from "react";
import isEmpty from "lodash/isEmpty";

export const ListBoxHeadless = ({ list, label, value, setValue, isLoading = false, showDescription = true, className }) => {
    return (
        <div className={`flex w-full items-center justify-start`}>
            <Listbox as="div" value={value} onChange={setValue} className="flex-1 space-y-1">
                {({ open }) => (
                    <>
                        {!isEmpty(label) && <Listbox.Label className="mb-1 block text-sm font-medium leading-5 text-gray-400">{label}</Listbox.Label>}
                        <div className="relative">
                            <span className="inline-block w-full rounded-md">
                                <Listbox.Button className={`${className ?? "h-10"} border-gray-330 relative w-full cursor-pointer rounded-10 border-1 bg-white px-2 pl-3 text-left transition duration-150 ease-in-out sm:text-sm sm:leading-5`}>
                                    <span className="flex items-center gap-2 truncate font-normal">
                                        {value?.Icon}
                                        {value?.name}
                                    </span>
                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                        <DownIcon />
                                    </span>
                                </Listbox.Button>
                            </span>
                            <Transition
                                show={open}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                                className="absolute z-20 mt-1 w-full rounded-md bg-white shadow-lg">
                                <Listbox.Options
                                    static
                                    className="max-h-50 overflow-auto rounded-10 text-base leading-6 shadow-xs focus:outline-none sm:text-sm sm:leading-5">
                                    {isLoading ? (
                                        <div className="grid h-screen items-center justify-center">
                                            <span className="text-primary-200">
                                                <SpinnerIcon width={50} />
                                            </span>
                                        </div>
                                    ) : (
                                        list.map((element) => {
                                            const { id, name, description, Icon, separator } = element;
                                            return (
                                                <Listbox.Option key={id} value={element}>
                                                    {({ selected, active }) => (
                                                        <div
                                                            className={`
                                  ${active ? "bg-primary-600" : ""}
                                  ${separator ? "border-gray-330 border-b-1" : ""}
                                  relative z-20 cursor-pointer select-none py-2 pl-4 pr-4`}>
                                                            <div className="flex items-center gap-2">
                                                                {Icon && (
                                                                    <div
                                                                        className={`
                                          ${active || selected ? "text-primary-200" : "text-gray-400"}`}>
                                                                        {Icon}
                                                                    </div>
                                                                )}
                                                                <div className="flex flex-col">
                                                                    <span
                                                                        className={`
                                        ${selected ? "font-bold text-primary-200" : "font-normal"}
                                        ${active ? "text-primary-200" : "text-gray-400"}
                                        block truncate`}>
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
    );
};
