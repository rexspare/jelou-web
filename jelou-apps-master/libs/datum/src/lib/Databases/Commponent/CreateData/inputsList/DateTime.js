import { DownIcon } from "@apps/shared/icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import DatePicker, { registerLocale } from "react-datepicker";
import dayjs from "dayjs";

import { Modal } from "../../Modals/Index";
import getMonth from "date-fns/getMonth";
import getYear from "date-fns/getYear";
import isEmpty from "lodash/isEmpty";
import range from "lodash/range";
import TimeInput from "./Time";

import en from "date-fns/locale/en-US";
import es from "date-fns/locale/es";
import pt from "date-fns/locale/pt";
import { useSelector } from "react-redux";

registerLocale("en", en);
registerLocale("es", es);
registerLocale("pt", pt);

const parseFormatDefatulDatetime = (defaultValue) => {
    const datetime = dayjs(defaultValue).format("YYYY-MM-DD HH:mm:ss").toString();
    return datetime.split(" ");
};

export function DateTimeInput({ label = "", defaultValue = null, name, type, onChange = () => null, isDisable } = {}) {
    const [defatulDate, defatulTime] = defaultValue ? parseFormatDefatulDatetime(defaultValue) : [null, null];
    const [date, setDate] = useState(defatulDate);
    const [time, setTime] = useState(defatulTime);
    const [showModal, setShowModal] = useState(false);
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";
    const { t } = useTranslation();

    const handleChangeDate = (datesSeled) => {
        setDate(dayjs(datesSeled).format("YYYY-MM-DD"));
    };

    const handleTimeChange = (timeSelected) => {
        setTime(timeSelected.value);
    };

    const handleApplyChange = (evt) => {
        evt.preventDefault();
        const timestamp = dayjs(date + time).format("YYYY-MM-DD HH:mm:ss");
        onChange({ value: timestamp, name, type });
        setShowModal(false);
    };

    const months = t("dataReport.months").split(",");
    const years = range(2015, getYear(new Date()) + 1, 1);

    return (
        <div>
            <div className="text-sm font-medium text-gray-400">
                <button
                    disabled={isDisable}
                    type={"button"}
                    onClick={() => setShowModal(true)}
                    className="mt-1 mb-4 block w-full rounded-lg border-none bg-primary-700 px-3 py-2 text-left text-gray-400 text-opacity-70 focus:border-transparent focus:ring-transparent disabled:cursor-not-allowed">
                    {date === null || time === null ? (
                        <span className="opacity-50">{label}</span>
                    ) : (
                        <span className="font-normal">
                            {dayjs(date + time)
                                .format("DD-MM-YYYY HH:mm:ss")
                                .toString()}
                        </span>
                    )}
                </button>
            </div>

            <Modal closeModal={() => setShowModal(false)} isShow={showModal} widthModal="w-76 h-76">
                <div className="h-full w-full rounded-20 bg-white">
                    <div className="picker-calendar flex h-70 items-center justify-center">
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
                                <div className="flex items-center justify-around">
                                    <button className="absolute left-[-2rem] top-130" onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
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
                                            value={getYear(date)}
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
                    <div className="flex h-18 items-center justify-center gap-4 border-t-0.5 border-b-0.5 border-gray-15 ">
                        <h5 className="block text-sm font-bold text-gray-400">{t("SelectSend.hour")}</h5>
                        <div className="grid place-content-center">
                            <TimeInput onChange={handleTimeChange} />
                        </div>
                    </div>
                    <footer className="grid h-16 w-full items-center justify-end rounded-b-20 bg-primary-30 pr-8">
                        <button
                            type="button"
                            disabled={isEmpty(date) || isEmpty(time)}
                            className={`border inline-flex justify-center rounded-full border-transparent bg-primary-200 px-4 py-1 text-sm font-medium text-white focus:outline-none disabled:opacity-60 ${
                                isEmpty(date) || isEmpty(time) ? "cursor-not-allowed" : ""
                            }`}
                            onClick={handleApplyChange}>
                            {t("clients.apply")}
                        </button>
                    </footer>
                </div>
            </Modal>
        </div>
    );
}
