import React from "react";
import Tabs from "../tabs/tabs";
import HeaderTab from "../header-tab/header-tab";
import { DateIcon, RefreshIcon } from "@apps/shared/icons";
import DateRangePicker from "../date-picker/date-picker";
import { useTranslation } from "react-i18next";
import get from "lodash/get";

const OperatorFilter = (props) => {
    const {
        selectChat,
        selectTicket,
        showChats,
        showTickets,
        dateChange,
        clearDate,
        marked1,
        marked2,
        showManagementSummary,
        showConnections,
        reload,

        selectConnections,
        date,
        operatorTeams,
    } = props;
    const { t } = useTranslation();

    const operatorTeamsViews = operatorTeams.reduce((acc, item) => {
        const views = get(item, "properties.views", []);
        views.forEach((view) => {
            if (!acc.includes(view)) {
                acc.push(view);
            }
        });
        return acc;
    }, []);

    const seeEmails = operatorTeamsViews.includes("emails");
    const seeChats = operatorTeamsViews.includes("chats");

    return (
        <div className="flex flex-col">
            <div className="flex w-full items-center justify-between border-b-default border-gray-100/25 px-2 pt-2">
                <HeaderTab
                    marked1={marked1}
                    marked2={marked2}
                    showFirstTab={showManagementSummary}
                    showSecondTab={showConnections}
                    title1={t("monitoring.Resumen de gestión")}
                    title2={t("monitoring.Conexiones")}
                />
                <div className="flex items-center space-x-3">
                    <div className="w-48 lg:w-64">
                        <DateRangePicker
                            dateValue={date}
                            icon={<DateIcon width="1rem" height="1.0625rem" fill="#A6B4D0" />}
                            dateChange={dateChange}
                            clearDate={clearDate}
                            background={"#EEF1F4"}
                            right={true}
                        />
                    </div>
                    <button className="flex" onClick={() => reload()}>
                        <RefreshIcon className="hover:text-primary-200" height="1.3125rem" width="1.25rem" />
                    </button>
                </div>
            </div>
            {!selectConnections && (
                <Tabs
                    marked1={selectChat}
                    marked2={selectTicket}
                    title1={seeChats ? t("Chats") : ""}
                    title2={seeEmails ? t("Emails") : ""}
                    showFirstTab={showChats}
                    showSecondTab={showTickets}
                    backgroundColor="#fff"
                    borderBottomLeftRadius="1rem"
                    borderBottomRightRadius="1rem"
                    isBold
                />
            )}
        </div>
    );
};

export default OperatorFilter;
