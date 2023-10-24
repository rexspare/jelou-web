import { Popover, Transition } from "@headlessui/react";
import dayjs from "dayjs";
import isDate from "lodash/isDate";
import isEmpty from "lodash/isEmpty";
import React, { Fragment } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { useTranslation } from "react-i18next";

import en from "date-fns/locale/en-US";
import es from "date-fns/locale/es";
import pt from "date-fns/locale/pt";

import { DateIcon } from "@apps/shared/icons";
import "react-dates/lib/css/_datepicker.css";
import { useSelector } from "react-redux";

registerLocale("en", en);
registerLocale("es", es);
registerLocale("pt", pt);

export function DateRangePicker(props) {
    const { t } = useTranslation();
    const [rangeSelected, setRangeSelected] = React.useState(null);
    const { dataRanges, dateValue, endDate, startDate, clearDate, onChange, dateChange } = props;
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";

    return (
        <Popover className="relative">
            <div className="flex w-64 flex-1">
                <Popover.Button className="flex flex-1 rounded-[0.8125rem] border-[0.0938rem] border-gray-100 border-opacity-50 px-[0.80rem] py-2 pl-3 pr-10 text-13 text-gray-400 text-opacity-75">
                    {(!isEmpty(dateValue) || isDate(endDate)) && (
                        <span className="font-bold text-primary-200">
                            {dayjs(dateValue[0]).format("DD/MM/YYYY")} - {dayjs(dateValue[1]).format("DD/MM/YYYY")}
                        </span>
                    )}
                    <span
                        className={`label-top-animation flex gap-2 bg-white ${
                            !isEmpty(dateValue) || isDate(endDate) ? "absolute translate-y-[-1.15rem]" : "translate-y-0"
                        }`}>
                        <div className="flex items-center bg-white pl-1">
                            <DateIcon width="1rem" height="1.0625rem" fill="#A6B4D0" />
                        </div>
                        <span className="mr-0.5">{t("clients.date")}</span>
                    </span>
                </Popover.Button>
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1">
                <Popover.Panel
                    className="absolute z-20 mt-3 w-[33.25rem] rounded-20 bg-white"
                    style={{ filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))" }}>
                    <div className="flex">
                        <div className="flex flex-col justify-start space-y-4 border-r-2 border-gray-400 border-opacity-15 p-6 text-13">
                            <span className="font-bold text-gray-100">{t("clients.ranges")}:</span>
                            {dataRanges.map((range, key) => (
                                <button
                                    onClick={() => {
                                        onChange(0, [range]);
                                        setRangeSelected(key);
                                    }}
                                    className={`flex justify-start text-opacity-65  ${
                                        rangeSelected === key ? "font-extrabold text-primary-200" : "font-normal text-gray-400 hover:text-primary-200"
                                    }`}
                                    key={key}>
                                    {range.name}
                                </button>
                            ))}
                        </div>
                        <div className="flex flex-1 flex-col p-4 py-6">
                            <div className="picker-calendar mb-3 flex justify-center">
                                <DatePicker
                                    selected={startDate}
                                    onChange={(evt) => onChange(1, evt)}
                                    selectsStart
                                    startDate={startDate}
                                    endDate={endDate}
                                    inline
                                    selectsRange
                                    locale={lang}
                                    maxDate={new Date()}
                                />
                            </div>
                            <div className="mt-4 flex justify-between">
                                <button
                                    type="button"
                                    className="border focus-visible:ring-2 inline-flex justify-center rounded-full border-transparent px-4 py-1 text-sm font-medium text-primary-200 focus:outline-none"
                                    onClick={() => {
                                        setRangeSelected(null);
                                        clearDate();
                                    }}>
                                    {t("clients.erase")}
                                </button>
                                <button
                                    type="button"
                                    disabled={!isDate(endDate)}
                                    className={`focus-visible:ring-2 border inline-flex justify-center rounded-full border-transparent px-4 py-1 text-sm font-medium focus:outline-none ${
                                        isDate(endDate)
                                            ? "bg-primary-200 text-white hover:bg-primary-100"
                                            : "cursor-not-allowed bg-gray-300 text-gray-400 hover:bg-gray-325"
                                    }`}
                                    onClick={() => (isDate(endDate) ? dateChange([startDate, endDate]) : null)}>
                                    {t("clients.apply")}
                                </button>
                            </div>
                        </div>
                    </div>
                </Popover.Panel>
            </Transition>
        </Popover>
    );
}
