import React from "react";
import { useTranslation } from "react-i18next";
import { Tab } from "@headlessui/react";
import { DownloadIcon5 } from "@apps/shared/icons";

const OperatorEmailFilter = (props) => {
    const { emailAttention, setEmailStatus, downloadActualEmails } = props;
    const { t } = useTranslation();

    const {
        Closed: closedEmails = 0,
        New: newEmails = 0,
        Open: openEmails = 0,
        Pending: pendingEmails = 0,
        Resolved: solvedEmails = 0,
        Total: totalEmails = 0,
        Draft: draftEmails = 0,
    } = emailAttention;

    const isActiveClassName = "w-fit items-center flex h-[2.5rem] rounded-[0.5rem] px-4 text-15 xxl:text-lg bg-[#EDF7F9] text-primary-200";
    const isNotActiveClassName = "w-fit items-center flex rounded-[0.5rem] px-4 py-1 text-gray-400";

    return (
        <div className="flex items-center justify-between space-x-2 px-6 py-4">
            <Tab.Group>
                <Tab.List className="flex space-x-2">
                    <div
                        className="flex cursor-pointer"
                        onClick={() => {
                            setEmailStatus("");
                        }}>
                        <Tab className={({ selected }) => (selected ? isActiveClassName : isNotActiveClassName)}>
                            <p className="pr-2 font-bold">{totalEmails}</p>
                            <p>{t("monitoring.Todos")}</p>
                        </Tab>
                    </div>
                    <div
                        className="flex cursor-pointer"
                        onClick={() => {
                            setEmailStatus("new");
                        }}>
                        <Tab className={({ selected }) => (selected ? isActiveClassName : isNotActiveClassName)}>
                            <p className="pr-2 font-bold">{newEmails}</p>
                            <p>{t("monitoring.Nuevos")}</p>
                        </Tab>
                    </div>
                    <div
                        className="flex cursor-pointer"
                        onClick={() => {
                            setEmailStatus("open");
                        }}>
                        <Tab className={({ selected }) => (selected ? isActiveClassName : isNotActiveClassName)}>
                            <p className="pr-2 font-bold">{openEmails}</p>
                            <p>{t("monitoring.Abiertos")}</p>
                        </Tab>
                    </div>
                    <div
                        className="flex cursor-pointer"
                        onClick={() => {
                            setEmailStatus("pending");
                        }}>
                        <Tab className={({ selected }) => (selected ? isActiveClassName : isNotActiveClassName)}>
                            <p className="pr-2 font-bold">{pendingEmails}</p>
                            <p>{t("monitoring.Pendientes")}</p>
                        </Tab>
                    </div>
                    <div
                        className="flex cursor-pointer"
                        onClick={() => {
                            setEmailStatus("resolved");
                        }}>
                        <Tab className={({ selected }) => (selected ? isActiveClassName : isNotActiveClassName)}>
                            <p className="pr-2 font-bold">{solvedEmails}</p>
                            <p>{t("monitoring.Resueltos")}</p>
                        </Tab>
                    </div>
                    <div
                        className="flex cursor-pointer"
                        onClick={() => {
                            setEmailStatus("closed");
                        }}>
                        <Tab className={({ selected }) => (selected ? isActiveClassName : isNotActiveClassName)}>
                            <p className="pr-2 font-bold">{closedEmails}</p>
                            <p>{t("monitoring.Cerrados")}</p>
                        </Tab>
                    </div>
                    <div
                        className="flex cursor-pointer"
                        onClick={() => {
                            setEmailStatus("draft");
                        }}>
                        <Tab className={({ selected }) => (selected ? isActiveClassName : isNotActiveClassName)}>
                            <p className="pr-2 font-bold">{draftEmails}</p>
                            <p>{t("emailStatus.draft")}</p>
                        </Tab>
                    </div>
                </Tab.List>
            </Tab.Group>
            <button className="hidden lg:flex" onClick={() => downloadActualEmails()}>
                <DownloadIcon5 width="1.875rem" height="1.875rem" />
            </button>
        </div>
    );
};

export default OperatorEmailFilter;
