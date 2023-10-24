import { ComboboxSelect } from "@apps/shared/common";
import { useContext, useEffect, useState } from "react";
import { resetSelectFilterAction, setSelectFilterAction } from "../../Hook/use-params-for-filters/useParamsForFilters";
import { RowsTableData } from "../../Table";

export function SelectFilter({ filter = {}, cleaner, resetPagination } = {}) {
    const { name, columns } = filter;
    const { name: labelOfFilter = null } = columns[0] || {};
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState({});
    const [firstTime, setFirstTime] = useState(false);

    const { dispatchForFilters } = useContext(RowsTableData);

    useEffect(() => {
        const { options = [] } = filter;
        const filterOptions = options.map((option) => ({
            name: option.name,
            value: option.value,
        }));

        setOptions(filterOptions);
    }, [filter]);

    const handleChange = (value) => {
        setValue(value);
        const { columns } = filter;
        const { key, type } = columns[0];

        let valueFilter = value.value;

        if (type === "boolean") {
            valueFilter = value.value === "true" ? true : false;
        }

        resetPagination();
        dispatchForFilters(setSelectFilterAction({ key, value: valueFilter }));

        if (!firstTime) {
            setFirstTime(true);
            cleaner.current.push(clearFilter);
        }
    };

    const clearFilter = () => {
        const { columns } = filter;
        const { key } = columns[0];

        setValue({});
        dispatchForFilters(resetSelectFilterAction({ key }));
    };

    return (
        options &&
        options.length > 0 && (
            <ComboboxSelect
                // icon={filter.icon}
                background={"#fff"}
                clearFilter={clearFilter}
                handleChange={handleChange}
                label={labelOfFilter}
                name={name}
                options={options}
                placeholder={name}
                value={value}
            />
        )
    );
}
