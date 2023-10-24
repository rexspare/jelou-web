import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

import { DateRangePicker } from "./DateRangePicker";

export function DateFilter({ dateProps, filter }) {
    const { dataRanges, dateChange, dateValue, endDate, onChange, rangeSelected, setRangeSelected, startDate } = dateProps;
    const { t } = useTranslation();
    const dataRangesRef = useRef([
        ...dataRanges,
        {
            id: 7,
            label: "this year",
            name: t("dataReport.thisYear"),
            startDate: dayjs().startOf("year"),
            endDate: dayjs(),
        },
    ]);

    useEffect(() => {
        resetDate();
    }, []);

    const PERIODS = useMemo(
        () => [
            {
                id: 0,
                key: "today",
                value: "day",
                label: t("clients.today"),
            },
            {
                id: 2,
                key: "currentWeek",
                value: "week",
                label: t("clients.thisWeek"),
            },
            {
                id: 5,
                label: t("clients.thisMonth"),
                key: "currentMonth",
                value: "month",
            },
            {
                id: 7,
                key: "currentYear",
                value: "year",
                label: t("dataReport.thisYear"),
            },
        ],
        []
    );

    const resetDate = useCallback(() => {
        const defaultPeriod = filter?.defaultPeriod || "currentYear";

        const periodDefault = PERIODS.find((period) => period.key === defaultPeriod);

        const startAt = dayjs().startOf(periodDefault.value);
        const endAt = dayjs().endOf(periodDefault.value);

        dateChange([startAt, endAt]);
        setRangeSelected({ key: periodDefault.id, label: periodDefault.label });
    }, [filter, dateChange]);

    return (
        <div className="flex flex-1 w-60">
            <DateRangePicker
                clearDate={resetDate}
                dataRanges={dataRangesRef.current}
                dateChange={dateChange}
                dateValue={dateValue}
                endDate={endDate}
                hasIcon={false}
                onChange={onChange}
                rangeSelected={rangeSelected}
                setRangeSelected={setRangeSelected}
                startDate={startDate}
                areClearDatesAvailable={false}
            />
        </div>
    );
}
