import dayjs from "dayjs";
import { Fragment, useMemo, useState } from "react";
import { Transition, Popover } from "@headlessui/react";
import DatePicker, { registerLocale } from "react-datepicker";

import en from "date-fns/locale/en-US";
import es from "date-fns/locale/es";
import pt from "date-fns/locale/pt";
import isDate from "lodash/isDate";
import { useTranslation } from "react-i18next";
import isEmpty from "lodash/isEmpty";
import { useSelector } from "react-redux";

registerLocale("en", en);
registerLocale("es", es);
registerLocale("pt", pt);

const DateRangePicker = (props) => {
    const { dateValue, dateChange, clearDate, icon, background = "#fff", right = false, canDelete = true } = props;
    const { t } = useTranslation();
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [selectedRange, setSelectedRange] = useState();

    const dataRanges = useMemo(
        () => [
            {
                id: 0,
                label: "today",
                name: t("clients.today"),
                startDate: dayjs().startOf("day"),
                endDate: dayjs(),
            },
            {
                id: 1,
                label: "last day",
                name: t("clients.last24hours"),
                startDate: dayjs().add(-1, "day"),
                endDate: dayjs(),
            },
            {
                id: 2,
                label: "yesterday",
                name: t("clients.yesterday"),
                startDate: dayjs().add(-1, "day").startOf("day"),
                endDate: dayjs().add(-1, "day").endOf("day"),
            },
            {
                id: 3,
                label: "this week",
                name: t("clients.thisWeek"),
                startDate: dayjs().day(0).startOf("day"),
                endDate: dayjs().day(6).endOf("day"),
            },
            {
                id: 4,
                label: "last week",
                name: t("clients.lastWeek"),
                startDate: dayjs().subtract(1, "week").day(0).startOf("day"),
                endDate: dayjs().subtract(1, "week").day(6).endOf("day"),
            },
            {
                id: 5,
                label: "last seven days",
                name: t("clients.lastSevenDays"),
                startDate: dayjs().subtract(1, "week").startOf("day"),
                endDate: dayjs().endOf("day"),
            },
            {
                id: 6,
                label: "this month",
                name: t("clients.thisMonth"),
                startDate: dayjs().startOf("month"),
                endDate: dayjs().endOf("month"),
            },
            {
                id: 7,
                label: "last month",
                name: t("clients.lastMonth"),
                startDate: dayjs().subtract(1, "month").startOf("month"),
                endDate: dayjs().subtract(1, "month").endOf("month"),
            },
        ],
        []
    );

    const applyRange = (range) => {
        const id = range?.id;
        switch (id) {
            case 0:
                setStartDate(new Date(dayjs().startOf("day")));
                setEndDate(new Date(dayjs()));
                setSelectedRange(0);
                break;
            case 1:
                setStartDate(new Date(dayjs().add(-1, "day")));
                setEndDate(new Date(dayjs()));
                setSelectedRange(1);
                break;
            case 2:
                setStartDate(new Date(dayjs().add(-1, "day").startOf("day")));
                setEndDate(new Date(dayjs().add(-1, "day").endOf("day")));
                setSelectedRange(2);
                break;
            case 3:
                setStartDate(new Date(dayjs().day(1).startOf("day")));
                setEndDate(new Date(dayjs().endOf("day")));
                setSelectedRange(3);
                break;
            case 4:
                setStartDate(new Date(dayjs().subtract(1, "week").day(1).startOf("day")));
                setEndDate(new Date(dayjs().day(0).endOf("day")));
                setSelectedRange(4);
                break;
            case 5:
                setStartDate(new Date(dayjs().subtract(1, "week").startOf("day")));
                setEndDate(new Date(dayjs().endOf("day")));
                setSelectedRange(5);
                break;
            case 6:
                setStartDate(new Date(dayjs().startOf("month")));
                setEndDate(new Date(dayjs().endOf("day")));
                setSelectedRange(6);
                break;
            case 7:
                setStartDate(new Date(dayjs().subtract(1, "month").startOf("month")));
                setEndDate(new Date(dayjs().subtract(1, "month").endOf("month")));
                setSelectedRange(7);
                break;
            default:
                break;
        }
    };

    const onChange = (dates) => {
        setSelectedRange();
        setStartDate(dates[0]);
        setEndDate(dates[1]);
    };

    const applyChange = () => {
        if (selectedRange) {
            dateChange([startDate, endDate]);
        } else {
            const start = new Date(dayjs(startDate).startOf("day"));
            const end = new Date(dayjs(endDate).endOf("day"));
            dateChange([start, end]);
        }
    };

    return (
        <Popover className="relative">
            <div className="flex min-w-50 flex-1 lg:min-w-64">
                <Popover.Button className="flex flex-1 rounded-[0.8125rem] border-[0.0938rem] border-gray-100 border-opacity-50 px-[0.80rem] py-2 text-13 leading-5 text-gray-400 text-opacity-75">
                    {/* {(!isEmpty(dateValue) || isDate(endDate)) && ( */}
                    <span className="text-xs font-bold text-primary-200 lg:text-13">
                        {dayjs(dateValue[0]).format("DD/MM/YYYY")} - {dayjs(dateValue[1]).format("DD/MM/YYYY")}
                    </span>
                    {/* )} */}
                    <span
                        style={{ backgroundColor: background }}
                        className={`label-top-animation flex gap-2 bg-white ${
                            !isEmpty(dateValue) ? "absolute translate-y-[-1.15rem]" : "translate-y-0"
                        }`}>
                        <div className="flex items-center bg-transparent pl-1">{icon}</div>
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
                <Popover.Panel className={`absolute z-20 mt-3 flex w-[33.25rem] rounded-20 bg-white shadow-menu ${right && "right-0"}`}>
                    <div className="flex flex-col justify-start space-y-4 border-r-2 border-gray-400 border-opacity-15 p-6 text-13">
                        <span className="font-bold text-gray-400">{t("clients.ranges")}:</span>
                        {dataRanges.map((range, key) => (
                            <button
                                onClick={() => applyRange(range)}
                                className={`flex justify-start hover:text-primary-200  ${
                                    selectedRange === key ? "font-semibold text-primary-200" : "text-gray-400 text-opacity-65"
                                }`}
                                key={key}>
                                {range.name}
                            </button>
                        ))}
                    </div>
                    <div className="flex flex-1 flex-col px-4 py-6">
                        <div className="picker-calendar mb-3 flex justify-center">
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => onChange(date)}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                inline
                                selectsRange
                                locale={lang}
                                maxDate={new Date()}
                            />
                        </div>
                        <div className={`mt-4 flex ${canDelete ? "justify-between" : "justify-end"}`}>
                            {canDelete && (
                                <button
                                    className="focus-visible:ring-2 inline-flex justify-center rounded-full border-1 border-transparent px-4 py-1 text-sm font-medium text-primary-200 focus:outline-none"
                                    onClick={clearDate}>
                                    {t("clients.erase")}
                                </button>
                            )}
                            <Popover.Overlay>
                                <button
                                    disabled={!isDate(endDate)}
                                    className={`focus-visible:ring-2 inline-flex cursor-pointer justify-center rounded-full border-1 border-transparent px-4 py-1 text-sm font-medium focus:outline-none ${
                                        isDate(endDate)
                                            ? "bg-primary-200 text-white hover:bg-primary-100"
                                            : "cursor-not-allowed bg-gray-300 text-gray-400 hover:bg-gray-325"
                                    }`}
                                    onClick={() => applyChange()}>
                                    {t("clients.apply")}
                                </button>
                            </Popover.Overlay>
                        </div>
                    </div>
                </Popover.Panel>
            </Transition>
        </Popover>
    );
};

export default DateRangePicker;
