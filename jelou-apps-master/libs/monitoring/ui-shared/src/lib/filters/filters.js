import get from "lodash/get";
import orderBy from "lodash/orderBy";

import dayjs from "dayjs";
import "dayjs/locale/es";
import { withTranslation } from "react-i18next";

import { DateIcon, OperatorIcon } from "@apps/shared/icons";
import { ComboboxSelect, DateRangePicker } from "@apps/shared/common";

const Filters = (props) => {
    const { company, onChange, setInitialDate, setFinalDate, t, initialDate, finalDate, value } = props;

    const seeAllLogs = get(company, "properties.seeAllLogs", false);

    let operators = seeAllLogs
        ? [{ id: -1, name: t("Todos") }, ...orderBy(props.operators, ["names"], ["asc"])]
        : orderBy(props.operators, ["names"], ["asc"]);

    const dateChange = (range) => {
        let [startDate, endDate] = range;
        setInitialDate(startDate);
        setFinalDate(dayjs(endDate).endOf("day").format());
    };

    const clearDate = () => {
        setInitialDate(dayjs(initialDate).startOf("day").format("DD-MM-YYYY"));
        setFinalDate(dayjs(finalDate).endOf("day").format("DD-MM-YYYY"));
    };

    return (
        <div className="flex w-full flex-col space-x-4 sm:flex-row sm:items-end">
            <div className="flex w-64">
                <ComboboxSelect
                    options={operators}
                    value={value}
                    label={t("Operador")}
                    icon={<OperatorIcon width="1.125rem" height="1rem" />}
                    handleChange={onChange}
                    name={"operador"}
                    hasCleanFilter={false}
                />
            </div>
            <div className="flex">
                <DateRangePicker
                    icon={<DateIcon width="1rem" height="1.0625rem" fill="#A6B4D0" />}
                    dateValue={[initialDate, finalDate]}
                    dateChange={dateChange}
                    clearDate={clearDate}
                />
            </div>
        </div>
    );
};

export default withTranslation()(Filters);
