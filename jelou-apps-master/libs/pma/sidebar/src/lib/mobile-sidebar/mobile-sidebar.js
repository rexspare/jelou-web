import dayjs from "dayjs";
import get from "lodash/get";
import { v4 as uuidv4 } from "uuid";
import isObject from "lodash/isObject";
import omit from "lodash/omit";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Sentry from "@sentry/react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { HsmModal } from "@apps/pma/ui-shared";
import { emailsViewEnable, postsViewEnable } from "@apps/shared/utils";
import { JelouApiV1 } from "@apps/shared/modules";
import { BroadcastIcon, ChatMobileIcon, EmailsMobileIcon, InboxMobileIcon, PostMobileIcon } from "@apps/shared/icons";
import { addMessage } from "@apps/redux/store";

const SidebarMobile = (props) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const company = useSelector((state) => state.company);
    const currentRoom = useSelector((state) => state.currentRoom);
    const userSession = useSelector((state) => state.userSession);
    const userTeams = useSelector((state) => state.userTeams);
    const hasInternalInbox = get(company, "properties.hasInternalInbox", false);
    const inboxName = get(company, "properties.inboxName", "Inbox");
    const [showModal, setShowModal] = useState(false);

    const { properties } = company;
    const hasBroadcast = get(properties, "hasBroadcast", false);

    const canViewEmails = emailsViewEnable(userTeams);
    const canViewPosts = postsViewEnable(userTeams);

    const sendCustomText = async (text, roomId, senderId, shouldNotBeSent = true, appId = "") => {
        const by = "operator";
        const source = get(currentRoom, "source", "");
        if (!appId) {
            appId = get(currentRoom, "appId", get(currentRoom, "bot.id"));
        }

        const message = { type: "TEXT", text: text };
        const messageData = {
            appId,
            senderId,
            by,
            source: source,
            roomId,
            message,
            shouldNotBeSent,
            operatorId: userSession.providerId,
            createdAt: dayjs().valueOf(),
        };

        //SEND MESSAGE
        const formMessage = {
            ...messageData,
            botId: appId,
            userId: senderId,
            bubble: message,
            id: uuidv4(),
        };

        // Add message to Redux
        dispatch(addMessage(formMessage));

        // Send message to server
        JelouApiV1.post(`/operators/message`, omit(formMessage, ["source"])).catch((error) => {
            console.error("Error on send message", error.response);

            Sentry.configureScope((scope) => {
                const data = isObject(error.response) ? JSON.stringify(error.response, null, 2) : error.response;
                scope.setExtra("formMessage", formMessage);
                scope.setExtra("userSession", userSession);
                scope.setExtra("errorResponse", data);
            });

            Sentry.captureException(new Error(`( Room ) Send Message Hsm Failed With: ${error.message}`));
        });
    };

    return (
        <div className="fixed bottom-0 flex h-14 w-full border-t-0.5 border-gray-10 bg-white pt-2 font-light text-gray-400 shadow-normal sm:h-16 mid:hidden">
            <NavLink to={`/pma/chats`} className={`flex-1 cursor-pointer border-b-4 border-transparent bg-white`}>
                <div className="flex h-full items-center justify-center">
                    <dl>
                        <div className={`flex flex-col items-center `}>
                            <ChatMobileIcon width="1.25rem" height="1.375rem" className="fill-current mid:hidden" />
                            <span className="text-11 capitalize sm:text-sm">{t("pma.Chats")}</span>
                        </div>
                    </dl>
                </div>
            </NavLink>
            {hasInternalInbox && (
                <NavLink to={`/pma/inbox`} className={`flex-1 cursor-pointer border-b-4 border-transparent bg-white`}>
                    <div className="flex h-full items-center justify-center">
                        <dl>
                            <div className={`flex flex-col items-center `}>
                                <InboxMobileIcon width="1.25rem" height="1.313rem" className="fill-current mid:hidden" />
                                <span className="text-11 capitalize sm:text-sm">{t(inboxName)}</span>
                            </div>
                        </dl>
                    </div>
                </NavLink>
            )}
            {get(company, "properties.hasBroadcast") && showModal && <HsmModal setShowModal={setShowModal} sendCustomText={sendCustomText} />}
            {canViewPosts && (
                <NavLink to={`/pma/posts`} className={`flex-1 cursor-pointer border-b-4 border-transparent bg-white`}>
                    <div className="flex h-full items-center justify-center">
                        <dl>
                            <div className={`flex flex-col items-center `}>
                                <PostMobileIcon width="1.563rem" height="1.25rem" className="fill-current mid:hidden" />
                                <span className="text-11 capitalize sm:text-sm">{t("pma.Posts")}</span>
                            </div>
                        </dl>
                    </div>
                </NavLink>
            )}
            {canViewEmails && (
                <NavLink to={`/pma/emails`} className={`flex-1 cursor-pointer border-b-4 border-transparent bg-white`}>
                    <div className="flex h-full items-center justify-center">
                        <dl>
                            <div className={`flex flex-col items-center `}>
                                <EmailsMobileIcon width="1.563rem" height="1.125rem" className="fill-current mid:hidden" />
                                <span className="text-11 capitalize sm:text-sm">{t("pma.Emails")}</span>
                            </div>
                        </dl>
                    </div>
                </NavLink>
            )}
            {hasBroadcast && (
                <div className="absolute right-0 -mt-16 mr-2 cursor-pointer text-sm mid:hidden">
                    <button
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-200 p-3 outline-none hover:bg-primary-100 focus:outline-none"
                        onClick={() => {
                            setShowModal(true);
                        }}>
                        <BroadcastIcon className="fill-current text-white" width="1.75rem" height="1.75rem" transform="rotate(-25 175 50)" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default SidebarMobile;
