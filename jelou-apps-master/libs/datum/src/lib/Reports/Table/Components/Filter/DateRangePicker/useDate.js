import dayjs from "dayjs";
import omit from "lodash/omit";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function useDateFilter({ setSelected }) {
    const { t } = useTranslation();
    const [dateValue, setDateValue] = useState([]);
    const [endDate, setEndDate] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [rangeSelected, setRangeSelected] = useState(null);
    const [wasUsed, setWasUsed] = useState(false);

    const dataRanges = [
        {
            id: 0,
            label: "today",
            name: t("clients.today"),
        },
        {
            id: 1,
            label: "yesterday",
            name: t("clients.yesterday"),
        },
        {
            id: 2,
            label: "this week",
            name: t("clients.thisWeek"),
        },
        {
            id: 3,
            label: "last week",
            name: t("clients.lastWeek"),
        },
        {
            id: 4,
            label: "last seven days",
            name: t("clients.lastSevenDays"),
        },
        {
            id: 5,
            label: "this month",
            name: t("clients.thisMonth"),
        },
        {
            id: 6,
            label: "last month",
            name: t("clients.lastMonth"),
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
            case 7: //this year
                setStartDate(new Date(dayjs().startOf("year")));
                setEndDate(new Date(dayjs()));
                break;
            default:
                break;
        }
    };

    const onChange = (type, dates) => {
        switch (type) {
            case 0:
                applyRange(dates[0]);
                break;
            default: {
                const [start, end] = dates;
                setStartDate(new Date(start.setHours(0, 0, 0, 0)));
                setEndDate(end);
                setDateValue([]);
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
            setSelected(omit(setSelected, "date"));
            setWasUsed(false);
        }
    };

    return { startDate, endDate, dateValue, dataRanges, rangeSelected, setRangeSelected, onChange, dateChange, clearDate, clearDateFields };
}
