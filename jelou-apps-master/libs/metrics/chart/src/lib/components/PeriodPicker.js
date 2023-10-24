import React, { useContext, useEffect, useRef, useState } from "react";
// import dayjs from "dayjs";
import isEmpty from "lodash/isEmpty";
import DatePicker, { registerLocale } from "react-datepicker";
import { useTranslation } from "react-i18next";

import { useOnClickOutside } from "@apps/shared/hooks";

import { DateContext } from "@apps/context";
import en from "date-fns/locale/en-US";
import es from "date-fns/locale/es";
import pt from "date-fns/locale/pt";
import { useSelector } from "react-redux";
import PERIODS from "./../constants";

registerLocale("en", en);
registerLocale("es", es);
registerLocale("pt", pt);

const CUSTOM_PERIOD = {
    label: "Personalizado",
    value: "custom",
};

const PeriodPicker = (props) => {
    const { period, handlePeriodChange, endAt, startAt, setStartAt, setEndAt, setShowMenu, setPeriod, setPopperElement, styles, attributes } = props;
    const dayjs = useContext(DateContext);
    const [startDate, setStartDate] = useState(new Date(dayjs()));
    const [endDate, setEndDate] = useState(new Date(dayjs()));
    const ref = useRef();
    const [selectedPeriod, setSelectedPeriod] = useState(period);
    const { t } = useTranslation();
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";
    const constPeriods = PERIODS();
    useEffect(() => {
        setStartDate(new Date(startAt));
        setEndDate(new Date(endAt));
    }, [endAt, startAt]);

    useEffect(() => {
        if (!isEmpty(selectedPeriod)) {
            switch (selectedPeriod.value) {
                case "today":
                    setStartDate(new Date(dayjs().startOf("day")));
                    setEndDate(new Date(dayjs()));
                    break;
                case "currentWeek":
                    setStartDate(new Date(dayjs().day(1).startOf("day")));
                    setEndDate(new Date(dayjs()));
                    break;
                case "currentMonth":
                    setStartDate(new Date(dayjs().startOf("month")));
                    setEndDate(new Date(dayjs()));
                    break;
                case "currentYear":
                    setStartDate(new Date(dayjs().startOf("year")));
                    setEndDate(new Date(dayjs().endOf("day")));
                    break;
                default:
                    break;
            }
        }
    }, [selectedPeriod, setSelectedPeriod]);

    useOnClickOutside(ref, () => setShowMenu(false));

    const onChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
        setSelectedPeriod({});
    };

    const handleApply = () => {
        if (isEmpty(selectedPeriod)) {
            setStartAt(dayjs(startDate));
            if (endDate === null || endDate.toString() === startDate.toString()) {
                setEndAt(dayjs(startDate).endOf("day"));
            } else {
                setEndAt(dayjs(endDate));
            }

            setPeriod(CUSTOM_PERIOD);
        } else {
            handlePeriodChange(selectedPeriod);
        }

        setShowMenu(false);
    };

    return (
        <div className="z-20 min-w-350 rounded-xl bg-white shadow-card" ref={setPopperElement} style={styles.popper} {...attributes.popper}>
            <div ref={ref}>
                <div className="flex w-full">
                    <div className="border-r mb-1 flex w-32 flex-col justify-start space-y-4 border-gray-400 border-opacity-25 p-5">
                        <span className="font-semibold text-gray-400">{t("plugins.Rangos")}:</span>
                        <ul className="m-0 flex list-none flex-col items-start justify-start space-y-4 p-0">
                            {constPeriods.map((element, index) => {
                                if (element.display === false) {
                                    return;
                                }
                                return (
                                    <li key={index}>
                                        <button
                                            className={`text-sm font-normal hover:text-primary-200 focus:outline-none ${
                                                element.value === selectedPeriod.value ? "text-primary-200" : "text-gray-400 text-opacity-65"
                                            }`}
                                            onClick={() => setSelectedPeriod(element)}
                                        >
                                            {element.label}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <div className="picker-calendar mb-3 flex flex-col justify-center p-5">
                        <DatePicker selected={startDate} onChange={onChange} selectsStart startDate={startDate} endDate={endDate} inline selectsRange locale={lang} maxDate={new Date()} />
                        <div className="flex justify-end pt-4">
                            <button onClick={() => setShowMenu(false)} className="mr-2 rounded-full bg-white py-2 px-4 text-sm font-medium text-primary-200">
                                {t("plugins.Cancelar")}
                            </button>
                            <button onClick={handleApply} className="rounded-full bg-primary-200 py-2 px-4 text-sm font-medium text-white">
                                {t("plugins.Aplicar")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PeriodPicker;
