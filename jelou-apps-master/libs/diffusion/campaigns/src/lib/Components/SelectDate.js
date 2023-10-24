import React, { useState } from "react";
import { DownIcon } from "@apps/shared/icons";
import DatePicker, { registerLocale } from "react-datepicker";
import { parseISO } from "date-fns";
import dayjs from "dayjs";
import isNil from "lodash/isNil";
import { useTranslation } from "react-i18next";
import getMonth from "date-fns/getMonth";
import { useSelector } from "react-redux";
import getYear from "date-fns/getYear";
import range from "lodash/range";

const parseFormatDefaultDatetime = (defaultValue) => {
    const datetime = dayjs(defaultValue).format("YYYY-MM-DD HH:mm:ss").toString();
    return datetime.split(" ");
};

const SelectDate = (props) => {
    const { defaultValue = null } = props;
    const [isToday, setIsToday] = useState(false);
    const [defaultDate, defaultTime] = !isNil(defaultValue) ? parseFormatDefaultDatetime(defaultValue) : [null, null];
    const [date, setDate] = useState(defaultDate);
    const { t } = useTranslation();
    const months = t("dataReport.months").split(",");
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";
    const years = range(2015, getYear(new Date()) + 1, 1);

    const handleChangeDate = (dateSelected) => {
        const todayValue = new Date();
        const selectedDate = dayjs(dateSelected);
        const year = todayValue.getFullYear();
        const month = todayValue.getMonth() + 1;
        const day = todayValue.getDate();
        const yearSel = selectedDate.year();
        const monthSel = selectedDate.month() + 1;
        const daySel = selectedDate.date();
        if (new Date() < dateSelected) {
            setDate(dayjs(dateSelected).format("YYYY-MM-DD"));
            setIsToday(false);
        } else if (year === yearSel && month === monthSel && day === daySel) {
            setDate(dayjs(dateSelected).format("YYYY-MM-DD"));
            setIsToday(true);
        }
    };

    return (
        <Modal closeModal={closeModal} isShow={showModal} widthModal="w-76 min-h-40">
            <div className="h-full w-full rounded-20 bg-white">
                <DatePicker
                    dateFormat="YYYY-MM-DD"
                    selected={parseISO(date)}
                    onChange={handleChangeDate}
                    inline
                    minDate={parseISO(new Date())}
                    locale={lang}
                    isClearable={true}
                    renderCustomHeader={({
                        date,
                        changeYear,
                        changeMonth,
                        decreaseMonth,
                        increaseMonth,
                        prevMonthButtonDisabled,
                        nextMonthButtonDisabled,
                    }) => (
                        <div className="flex items-center justify-around">
                            <button
                                className={`${prevMonthButtonDisabled ? " cursor-not-allowed" : ""}`}
                                onClick={decreaseMonth}
                                disabled={prevMonthButtonDisabled}>
                                <DownIcon className="rotate-90 opacity-25" width="1.5rem" fill="#727C94" />
                            </button>
                            <div className="flex items-center">
                                <select
                                    className="notArrow z-10 cursor-pointer border-none bg-transparent p-0 pr-[1.5rem] text-gray-400 focus:ring-transparent"
                                    value={months[getMonth(new Date(date))]}
                                    onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}>
                                    {months.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                                <DownIcon className="translate-x-[-1.5rem] transform opacity-25" width="1.5rem" fill="#727C94" />
                            </div>
                            <div className="flex items-center">
                                <select
                                    className="notArrow z-10 cursor-pointer border-none bg-transparent p-0 pr-[1.5rem] text-gray-400 focus:ring-transparent"
                                    value={getYear(new Date(date))}
                                    onChange={({ target: { value } }) => changeYear(value)}>
                                    {years.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                                <DownIcon className="translate-x-[-1.5rem] transform opacity-25" width="1.5rem" fill="#727C94" />
                            </div>

                            <button
                                className={`absolute right-[-2rem] top-130 ${nextMonthButtonDisabled ? " cursor-not-allowed" : ""}`}
                                onClick={increaseMonth}
                                disabled={nextMonthButtonDisabled}>
                                <DownIcon className="-rotate-90 opacity-25" width="1.5rem" fill="#727C94" />
                            </button>
                        </div>
                    )}
                />
            </div>
        </Modal>
    );
};

export default SelectDate;
