import { Modal, SkeletonModal } from "@apps/shared/common";
import get from "lodash/get";
import has from "lodash/has";
import { CalendarIcon, CloseIcon, View } from "@apps/shared/icons";
import { useOnClickOutside } from "@apps/shared/hooks";
import { useRef } from "react";
import Tippy from "@tippyjs/react";
import { Link } from "react-router-dom";
import { PreviewTicketBubble } from "@apps/monitoring/ui-shared";

export function EmailPreviewModal(props) {
    const {
        emailPreviewIsLoading,
        t,
        getStatusBgColor,
        getStatusTextColor,
        getDateColor,
        priorityFlagIcon,
        previewDetails,
        setShowEmailPreviewModal,
        emailInfo,
        priorityFlagTitle,
    } = props;

    const header = get(previewDetails, "header", "");
    const messagesAndEvents = get(previewDetails, "messagesAndEvents", []);

    const eventsArray = messagesAndEvents.filter((message) => has(message, "event"));
    const messageArray = messagesAndEvents.filter((message) => !has(message, "event"));

    const previewRef = useRef(null);

    useOnClickOutside(previewRef, () => setShowEmailPreviewModal(false));

    return (
        <Modal>
            <div className="fixed inset-x-0 bottom-0 z-120 px-4 pb-6 sm:inset-0 sm:flex sm:items-center sm:justify-center sm:p-0">
                <div className="fixed inset-0 transition-opacity">
                    <div className="absolute inset-0 z-20 bg-gray-500 opacity-50"></div>
                </div>
                <div className="relative min-h-view w-170 transform rounded-3xl bg-gray-50 pb-4 pl-4 pr-6 pt-5 shadow-modal transition-all">
                    {emailPreviewIsLoading ? (
                        <SkeletonModal />
                    ) : (
                        <div ref={previewRef}>
                            <Tippy content={t("monitoring.seeEmail")} theme="light" arrow={false} placement={"bottom"}>
                                <Link
                                    to={{ pathname: "/monitoring/history/emails" }}
                                    state={emailInfo}
                                    className=" absolute right-3 top-[1.4rem] mr-8">
                                    <View width="1.65rem" height="1.65rem" fill="currentColor" className="text-gray-400" />
                                </Link>
                            </Tippy>

                            <button onClick={() => setShowEmailPreviewModal(false)} className="absolute right-3 top-3 ">
                                <CloseIcon className="fill-current text-gray-400" width="1rem" height="1rem" />
                            </button>
                            <div className="flex items-center gap-4 pl-2">
                                <p className="text-lg font-semibold text-gray-350">{`Email #${header.emailNumber}`}</p>
                                <div className={`flex items-center gap-2 rounded-1 border-default border-${getDateColor(header.dueAt)} px-2 py-1`}>
                                    <CalendarIcon height="1.2rem" width="1.2rem" className={`fill-current text-${getDateColor(header.dueAt)}`} />
                                    <p className={` text-${getDateColor(header.dueAt)}`}>{`${t(`monitoring.expiresOn`)}: ${header.dueAt}`}</p>
                                </div>
                            </div>
                            <div className="mt-2 flex items-center gap-3 pl-2">
                                <Tippy content={priorityFlagTitle()} theme="light" arrow={false} placement={"bottom"}>
                                    <div>{priorityFlagIcon()}</div>
                                </Tippy>
                                <p className="text-xl font-semibold text-gray-400">{`${header.title}`}</p>
                            </div>

                            <div className="mb-3 mt-2 flex pl-2">
                                <div className={`flex items-center justify-center rounded-1 ${getStatusBgColor(header.status)} px-3 py-1`}>
                                    <p className={`font-bold ${getStatusTextColor(header.status)}`}>{t(`emailStatus.${header.status}`)}</p>
                                </div>
                            </div>
                            <div className="relative mb-1 mt-5 flex items-center justify-center border-t-1 py-2">
                                <span className="absolute mb-4 flex justify-center bg-gray-50 px-3 text-gray-400">
                                    {t("monitoring.Historial de mensajes")}
                                </span>
                            </div>
                            <div className="max-h-modal max-w-xl space-y-3 overflow-y-auto rounded-1 pr-4 pt-2">
                                {messageArray.map((message, index) => (
                                    <PreviewTicketBubble key={index} message={message} header={header} />
                                ))}
                            </div>
                            <div className="relative mb-1 mt-5 flex items-center justify-center border-t-1 py-2">
                                <span className="absolute mb-4 flex justify-center bg-gray-50 px-3 text-gray-400">
                                    {t("monitoring.Historial de eventos")}
                                </span>
                            </div>
                            <div className="max-h-modal max-w-xl space-y-3 overflow-y-auto rounded-1 pr-4 pt-2">
                                {eventsArray.map((message, index) => (
                                    <PreviewTicketBubble key={index} message={message} header={header} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}
export default EmailPreviewModal;
