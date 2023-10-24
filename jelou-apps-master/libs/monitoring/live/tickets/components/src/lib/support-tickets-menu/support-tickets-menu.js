import { useTranslation } from "react-i18next";
import { Tab } from "@headlessui/react";

export function SupportTicketsMenu(props) {
    const {
        // toExpireEmails,
        setEmailsStatus,
        totalEmails,
        newEmails,
        openEmails,
        pendingEmails,
        closedEmails,
        solvedEmails,
        notAssignedEmails,
        setCurrentTab,
        drafts,
    } = props;

    const { t } = useTranslation();
    const isActiveClassName = " w-fit items-center flex h-[2.5rem] rounded-[0.5rem] px-4 text-15 xxl:text-lg bg-[#EDF7F9] text-primary-200";
    const isNotActiveClassName = "w-fit items-center text-15 flex rounded-[0.5rem] px-4 py-1 text-gray-400";

    return (
        <div className="flex items-center space-x-2 px-6 pb-4 ">
            <Tab.Group>
                <Tab.List className={`flex items-center`}>
                    <div
                        onClick={() => {
                            setEmailsStatus("");
                            setCurrentTab("all");
                        }}>
                        <Tab className={({ selected }) => (selected ? isActiveClassName : isNotActiveClassName)}>
                            <p className=" pr-2 font-bold">{totalEmails}</p>
                            <p>{t("monitoring.Todos")}</p>
                        </Tab>
                    </div>
                    <div
                        onClick={() => {
                            setEmailsStatus("new");
                            setCurrentTab("new");
                        }}>
                        <Tab className={({ selected }) => (selected ? isActiveClassName : isNotActiveClassName)}>
                            <p className=" pr-2 font-bold">{newEmails}</p>
                            <p>{t("monitoring.Nuevos")}</p>
                        </Tab>
                    </div>
                    <div
                        onClick={() => {
                            setEmailsStatus("open");
                            setCurrentTab("open");
                        }}>
                        <Tab className={({ selected }) => (selected ? isActiveClassName : isNotActiveClassName)}>
                            <p className=" pr-2 font-bold">{openEmails}</p>
                            <p>{t("monitoring.Abiertos")}</p>
                        </Tab>
                    </div>
                    <div
                        onClick={() => {
                            setEmailsStatus("pending");
                            setCurrentTab("pending");
                        }}>
                        <Tab className={({ selected }) => (selected ? isActiveClassName : isNotActiveClassName)}>
                            <p className=" pr-2 font-bold">{pendingEmails}</p>
                            <p>{t("monitoring.Pendientes")}</p>
                        </Tab>
                    </div>
                    <div
                        onClick={() => {
                            setEmailsStatus("resolved");
                            setCurrentTab("resolved");
                        }}>
                        <Tab className={({ selected }) => (selected ? isActiveClassName : isNotActiveClassName)}>
                            <p className=" pr-2 font-bold">{solvedEmails}</p>
                            <p>{t("monitoring.Resueltos")}</p>
                        </Tab>
                    </div>
                    {/* <div
                        onClick={() => {
                            setEmailsStatus("");
                        }}>
                        <Tab className={({ selected }) => (selected ? isActiveClassName : isNotActiveClassName)}>
                            <p className=" pr-2 font-bold">{toExpireEmails}</p>
                            <p>{t("monitoring.Por Expirar")}</p>
                        </Tab>
                    </div> */}
                    <div
                        onClick={() => {
                            setEmailsStatus("closed");
                            setCurrentTab("closed");
                        }}>
                        <Tab className={({ selected }) => (selected ? isActiveClassName : isNotActiveClassName)}>
                            <p className=" pr-2 font-bold">{closedEmails}</p>
                            <p>{t("monitoring.Cerrados")}</p>
                        </Tab>
                    </div>
                    <div
                        onClick={() => {
                            setEmailsStatus("notAssigned");
                            setCurrentTab("notAssigned");
                        }}>
                        <Tab className={({ selected }) => (selected ? isActiveClassName : isNotActiveClassName)}>
                            <p className=" pr-2 font-bold">{notAssignedEmails}</p>
                            <p>{t("monitoring.Sin Asignar")}</p>
                        </Tab>
                    </div>
                    <div
                        onClick={() => {
                            setEmailsStatus("draft");
                            setCurrentTab("draft");
                        }}>
                        <Tab className={({ selected }) => (selected ? isActiveClassName : isNotActiveClassName)}>
                            <p className=" pr-2 font-bold">{drafts}</p>
                            <p>{t("emailStatus.draft")}</p>
                        </Tab>
                    </div>
                </Tab.List>
            </Tab.Group>
        </div>
    );
}
export default SupportTicketsMenu;
