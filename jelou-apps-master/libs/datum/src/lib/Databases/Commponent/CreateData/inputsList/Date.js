import { useState } from "react";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import dayjs from "dayjs";
import getMonth from "date-fns/getMonth";
import getYear from "date-fns/getYear";
import range from "lodash/range";

import { DownIcon } from "@apps/shared/icons";
import { Modal } from "../../Modals/Index";
import { useSelector } from "react-redux";
const formatDate = "YYYY-MM-DD";

export function DateInput({ type, keyInput, handleChangeDataForm, defaultValue, label, isDisable } = {}) {
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
    const years = range(2010, getYear(new Date()) + 1, 1);

    return (
        <div className="relative w-full">
            <div className="text-15 font-medium text-gray-400">
                <button
                    disabled={isDisable}
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="mt-1 mb-4 block w-full rounded-lg border-none bg-primary-700 px-3 py-2 text-left focus:border-transparent focus:ring-transparent disabled:cursor-not-allowed">
                    {date === null ? (
                        <span className="opacity-50">{label}</span>
                    ) : (
                        <span className="font-normal">{dayjs(date).format(formatDate).toString()}</span>
                    )}
                </button>
            </div>

            <Modal closeModal={() => setShowModal(false)} isShow={showModal} widthModal="w-72 h-72">
                <div className="h-full w-full rounded-20 bg-white">
                    <div className="flex w-full">
                        <div className="relative flex flex-1 flex-col p-4 py-6">
                            <div className="picker-calendar flex justify-center">
                                <DatePicker
                                    selected={new Date()}
                                    onChange={handleChangeDate}
                                    inline
                                    locale={lang}
                                    renderCustomHeader={({
                                        date,
                                        changeYear,
                                        changeMonth,
                                        decreaseMonth,
                                        increaseMonth,
                                        prevMonthButtonDisabled,
                                        nextMonthButtonDisabled,
                                    }) => (
                                        <div className="flex justify-center">
                                            <button
                                                className={`${prevMonthButtonDisabled ? " cursor-not-allowed" : ""}`}
                                                onClick={(evt) => {
                                                    evt.preventDefault();
                                                    decreaseMonth();
                                                }}
                                                disabled={prevMonthButtonDisabled}>
                                                <DownIcon className="rotate-90 opacity-25" width="1.5rem" fill="#727C94" />
                                            </button>
                                            <select
                                                className="w-32 border-none p-0 text-gray-475 text-opacity-60 focus:ring-transparent"
                                                value={months[getMonth(date)]}
                                                onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}>
                                                {months.map((option) => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                            <select
                                                className="border-none text-gray-475 text-opacity-60 focus:ring-transparent"
                                                value={getYear(date)}
                                                onChange={({ target: { value } }) => changeYear(value)}>
                                                {years.map((option) => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>

                                            <button
                                                className={`${nextMonthButtonDisabled ? " cursor-not-allowed" : ""}`}
                                                onClick={(evt) => {
                                                    evt.preventDefault();
                                                    increaseMonth();
                                                }}
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
            </Modal>
        </div>
    );
}
