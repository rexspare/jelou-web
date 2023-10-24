import "dayjs/locale/es";
import dayjs from "dayjs";
import get from "lodash/get";
import sortBy from "lodash/sortBy";
import isEmpty from "lodash/isEmpty";
import toUpper from "lodash/toUpper";
import React, { useRef, useEffect } from "react";
import { useOnClickOutside } from "@apps/shared/hooks";
import { NewFormModal } from "@apps/pma/ui-shared";
import { useTranslation } from "react-i18next";
import TimelineEmail from "../timeline-email/timeline-email";

const FollowUpEmailHistory = (props) => {
    const { closeModal, supportTicketFollowUp, followUpMessages } = props;
    const { t } = useTranslation();
    const scrollUpRef = useRef(null);
    const ref = useRef();
    useOnClickOutside(ref, closeModal);

    const handler = (e) => {
        if (e.keyCode === 27) {
            closeModal();
        }
    };

    let sortedMessages = sortBy(
        followUpMessages.filter((message) => message.supportTicketId === get(supportTicketFollowUp, "_id", "")),
        (data) => {
            return dayjs(data.createdAt);
        }
    );

    useEffect(() => {
        document.addEventListener("keyup", handler);
        return () => {
            document.removeEventListener("keyup", handler);
        };
    }, []);

    const RenderButton = ({ status }) => {
        const badgeStyle = "justify-center inline-flex items-center h-[1.25rem] px-2 rounded-[0.4375rem] text-[0.625rem] font-bold w-fit";
        switch (toUpper(status)) {
            case "NEW":
                return <span className={`${badgeStyle} bg-[#FFE18566] uppercase text-[#D39C00]`}>{`${"Estado: "} ${t(status)}`}</span>;
            case "OPEN":
                return <span className={`${badgeStyle} bg-[#00B3C71A] uppercase text-[#00B3C7]`}>{`${"Estado: "} ${t(status)}`}</span>;
            case "PENDING":
                return <span className={`${badgeStyle} bg-[#E47B6A40] uppercase text-[#B95C49]`}>{`${"Estado: "} ${t(status)}`}</span>;
            case "RESOLVED":
                return <span className={`${badgeStyle} bg-[#209F8B26] uppercase text-[#209F8B]`}>{`${"Estado: "} ${t(status)}`}</span>;
            case "CLOSED":
                return <span className={`${badgeStyle} bg-[#a6b4d0] bg-opacity-25 uppercase text-[#727C94A6]`}>{`${"Estado: "} ${t(status)}`}</span>;
            default:
                return <span className={`${badgeStyle} bg-[#FFE18566] uppercase text-[#D39C00]`}>{`${"Estado: "} ${t(status)}`}</span>;
        }
    };

    const RenderTeam = ({ team }) => {
        const badgeStyle = "justify-center inline-flex items-center h-[1.25rem] px-2 rounded-[0.4375rem] text-[0.625rem] font-bold w-fit";
        return <span className={`${badgeStyle} bg-[#209F8B26] uppercase text-[#209F8B]`}>{`${"equipo: "} ${t(team)}`}</span>;
    };

    const RenderFavorite = () => {
        const badgeStyle = "justify-center inline-flex items-center h-[1.25rem] px-2 rounded-[0.4375rem] text-[0.625rem] font-bold w-fit";
        return <span className={`${badgeStyle} bg-[#FFE18566] uppercase text-[#D39C00]`}>{t("pma.Maracado como favorito")}</span>;
    };

    const RenderPriority = ({ priority }) => {
        const badgeStyle = "justify-center inline-flex items-center h-[1.25rem] px-2 rounded-[0.4375rem] text-[0.625rem] font-bold w-fit";
        switch (toUpper(priority)) {
            case "URGENT":
                return <span className={`${badgeStyle} bg-[#E47B6A] uppercase text-[#A83927]`}>{`${"prioridad: "} ${t(priority)}`}</span>;
            case "HIGH":
                return <span className={`${badgeStyle} bg-[#FFBB36] uppercase text-[#A83927]`}>{`${"prioridad: "} ${t(priority)}`}</span>;
            case "NORMAL":
                return <span className={`${badgeStyle} bg-[#83BF4F] uppercase text-[#209F8B]`}>{`${"prioridad: "} ${t(priority)}`}</span>;
            case "LOW":
                return <span className={`${badgeStyle} bg-[#4FD2E0] uppercase text-[#00B3C7]`}>{`${"prioridad: "} ${t(priority)}`}</span>;
            default:
                return (
                    <span className={`${badgeStyle} bg-[#a6b4d0] bg-opacity-25 uppercase text-[#727C94A6]`}>{`${"prioridad: "} ${t(priority)}`}</span>
                );
        }
    };

    return (
        <NewFormModal onClose={closeModal}>
            <div
                className="relative max-h-[90vh] min-w-[64rem] max-w-sm transform overflow-auto rounded-[1.375rem] bg-[#EDEEF3] px-4 pt-5 pb-4 shadow-modal transition-all sm:p-6"
                ref={ref}>
                <div className="flex items-center space-x-2">
                    <div className="text-left text-base font-bold text-gray-400 md:text-xl">{`${t("Email")} #${get(
                        supportTicketFollowUp,
                        "number",
                        ""
                    )}`}</div>
                </div>

                <div className="flex flex-col space-y-3">
                    <button className="absolute right-0 top-0 mr-4 mt-4" onClick={() => closeModal()}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M0.744913 12.7865L3.2609 15.3025L8.02135 10.5421L12.7605 15.2812L15.2737 12.768L10.5346 8.02887L15.2817 3.28171L12.7657 0.765728L8.01857 5.51289L3.25284 0.747158L0.73964 3.26036L5.50537 8.02609L0.744913 12.7865Z"
                                fill="#D7D7D7"
                            />
                        </svg>
                    </button>
                    <div className="flex w-full items-center">
                        <div className="flex space-x-2">
                            {!isEmpty(get(supportTicketFollowUp, "team.name", "")) && (
                                <RenderTeam team={get(supportTicketFollowUp, "team.name", "")} />
                            )}
                            <RenderButton status={get(supportTicketFollowUp, "status", "")} />
                            <RenderPriority priority={get(supportTicketFollowUp, "priority", "")} />
                            {get(supportTicketFollowUp, "isFavorite", false) && (
                                <RenderFavorite favorite={get(supportTicketFollowUp, "isFavorite", false)} />
                            )}
                            <span
                                className={`inline-flex h-[1.25rem] w-fit items-center justify-center rounded-[0.4375rem] bg-[#a6b4d0] bg-opacity-25 px-2 text-[0.625rem] font-bold uppercase text-[#727C94A6]`}>
                                <span className="font-semibold">{get(supportTicketFollowUp, "dueAt") && "Expiró: "}</span>
                                <span>
                                    {get(supportTicketFollowUp, "dueAt") &&
                                        dayjs(get(supportTicketFollowUp, "dueAt")).locale("es").format("DD MMMM YY")}
                                </span>
                            </span>
                        </div>
                    </div>
                    <div className="mb-[2rem] flex w-full flex-1 flex-col overflow-y-auto overflow-x-hidden">
                        <div className="flex w-full flex-col space-y-5 rounded-xl mid:flex-1">
                            <div className="flex w-full flex-col mid:rounded-l-xl">
                                <div className="pb-2">
                                    <div className="flex flex-col">
                                        <span className="text text-[2rem] font-bold text-gray-400">{get(supportTicketFollowUp, "title", "")}</span>
                                    </div>
                                </div>

                                <div className="flex flex-1">
                                    <TimelineEmail sortedMessages={sortedMessages} scrollUpRef={scrollUpRef} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </NewFormModal>
    );
};

export default FollowUpEmailHistory;
