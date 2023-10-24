import { useContext, useState } from "react";
import dayjs from "dayjs";

import { DateRangePicker } from "../../../Reports/Table/Components/Filter/DateRangePicker";
import { RowsTableData } from "../../Table";
import { setDateFilterAction, resetDateFilterAction } from "../../Hook/use-params-for-filters/useParamsForFilters";
import { useDateFilter } from "../../../Reports/Table/Components/Filter/DateRangePicker/useDate";

export function DateFilter({ filter, cleaner, resetPagination }) {
    const { dispatchForFilters } = useContext(RowsTableData);
    const [firstTime, setFirstTime] = useState(false);
    const { columns } = filter;
    const { name: labelOfFilter = null } = columns[0] || {};

    const { clearDate, dataRanges, dateValue, endDate, onChange, rangeSelected, setRangeSelected, startDate } = useDateFilter({
        setSelected: () => null,
    });

    const dateSeleted = () => {
        const { columns } = filter;
        const { key } = columns[0];

        const dateFrom = dayjs(startDate).startOf("day").toJSON();
        const dateTo = dayjs(endDate).endOf("day").toJSON();

        resetPagination();

        dispatchForFilters(setDateFilterAction({ dateFrom, dateTo, key }));

        if (!firstTime) {
            setFirstTime(true);
            cleaner.current.push(custoClearDate);
        }
    };

    const custoClearDate = () => {
        const { columns } = filter;
        const { key } = columns[0];

        clearDate();
        setRangeSelected(null);
        dispatchForFilters(resetDateFilterAction({ key }));
    };

    return (
        <DateRangePicker
            label={labelOfFilter}
            areClearDatesAvailable={true}
            clearDate={custoClearDate}
            dataRanges={dataRanges}
            dateChange={dateSeleted}
            dateValue={dateValue}
            endDate={endDate}
            hasIcon={true}
            onChange={onChange}
            rangeSelected={rangeSelected}
            setRangeSelected={setRangeSelected}
            startDate={startDate}
        />
    );
}
