import { ComboboxSelect, DateRangePicker, Input } from "@apps/shared/common";
import { BotIcon, DateIcon, OperatorIcon, SearchIcon } from "@apps/shared/icons";
import dayjs from "dayjs";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { useRef } from "react";
import { withTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import GlobalSearchEmails from "../global-search-emails/global-search-emails";

export function HistoryFilters(props) {
    const {
        dailyConversations,
        setShowEmail,
        emails,
        clearSearchFilter,
        emailsSearchBy,
        setEmailsSearchBy,
        t,
        botSelected,
        operatorSelected,
        selectBot,
        selectOperator,
        cleanBots,
        cleanOperators,
        botOptions,
        operatorOptions,
        setMess,
        finalDate,
        initialDate,
        setFinalDate,
        setPageLimit,
        setInitialDate,
        setClientNumber,
        setIsLoadingConversations,
        emailsQuerySearch,
        setEmailsQuerySearch,
    } = props;

    const dateChange = (range) => {
        let [startDate, endDate] = range;
        setInitialDate(startDate);
        setFinalDate(new Date(dayjs(endDate).endOf("day")));
        // setIsOpen(false);
    };

    const clearDate = () => {
        setInitialDate(dayjs(initialDate).startOf("day").format("DD-MM-YYYY"));
        setFinalDate(dayjs(finalDate).endOf("day").format("DD-MM-YYYY"));
        // setIsOpen(false);
    };

    const searchButton = useRef();

    const setArchivedSearch = (input) => {
        setEmailsQuerySearch(input);
        setShowEmail(false);
    };

    const typeSearchBy = [
        { id: 0, name: "#", searchBy: "number", isNumber: true },
        { id: 3, name: t("globalSearch.Asunto"), searchBy: "title", isNumber: false },
        { id: 1, name: t("globalSearch.Remitente"), searchBy: "user.name,creationDetails.From", isNumber: false },
        { id: 2, name: t("globalSearch.Destinatario"), searchBy: "creationDetails.To", isNumber: false },
        {
            id: 4,
            name: t("globalSearch.Contacto"),
            searchBy: "user.name,creationDetails.To,creationDetails.From,creationDetails.CC,user.email",
            isNumber: false,
        },
        { id: 5, name: "CC", searchBy: "creationDetails.CC", isNumber: false },
    ];

    const params = useParams();

    const subsection = get(params, "subsection", "");

    return (
        <div className="flex-1 flex-col items-center space-x-4 rounded-t-xl border-b-1 border-gray-100 border-opacity-25 bg-white p-3 px-3 lg:flex lg:flex-row">
            {subsection === "emails" && (
                <div className="relative w-70 p-3">
                    <GlobalSearchEmails
                        searchButton={searchButton}
                        setQuery={setArchivedSearch}
                        query={emailsQuerySearch}
                        searchBy={emailsSearchBy}
                        setSearchBy={setEmailsSearchBy}
                        clean={clearSearchFilter}
                        typeSearchBy={typeSearchBy}
                        type="tickets"
                    />
                    {!isEmpty(emailsQuerySearch) && isEmpty(emails) && (
                        <span className="absolute mt-1 flex w-full justify-end pr-6 text-11 italic text-red-675">*No se encontraron resultados</span>
                    )}
                </div>
            )}
            {subsection === "chats" && (
                <div className="flex w-full flex-col sm:w-64">
                    <Input
                        autoFocus={true}
                        type="text"
                        className="font-13 flex w-full max-w-xs rounded-[0.875rem] border-1.5 border-gray-100 border-opacity-50 bg-white px-[1.2rem] !py-[0.3rem] pl-5 text-gray-500 outline-none ring-transparent focus:border-gray-100 focus:outline-none focus:ring-transparent"
                        name="phoneNumber"
                        placeholder={t("monitoring.Id de cliente")}
                        onChange={setClientNumber}
                        onKeyPress={(evt) => {
                            if (evt.key === "Enter") {
                                setPageLimit(1);
                                setIsLoadingConversations(true);
                                dailyConversations();
                                setMess([]);
                            }
                        }}
                    />
                </div>
            )}

            {botOptions.length > 1 && (
                <div className="flex w-64 flex-col">
                    <ComboboxSelect
                        options={botOptions}
                        icon={<BotIcon width="1.3125rem" height="1rem" />}
                        value={botSelected}
                        label={"Bots"}
                        handleChange={selectBot}
                        name={"bots"}
                        clearFilter={cleanBots}
                    />
                </div>
            )}
            {operatorOptions.length > 1 && (
                <div className="flex w-64 flex-col">
                    <ComboboxSelect
                        options={operatorOptions}
                        value={operatorSelected}
                        label={t("monitoring.operador")}
                        icon={<OperatorIcon width="1.3125rem" height="1rem" />}
                        handleChange={selectOperator}
                        name={"operador"}
                        clearFilter={cleanOperators}
                    />
                </div>
            )}

            {/* {teamOptions.length > 1 && (
                <div className="flex flex-col w-64">
                    <ComboboxSelect
                        options={teamOptions}
                        value={teamSelected}
                        label={t("monitoring.Equipos")}
                        icon={<TeamIcon width="1.3125rem" fillOpacity="0.75" height="1rem" />}
                        handleChange={selectTeam}
                        name={"team"}
                        clearFilter={cleanTeams}
                    />
                </div>
            )} */}

            <div className="mt-6 flex flex-col sm:mr-8 sm:mt-0">
                <DateRangePicker
                    icon={<DateIcon width="1rem" height="1.0625rem" fill="#A6B4D0" />}
                    dateValue={[initialDate, finalDate]}
                    dateChange={dateChange}
                    clearDate={clearDate}
                    right={true}
                    canDelete={false}
                />
            </div>
            {subsection === "chats" && (
                <button
                    type="button"
                    className="button-primary hover:button-primary !px-2"
                    onClick={() => {
                        setPageLimit(1);
                        setIsLoadingConversations(true);
                        dailyConversations();
                        setMess([]);
                    }}>
                    <SearchIcon fill={"#fff"} width="1rem" height="1rem" fillOpacity={"1"} />
                </button>
            )}
        </div>
    );
}

export default withTranslation()(HistoryFilters);
