import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import flatpickr from "flatpickr";
import "flatpickr/dist/themes/light.css";
import { Spanish } from "flatpickr/dist/l10n/es.js";
import { english } from "flatpickr/dist/l10n/default.js";

import { SelectSearch } from "@apps/shared/common";
import { setFilters } from "@apps/redux/store";

import dayjs from "dayjs";
import "dayjs/locale/es";
import isEmpty from "lodash/isEmpty";
import { withTranslation } from "react-i18next";

const Filters = (props) => {
    const {
        setInitialDate,
        setFinalDate,
        setPageLimit,
        setPageLimitNotAssigned,
        setRows,
        setRowsNotAssigned,
        searchReports,
        searchMissedConversation,
        value,
        onClick,
        placeholder,
        t,
        dailyConversations,
        notDerivedMetrics,
        setOperatorNotFound,
        setOperatorNotSchedule,
        KIACompany,
        teamsArray,
    } = props;

    let { initialDate, finalDate } = props;
    const dispatch = useDispatch();

    initialDate = dayjs(initialDate).format("DD-MM-YYYY");
    finalDate = dayjs(finalDate).format("DD-MM-YYYY");
    const teamScopes = useSelector((state) => state.teamScopes);
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";

    let options = [{ id: -1, name: t("Todos") }, ...props.options];
    let operators = [{ id: -1, name: t("Todos") }, ...props.operatorArray];
    const flatpicker = document.getElementsByClassName("flatpicker");

    useEffect(() => {
        flatpickr(flatpicker, {
            dateFormat: "d-m-Y",
            locale: lang === "es" ? Spanish : english,
            mode: "range",
            defaultDate: [initialDate, finalDate],
            onClose: function (selectedDates) {
                setInitialDate(dayjs(selectedDates[0]).hour(0).minute(0).second(0).format());
                setFinalDate(dayjs(selectedDates[1]).hour(23).minute(59).second(59).format());
                dispatch(setFilters({ initialDate: dayjs(selectedDates[0]).hour(0).minute(0).second(0).format() }));
                dispatch(setFilters({ finalDate: dayjs(selectedDates[1]).hour(23).minute(59).second(59).format() }));
            },
        });
    });

    return (
        <header className="flex">
            <div className="w-full flex-col justify-between space-y-2 lg:flex lg:flex-row lg:space-y-0 xl:items-end">
                {options.length > 2 && (
                    <div className="flex flex-col sm:mr-8 sm:w-64 xxl:w-72">
                        <SelectSearch
                            title={t("Bots")}
                            className="w-full rounded-full sm:w-64 xxl:w-72"
                            options={options}
                            placeholder={t(placeholder)}
                            value={value}
                            name="bots"
                            onChange={onClick}
                            padding="py-3 px-5 shadow-outline-input"
                        />
                    </div>
                )}
                {((!isEmpty(teamsArray) && teamsArray.length > 1) || !isEmpty(teamScopes)) && !KIACompany && (
                    <div className="flex flex-col sm:mr-8 sm:w-64 xxl:w-72">
                        <SelectSearch
                            title={t("Equipos")}
                            className="w-full rounded-full sm:w-64"
                            hasAll={true}
                            options={isEmpty(teamScopes) ? teamsArray : teamScopes}
                            value={props.currentTeam.toString()}
                            onChange={props.selectTeam}
                            name="teams"
                            placeholder={t("Equipos")}
                            padding="py-3 px-5 shadow-outline-input"
                        />
                    </div>
                )}
                {!isEmpty(operators) && operators.length > 0 && (
                    <div className="flex flex-col sm:mr-8 sm:w-64 xxl:w-72">
                        <SelectSearch
                            title={t("Operadores")}
                            className="w-full rounded-full sm:w-64 xxl:w-72"
                            hasAll={true}
                            options={operators}
                            value={props.currentOperator.toString()}
                            onChange={props.selectOperator}
                            name="operador"
                            placeholder={t("Seleccionar operador")}
                            padding="py-3 px-5 shadow-outline-input"
                        />
                    </div>
                )}
                <div className="mt-6 flex flex-1 justify-between sm:mt-0 xl:flex-row xl:justify-end">
                    <div className="mr-2 flex flex-col sm:mr-8">
                        <div className="my-2 ml-5 text-sm font-bold leading-5 text-gray-500 xxl:text-15">{t("Fecha")}</div>
                        <input
                            type="text"
                            name="date"
                            className="select-search-backg flatpicker ring-0 focus:ring-0 border-0 py-3 px-5 shadow-outline-input focus:border-0 focus:outline-none"
                            id="flatpicker"
                            placeholder={t("Seleccionar fecha")}></input>
                    </div>
                    <div className="flex items-end justify-end">
                        <button
                            type="button"
                            className="button-primary hover:button-primary"
                            onClick={() => {
                                setPageLimit(1);
                                setPageLimitNotAssigned(1);
                                setRows(10);
                                setRowsNotAssigned(10);
                                searchReports();
                                searchMissedConversation();
                                dailyConversations();
                                setOperatorNotFound("-");
                                setOperatorNotSchedule("-");
                                notDerivedMetrics();
                            }}>
                            {t("Aplicar")}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};
export default withTranslation()(Filters);
