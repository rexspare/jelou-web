import { Popover, Transition } from "@headlessui/react";
import DatePicker, { registerLocale } from "react-datepicker";
import dayjs from "dayjs";
import React, { Fragment } from "react";
// import "react-dates/lib/css/_datepicker.css";

import en from "date-fns/locale/en-US";
import es from "date-fns/locale/es";
import pt from "date-fns/locale/pt";
import isDate from "lodash/isDate";
import isEmpty from "lodash/isEmpty";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

registerLocale("en", en);
registerLocale("es", es);
registerLocale("pt", pt);

const DatesPicker = (props) => {
    const { dateValue, onChangeDate, icon = {} } = props;
    const { t } = useTranslation();
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";

    return (
        <Popover className="relative">
            <Popover.Button className="border-input mx-2 flex flex-1 space-x-3 rounded-input border-1 border-gray-100 border-opacity-50 py-2 pl-3 pr-10 text-13 text-gray-400 text-opacity-75">
                {isDate(dateValue) ? (
                    <span className="pl-2 font-bold text-primary-200">{dayjs(dateValue).format("DD/MM/YYYY")}</span>
                ) : (
                    <>
                        {isEmpty(icon) && <div className="flex items-center">{icon}</div>}
                        <span className="mr-3">{t("clients.date")}</span>
                    </>
                )}
            </Popover.Button>

            <Popover.Panel className="absolute bottom-5 z-10">
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1">
                    <div className="z-30 inline-block w-full max-w-md transform rounded-xl bg-white align-middle shadow-xl transition-all">
                        <div className="flex w-72 flex-1 flex-col items-center p-2">
                            <div className="picker-calendar mb-3">
                                <DatePicker
                                    selected={dateValue}
                                    onChange={(date) => {
                                        onChangeDate(date);
                                    }}
                                    inline
                                    locale={lang}
                                    minDate={new Date()}
                                />
                            </div>
                        </div>
                    </div>
                </Transition>
            </Popover.Panel>
        </Popover>
    );
};

export default DatesPicker;
