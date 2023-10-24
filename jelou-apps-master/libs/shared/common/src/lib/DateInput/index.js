import { useState } from "react";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import dayjs from "dayjs";
import getMonth from "date-fns/getMonth";
import getYear from "date-fns/getYear";
import range from "lodash/range";

import { DownIcon } from "@apps/shared/icons";
import { ModalHeadlessSimple } from "../modal/Modal-headless";
import { useSelector } from "react-redux";

const formatDate = "YYYY-MM-DD";
const DEFULT_RANGE_YEARS = range(2010, getYear(new Date()) + 1, 1);

export function DateInput({
    type,
    keyInput,
    handleChangeDataForm = () => null,
    defaultValue,
    placeholder,
    isDisable,
    rangeOfYear = DEFULT_RANGE_YEARS,
    minDate = null,
} = {}) {
    const value = defaultValue ? dayjs(defaultValue).format(formatDate) : null;
    const [date, setDate] = useState(value);
    const [showModal, setShowModal] = useState(false);
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";

    const { t } = useTranslation();

    const handleChangeDate = (dateEvt) => {
        setDate(dateEvt);
        const dateSelected = dayjs(dateEvt).format(formatDate);
        handleChangeDataForm({ value: dateSelected, name: keyInput, type });
        setShowModal(false);
    };

    const months = t("dataReport.months").split(",");
    const years = rangeOfYear;

    return (
        <div className="relative w-full">
            <input className="sr-only" name={keyInput} value={date ? dayjs(date).format("YYYY-MM-DD HH:mm:ss").toString() : undefined} />
            <div className="text-15 font-medium text-gray-400">
                <button
                    disabled={isDisable}
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="h-9 w-full rounded-lg border-none bg-primary-700 px-3 text-left focus:border-transparent focus:ring-transparent disabled:cursor-not-allowed">
                    {date === null ? (
                        <span className="opacity-50">{placeholder}</span>
                    ) : (
                        <span className="font-normal">{dayjs(date).format(formatDate).toString()}</span>
                    )}
                </button>
            </div>

            <ModalHeadlessSimple className="h-74 w-74" closeModal={() => setShowModal(false)} isShow={showModal}>
                <div className="h-full w-full rounded-20 bg-white">
                    <div className="flex w-full">
                        <div className="relative flex flex-1 flex-col p-4 py-6">
                            <div className="picker-calendar flex h-70 items-center justify-center">
                                <DatePicker
                                    minDate={minDate}
                                    onChange={handleChangeDate}
                                    inline
                                    locale={lang || "es"}
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
                                                className="absolute left-[-2rem] top-130"
                                                onClick={decreaseMonth}
                                                disabled={prevMonthButtonDisabled}>
                                                <DownIcon className="rotate-90 opacity-25" width="1.5rem" fill="#727C94" />
                                            </button>
                                            <div className="flex items-center">
                                                <select
                                                    className="notArrow cursor-pointer border-none p-0 text-gray-400 focus:ring-transparent"
                                                    value={months[getMonth(date)]}
                                                    onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}>
                                                    {months.map((option) => (
                                                        <option key={option} value={option}>
                                                            {option}
                                                        </option>
                                                    ))}
                                                </select>
                                                <DownIcon className="opacity-25" width="1.5rem" fill="#727C94" />
                                            </div>
                                            <div className="flex items-center">
                                                <select
                                                    className="notArrow cursor-pointer border-none p-0 text-gray-400 focus:ring-transparent"
                                                    value={getYear(new Date(date))}
                                                    onChange={({ target: { value } }) => changeYear(value)}>
                                                    {years.map((option) => (
                                                        <option key={option} value={option}>
                                                            {option}
                                                        </option>
                                                    ))}
                                                </select>
                                                <DownIcon className="opacity-25" width="1.5rem" fill="#727C94" />
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
                        </div>
                    </div>
                </div>
            </ModalHeadlessSimple>
        </div>
    );
}
