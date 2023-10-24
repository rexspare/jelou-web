import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import InputRange from "react-input-range";

import "../../styles/rangeFilter.scss";
export function RangeFilter({ handleChange, handleClearFilter, handleClick, maxValue, minValue, valueRange }) {
    const { t } = useTranslation();

    const hasRangeSelected = Boolean(valueRange?.min && valueRange?.max);

    return (
        <div>
            <Popover className="relative">
                <>
                    <Popover.Button className="relative inline-flex h-[2.4rem] w-64 items-center justify-between rounded-[0.8125rem] border-[0.0938rem] border-gray-100 border-opacity-50 bg-white px-[0.80rem] text-left text-13 font-normal text-gray-100 focus:outline-none">
                        {hasRangeSelected && (
                            <span className="font-bold text-primary-200">
                                {valueRange.min} - {valueRange.max}
                            </span>
                        )}
                        <span
                            className={`label-top-animation flex items-center gap-1 bg-white font-normal ${
                                hasRangeSelected ? "absolute translate-y-[-1.15rem]" : "translate-y-0"
                            }`}>
                            <RangPriceFilterIcon />
                            <span>{t("shop.filters.rangePrice")}</span>
                        </span>
                    </Popover.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1">
                        <Popover.Panel className="absolute z-20 mt-3">
                            <section className="w-[18.75rem] rounded-12 bg-white pt-9 shadow-dropdown">
                                <div className="flex flex-col items-center">
                                    <div className="mb-7 flex w-64 justify-center">
                                        <InputRange maxValue={maxValue} minValue={minValue} value={valueRange} onChange={handleChange} />
                                    </div>
                                </div>

                                <p className="block w-full border-b-1 border-gray-100 border-opacity-25"></p>
                                <footer className="flex justify-between px-5 py-4">
                                    <button onClick={handleClearFilter} className="text-base font-bold text-primary-200">
                                        {t("clients.erase")}
                                    </button>
                                    <button className="w-full"></button>
                                    <button
                                        disabled={minValue === maxValue}
                                        onClick={handleClick}
                                        className="rounded-20 bg-primary-200 py-[0.375rem] px-7 text-base font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">
                                        {t("clients.apply")}
                                    </button>
                                </footer>
                            </section>
                        </Popover.Panel>
                    </Transition>
                </>
            </Popover>
        </div>
    );
}

function RangPriceFilterIcon() {
    return (
        <svg
            width={15}
            fill="#A6B4D0"
            viewBox="0 0 200 200"
            style={{
                enableBackground: "new 0 0 200 200",
            }}
            xmlSpace="preserve">
            <path d="M124.82 37.32c5.96-.38 11.91-.72 17.86-1.16 5.95-.44 11.25 3.21 12.54 9.02 1.45 6.55 2.63 13.16 3.99 19.73 2 9.65 4.09 19.27 6.06 28.92 1.25 6.12 2.02 12.29-1.63 17.92-2.28 3.52-4.81 6.89-7.36 10.23-6.35 8.34-12.79 16.62-19.16 24.95-6.46 8.45-12.84 16.95-19.31 25.39-3.58 4.67-7.12 9.39-10.95 13.85-3.79 4.42-8.73 6.82-14.59 7.59-8.41 1.1-15.18-1.97-21.46-7.22-5.36-4.48-11.1-8.51-16.67-12.74-7.29-5.54-14.63-11.01-21.85-16.64-3.52-2.74-7.14-5.48-10.13-8.75-5.97-6.57-7.05-14.44-4.78-22.87 1.27-4.69 4.43-8.27 7.26-12.02 6.4-8.48 12.9-16.89 19.36-25.33 9.39-12.26 18.8-24.5 28.15-36.78 2.56-3.35 4.86-6.97 8.87-8.79 2.4-1.09 4.88-2.4 7.43-2.7 7.38-.85 14.81-1.53 22.23-1.65 2.66-.04 3.11-1.03 3.85-2.98 2.71-7.21 6.88-13.45 12.67-18.64 5.94-5.32 12.74-8.81 20.56-10.18 11.35-1.99 23.89 2.12 30.44 13.27 6.83 11.61 5.7 23.36.46 35.08-1.28 2.87-3.12 5.51-4.85 8.16-1.23 1.87-4.8 2.48-6.56 1.31-2.24-1.48-2.92-4.34-1.67-6.66 2.06-3.85 4.54-7.56 5.98-11.63 2.54-7.21 2.34-14.51-1.73-21.27-3.82-6.35-11.08-9.94-19.88-8.64-8.26 1.22-14.79 5.45-19.89 11.89-2.15 2.72-3.9 5.75-5.84 8.64.19.24.39.47.6.7zm-12.81 10.59c-8.07.67-15.83 1.17-23.55 2.08-1.78.21-3.72 1.54-5.01 2.89-2.24 2.35-4.04 5.12-6.02 7.71-5.38 7.04-10.76 14.07-16.14 21.11-5.95 7.8-11.88 15.61-17.83 23.41-4.5 5.89-8.95 11.83-13.57 17.62-5.44 6.82-4.78 16.55 1.83 21.72 8.54 6.68 17.19 13.21 25.81 19.77 7.18 5.47 14.46 10.81 21.57 16.37 7.44 5.82 17.18 4.04 21.92-2.56 3.58-4.99 7.38-9.81 11.12-14.68 7.44-9.68 14.93-19.33 22.35-29.03 5.44-7.11 10.83-14.26 16.2-21.42 1.72-2.29 3.52-4.58 4.87-7.09 1.77-3.31.54-6.75-.16-10.16-1.86-9.02-3.57-18.06-5.37-27.09-1.35-6.79-2.76-13.57-4.14-20.35-.29-1.42-.89-2.43-2.61-2.27-1.57.15-3.16.14-4.74.25-5.18.36-10.35.72-15.52 1.16-.44.04-1.17.73-1.18 1.14-.27 6.96 1.85 13 7.26 17.61 2.21 1.88 3 4.89 1.6 6.91-1.72 2.48-4.66 2.99-7.25 1.11-3.14-2.29-5.6-5.24-7.42-8.64-2.88-5.34-4.3-11.08-4.02-17.57z" />
            <path d="M79.43 140.33c-1.13 1.5-2.27 3-3.4 4.51-1.79 2.4-4.9 3.09-7.12 1.56-2.47-1.71-2.87-4.37-1-7.12 1.14-1.68 2.36-3.3 3.62-5.07-2.35-1.82-4.63-3.6-6.93-5.35-2.14-1.63-2.67-4.45-1.23-6.73 1.24-1.97 4.43-2.77 6.53-1.3 4.13 2.89 8.11 5.98 12.14 9 1.33.99 2.6 2.07 3.96 3.02 3.31 2.29 7.04 1.36 9.3-1.18 2.51-2.82 1.95-7.36-.95-9.71-3.17-2.56-6.4-5.05-9.54-7.65-7.87-6.53-7.47-19.09.48-25.44 5.45-4.35 14.01-5.04 19.78-.76 1.35 1 1.86-.12 2.48-.81 1.16-1.29 2.13-2.75 3.31-4.02 1.6-1.72 4.21-1.9 6.08-.56 1.6 1.15 2.55 4.1 1.61 5.79-.98 1.76-2.27 3.34-3.4 5.01-.31.45-.57.94-.85 1.42 2.34 1.79 4.54 3.44 6.71 5.12 1.96 1.52 2.5 4.72 1.16 6.61-1.77 2.49-4.06 3.03-6.73 1.24-5.02-3.37-9.79-7.14-14.56-10.88-5.2-4.09-10.83-1.8-11.96 3.96-.62 3.14 1.29 5.32 3.6 7.15 2.96 2.33 5.97 4.61 8.85 7.03 6.16 5.17 6.86 14.26 2.87 20.74-4.99 8.12-15.01 10.31-22.85 5.49-.59-.36-1.22-.67-1.96-1.07z" />
        </svg>
    );
}
