import React from "react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import "dayjs/locale/en";
import "dayjs/locale/pt";
import DatePicker from "react-datepicker";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const PeriodPicker = (props) => {
    const { actualDateFinal = false, expirationDate, setShowMenu, setDueDate, row, styles, attributes, setPopperElement } = props;
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";

    const onChange = (date) => {
        const differenceDays = dayjs(dayjs(date).hour(23).minute(59).second(59).format()).diff(actualDateFinal, "day");
        if (differenceDays >= 0) {
            setDueDate(dayjs(date).hour(23).minute(59).second(59).format(), row);
        }
        setShowMenu(false);
    };

    return (
        <div
            ref={setPopperElement}
            style={styles.popper}
            {...attributes.popper}
            className="absolute z-100 rounded-md bg-white px-4 pt-3 pb-3 shadow-loading">
            <div>
                <DatePicker selected={expirationDate} onChange={onChange} startDate={expirationDate} inline locale={lang} />
            </div>
        </div>
    );
};

export default withTranslation()(PeriodPicker);
