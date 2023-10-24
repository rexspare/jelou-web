import { useState } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

import { useOrders } from "../../../hooks/Oreders";

export function useDateFilter({ setSelected }) {
    const { t } = useTranslation();
    const [dateValue, setDateValue] = useState([]);
    const [endDate, setEndDate] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [wasUsed, setWasUsed] = useState(false);

    const { getOrders } = useOrders();

    const dataRanges = [
        {
            id: 0,
            label: "today",
            name: t("clients.today"),
            startDate: dayjs().startOf("day"),
            endDate: dayjs(),
        },
        {
            id: 1,
            label: "yesterday",
            name: t("clients.yesterday"),
            startDate: dayjs().add(-1, "day").startOf("day"),
            endDate: dayjs().add(-1, "day").endOf("day"),
        },
        {
            id: 2,
            label: "this week",
            name: t("clients.thisWeek"),
            startDate: dayjs().day(0).startOf("day"),
            endDate: dayjs().day(6).endOf("day"),
        },
        {
            id: 3,
            label: "last week",
            name: t("clients.lastWeek"),
            startDate: dayjs().subtract(1, "week").day(0).startOf("day"),
            endDate: dayjs().subtract(1, "week").day(6).endOf("day"),
        },
        {
            id: 4,
            label: "last seven days",
            name: t("clients.lastSevenDays"),
            startDate: dayjs().subtract(1, "week").startOf("day"),
            endDate: dayjs().endOf("day"),
        },
        {
            id: 5,
            label: "this month",
            name: t("clients.thisMonth"),
            startDate: dayjs().startOf("month"),
            endDate: dayjs().endOf("month"),
        },
        {
            id: 6,
            label: "last month",
            name: t("clients.lastMonth"),
            startDate: dayjs().subtract(1, "month").startOf("month"),
            endDate: dayjs().subtract(1, "month").endOf("month"),
        },
    ];

    const applyRange = (range) => {
        const id = range.id;
        switch (id) {
            case 0:
                setStartDate(new Date(dayjs().startOf("day")));
                setEndDate(new Date(dayjs()));
                break;
            case 1:
                setStartDate(new Date(dayjs().add(-1, "day").startOf("day")));
                setEndDate(new Date(dayjs().add(-1, "day").endOf("day")));
                break;
            case 2:
                setStartDate(new Date(dayjs().day(1).startOf("day")));
                setEndDate(new Date(dayjs().endOf("day")));
                break;
            case 3:
                setStartDate(new Date(dayjs().subtract(1, "week").day(1).startOf("day")));
                setEndDate(new Date(dayjs().day(0).endOf("day")));
                break;
            case 4:
                setStartDate(new Date(dayjs().subtract(1, "week").startOf("day")));
                setEndDate(new Date(dayjs().endOf("day")));
                break;
            case 5:
                setStartDate(new Date(dayjs().startOf("month")));
                setEndDate(new Date(dayjs().endOf("day")));
                break;
            case 6:
                setStartDate(new Date(dayjs().subtract(1, "month").startOf("month")));
                setEndDate(new Date(dayjs().subtract(1, "month").endOf("month")));
                break;
            default:
                console.log("custom ranges");
                break;
        }
    };

    const onChange = (type, dates) => {
        switch (type) {
            case 0: {
                applyRange(dates[0]);
                break;
            }
            default: {
                const [start, end] = dates;
                setStartDate(new Date(start.setHours(0, 0, 0, 0)));
                setEndDate(end);
                break;
            }
        }
    };

    const dateChange = (range) => {
        let [startDate, endDate] = range;
        const startDateFormat = dayjs(startDate).startOf("day").format("YYYY/MM/DD HH:mm:ss");
        const endDateFormat = dayjs(endDate).endOf("day").format("YYYY/MM/DD HH:mm:ss");

        const value = {
            scopes: [
                {
                    name: "whereDate",
                    parameters: [startDateFormat, endDateFormat],
                },
            ],
        };

        setSelected((preState) => ({ ...preState, date: value }));
        setDateValue([startDate, endDate]);
        setWasUsed(true);
    };

    const clearDateFields = () => {
        setDateValue([]);
        setStartDate(null);
        setEndDate(null);
    };

    const clearDate = () => {
        clearDateFields();

        if (wasUsed) {
            setSelected((preState) => {
                delete preState.date;

                // if (Object.keys(preState).length === 0 && isOrderPage) {
                if (Object.keys(preState).length === 0) {
                    getOrders();
                    setWasUsed(false);
                    return {};
                }

                // if (Object.keys(preState).length === 0 && !isOrderPage) {
                //     initProducts();
                //     setWasUsed(false);
                //     return {};
                // }

                return { ...preState };
            });
        }
    };

    return { startDate, endDate, dateValue, dataRanges, onChange, dateChange, clearDate, clearDateFields };
}
