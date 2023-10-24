import { CleanIcon, CloseIcon, DownIcon, SendTimerIcon } from "@apps/shared/icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import DatePicker, { registerLocale } from "react-datepicker";
import dayjs from "dayjs";
import getMonth from "date-fns/getMonth";
import getYear from "date-fns/getYear";
import isNil from "lodash/isNil";
import range from "lodash/range";
import { TimeInput } from "./Time";
import en from "date-fns/locale/en-US";
import es from "date-fns/locale/es";
import pt from "date-fns/locale/pt";
import { useSelector } from "react-redux";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { parseISO } from "date-fns";
import { BeatLoader } from "react-spinners";

registerLocale("en", en);
registerLocale("es", es);
registerLocale("pt", pt);

export function Modal({ children, isShow = false, closeModal = () => null, widthModal = "w-[60rem]" } = {}) {
    return (
        <Transition appear show={isShow} as={Fragment}>
            <Dialog as="div" className="relative z-10" open={isShow} onClose={closeModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95">
                            <Dialog.Panel className={widthModal}>{children}</Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

const parseFormatDefaultDatetime = (defaultValue) => {
    const datetime = dayjs(defaultValue).format("YYYY-MM-DD HH:mm:ss").toString();
    return datetime.split(" ");
};

export function DateTimeInput({
    showModal,
    setShowModal,
    defaultValue = null,
    name,
    type,
    onChange = () => null,
    isDisable,
    closeModal,
    setShowConfirmationModal,
    showConfirmationModal,
    closeConfirmationModal,
    reScheduled,
    loadingReschedule,
} = {}) {
    const [defaultDate, defaultTime] = !isNil(defaultValue) ? parseFormatDefaultDatetime(defaultValue) : [null, null];
    const [date, setDate] = useState(defaultDate);
    const [time, setTime] = useState(defaultTime);
    const [isToday, setIsToday] = useState(false);
    const [cleanSwitch, setCleanSwitch] = useState(false);
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";
    const { t } = useTranslation();

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

    const handleTimeChange = (timeSelected) => {
        setTime(timeSelected.value);
    };

    const handleApplyChange = (evt) => {
        evt.preventDefault();
        const timestamp = dayjs(date + time).format("YYYY-MM-DD HH:mm:ss");
        onChange({ value: timestamp });
        setShowModal(false);
        setShowConfirmationModal(true);
    };

    const handleCleanChange = () => {
        setTime(defaultTime);
        setDate(defaultDate);
        setCleanSwitch(!cleanSwitch);
    };

    const months = t("dataReport.months").split(",");
    const years = range(getYear(new Date()), getYear(new Date()) + 2, 1);

    return (
        <>
            <Modal closeModal={closeModal} isShow={showModal} widthModal="w-76 min-h-40">
                <div className="h-full w-full rounded-20 bg-white">
                    <div className="flex w-full flex-row rounded-t-20 bg-primary-30 px-6 py-4">
                        <SendTimerIcon width={30} height={30} />
                        <p className="ml-4 text-lg font-bold text-primary-200">{t("hsm.monitoring.titleDate")}</p>
                    </div>
                    <div className="picker-calendar flex h-70 items-center justify-center">
                        <DatePicker
                            dateFormat="YYYY-MM-DD"
                            selected={parseISO(date)}
                            onChange={handleChangeDate}
                            inline
                            minDate={new Date()}
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
                                    <button className="absolute left-[-2rem] top-130" onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
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
                    <div className="flex h-18 items-center justify-center gap-4 border-t-0.5 border-b-0.5 border-gray-15 ">
                        <h5 className="block text-base font-bold text-gray-400">{t("SelectSend.hour")}</h5>
                        <div className="grid place-content-center">
                            <TimeInput defaultValue={time} onChange={handleTimeChange} clean={cleanSwitch} isToday={isToday} />
                        </div>
                    </div>
                    <footer className="flex h-16 w-full flex-row justify-between rounded-b-20 bg-primary-30 px-8">
                        <div className="flex items-center">
                            <button
                                disabled={defaultDate === date && defaultTime === time}
                                type="button"
                                className={`inline-flex h-9 items-center justify-center text-base font-medium text-primary-200 disabled:opacity-60 ${
                                    defaultDate === date && defaultTime === time ? "cursor-not-allowed" : ""
                                }`}
                                onClick={handleCleanChange}>
                                <CleanIcon width={20} height={20} fill={"currentColor"} className={"text-primary-200"} />
                                <p className="ml-2 flex items-center font-bold">{t("hsm.monitoring.clean")}</p>
                            </button>
                        </div>
                        <div className="flex items-center">
                            <button
                                type="button"
                                onClick={() => {
                                    handleCleanChange();
                                    closeModal();
                                }}
                                className="h-9 rounded-3xl border-transparent bg-gray-10 px-5 text-base font-bold text-gray-400 outline-none">
                                {t("botsCreate.cancel")}
                            </button>
                            <button
                                type="button"
                                disabled={defaultDate === date && defaultTime === time}
                                className={`border inline-flex justify-center rounded-full border-transparent bg-primary-200 px-4 py-1 text-base font-medium text-white focus:outline-none disabled:opacity-60 ${
                                    defaultDate === date && defaultTime === time ? "cursor-not-allowed" : ""
                                }`}
                                onClick={handleApplyChange}>
                                {t("clients.apply")}
                            </button>
                        </div>
                    </footer>
                </div>
            </Modal>
            <Modal closeModal={closeConfirmationModal} isShow={showConfirmationModal} widthModal={"w-80"}>
                <div className="h-full w-full rounded-20 bg-white">
                    <div className="flex w-full flex-row justify-between rounded-t-20 bg-primary-30 px-8 py-4">
                        <div className="flex flex-row items-center">
                            <SendTimerIcon width={30} height={30} />
                            <p className="ml-4 text-xl font-bold text-primary-200">{t("hsm.monitoring.confirmationReschedule")}</p>
                        </div>
                        <div className="flex items-center justify-center">
                            <button className="flex items-center justify-center" onClick={closeConfirmationModal}>
                                <CloseIcon width={14} height={14} fill={"currentColor"} className={"text-gray-100"} />
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col py-4 pl-8 pr-6 text-left">
                        <p className="flex items-center pb-2 text-lg text-primary-200">{t("hsm.monitoring.confirmationNote1")}</p>
                        <p className="flex items-center pb-2 text-15 text-gray-400">{t("hsm.monitoring.confirmationNote2")}</p>
                        <p className="flex items-center text-base font-bold text-gray-490">{t("hsm.monitoring.confirmationNote3")}</p>
                    </div>
                    <footer className="flex w-full justify-end rounded-b-20 bg-white px-6 pb-4">
                        <button
                            type="button"
                            onClick={() => {
                                setShowModal(true);
                                closeConfirmationModal();
                            }}
                            className="mr-4 h-9 rounded-3xl border-transparent bg-gray-10 px-5 text-base font-bold text-gray-400 outline-none">
                            {t("hsm.no")}
                        </button>
                        <button
                            type="button"
                            className={`border flex items-center justify-center rounded-full border-transparent bg-primary-200 px-4 py-1 text-base font-bold text-white focus:outline-none disabled:opacity-60`}
                            onClick={reScheduled}>
                            {loadingReschedule ? (
                                <div className="h-[16px]">
                                    <BeatLoader color={"white"} size={10} />
                                </div>
                            ) : (
                                <>{t("hsm.monitoring.confirmBtn")}</>
                            )}
                        </button>
                    </footer>
                </div>
            </Modal>
        </>
    );
}
