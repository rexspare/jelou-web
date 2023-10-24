import React, { useState, useEffect, useRef, Fragment } from "react";
import { Transition, Popover } from "@headlessui/react";
import { useTranslation } from "react-i18next";

const DelimSelector = ({ handleDelimChange, onDownload }) => {
    const [delim, setDelim] = useState(",");
    const [otherDelim, setOtherDelim] = useState(null);
    const ref2 = useRef();
    const { t } = useTranslation();

    const handleOther = () => {
        setDelim("other");
        ref2.current.focus();
    };

    useEffect(() => {
        if (delim === "other") {
            handleDelimChange(otherDelim);
        } else {
            handleDelimChange(delim);
        }
    }, [delim, otherDelim]);

    return (
        <Popover as="div" className="relative h-full">
            <Popover.Button className="top-0 right-0 ml-2 flex h-full w-12 items-center justify-center rounded-r-full text-primary-200 ">
                <svg
                    className="h-6 w-6 duration-300 ease-in hover:scale-125 hover:transform hover:transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </Popover.Button>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95">
                <Popover.Panel as="button" className="absolute top-0 right-0 z-100 mt-12 w-[300px] rounded-20 bg-white py-6 px-6 shadow-card">
                    <span className="mb-4 block text-base font-semibold leading-snug text-primary-200">
                        {t("Seleccionar un delimitado para tu archivo")}
                    </span>
                    <div className="mb-4 flex items-center">
                        <label htmlFor="comma" className="cursor-pointer text-base font-medium text-[#959daf]">
                            <input
                                type="checkbox"
                                id="comma"
                                name="delim"
                                onClick={() => setDelim(",")}
                                value=","
                                checked={delim === ","}
                                className="mr-3 h-4 w-4  appearance-none rounded-[3px] border-2 checked:border-transparent checked:bg-primary-200 hover:checked:bg-primary-200 focus:bg-primary-200 focus:ring-primary-200 focus:checked:bg-primary-200"
                            />
                            {t("Coma")}
                        </label>
                    </div>

                    <div className="mb-4 flex items-center">
                        <label htmlFor="semicolon" className="cursor-pointer text-base font-medium text-[#959daf]">
                            <input
                                type="checkbox"
                                id="semicolon"
                                name="delim"
                                value=";"
                                onClick={() => setDelim(";")}
                                checked={delim === ";"}
                                className="mr-3 h-4 w-4  appearance-none rounded-[3px] border-2 checked:border-transparent checked:bg-primary-200 hover:checked:bg-primary-200 focus:bg-primary-200 focus:ring-primary-200 focus:checked:bg-primary-200"
                            />
                            {t("Punto y coma")}
                        </label>
                    </div>

                    <div className="mb-6 flex items-center">
                        <label htmlFor="other" className="cursor-pointer text-base font-medium text-[#959daf]">
                            <input
                                type="checkbox"
                                id="other"
                                name="delim"
                                onClick={handleOther}
                                value="other"
                                checked={delim === "other"}
                                className="mr-3 h-4 w-4  appearance-none rounded-[3px] border-2 checked:border-transparent checked:bg-primary-200 hover:checked:bg-primary-200 focus:bg-primary-200 focus:ring-primary-200 focus:checked:bg-primary-200"
                            />
                            {t("Otros")}
                        </label>
                        <input
                            type="text"
                            ref={ref2}
                            onChange={({ target }) => {
                                if (delim !== "other") {
                                    setDelim("other");
                                }
                                setOtherDelim(target.value);
                            }}
                            className="focus:ring-2 ml-3 h-8 w-16 rounded-lg border-2 border-primary-200 px-2 text-gray-400 focus:outline-none focus:ring-primary-200"
                        />
                    </div>

                    <div className="flex justify-end">
                        <button onClick={onDownload} className="relative flex h-8 items-center rounded-full bg-primary-200 px-6 text-white">
                            {t("Seleccionar")}
                        </button>
                    </div>
                </Popover.Panel>
            </Transition>
        </Popover>
    );
};

export default DelimSelector;
