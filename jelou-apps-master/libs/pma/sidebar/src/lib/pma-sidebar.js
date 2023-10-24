import get from "lodash/get";
import toUpper from "lodash/toUpper";
import isEmpty from "lodash/isEmpty";
import includes from "lodash/includes";
import React, { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { JelouApiV1 } from "@apps/shared/modules";
import { useTranslation } from "react-i18next";
import { ArchivedIcon } from "@apps/shared/icons";
import ChatSidebar from "./chat-sidebar/chat-sidebar";
import { addUserTeams, setTags, unsetCurrentRoom, deleteEmailQuerySearch, deleteEmailSearchBy, unsetCurrentPost, addTeams } from "@apps/redux/store";
import Queue from "./queue/queue";
import SearchRoom from "./search-room/search-room";
import ArchivedSidebar from "./archived-sidebar/archived-sidebar";
import InboxSidebar from "./inbox-sidebar/inbox-sidebar";
import EmailSidebar from "./email-sidebar/email-sidebar";
import PostSidebar from "./post-sidebar/post-sidebar";
import MobileSidebar from "./mobile-sidebar/mobile-sidebar";

const Sidebar = (props) => {
    const {
        createEmailPermission,
        setCurrentRoom,
        getArchivedFiles,
        loadingArchived,
        showChat,
        currentView,
        setCurrentView,
        setLoading,
        loading,
        showEmail,
        setShowEmail,
        actualPage,
        setActualPage,
        status,
        setStatus,
        user,
        emailsTags,
        setEmailsTags,
        total,
        setTotal,
        dueDate,
        setDueDate,
        priority,
        setPriority,
        isFavorite,
        setIsFavorite,
        setTotalPages,
        setLoadingEmails,
        setExpirationEmails,
        cleanFilters,
        getEmails,
        onCreateEmail,
    } = props;
    let { section = "chats", subSection = "" } = useParams();
    const { t } = useTranslation();
    const userSession = useSelector((state) => state.userSession);
    const searchOnType = toUpper(section) === "ARCHIVED";
    const searchPosts = toUpper(section) === "POSTS";

    const [showAscOptions, setShowAscOptions] = useState(false);
    const [sortOrder, setSortOrder] = useState(localStorage.getItem("sortOrder") || "asc_message");
    const [filteredThread, setFilteredThread] = useState("Todos");
    const [sortOrderRoom, setSortOrderRoom] = useState(localStorage.getItem("sortOrderRoom") || "");

    const dispatch = useDispatch();

    const [groupPost, setGroupPost] = useState(false);
    const [showSortOptions, setShowSortOptions] = useState(false);
    const [showChatSortOptions, setShowChatSortOptions] = useState(false);

    useEffect(() => {
        if (!isEmpty(userSession)) {
            getTeams();
            getTags();
        }
    }, [userSession]);

    useEffect(() => {
        if (section !== "emails") {
            dispatch(deleteEmailQuerySearch());
            dispatch(deleteEmailSearchBy());
        }
    }, [section]);

    const getTeamIds = () => {
        const userTeams = get(userSession, "teams", []);
        return userTeams;
    };

    const getTeams = () => {
        const companyId = get(userSession, "companyId", false);

        JelouApiV1.get(`/company/${companyId}/teams`, {
            params: {
                limit: 150,
            },
        })
            .then(({ data }) => {
                const { results } = data;
                const teamIds = getTeamIds();
                let activeTeams = [];

                if (isEmpty(teamIds)) {
                    activeTeams = results.filter((result) => result.state === true);
                    dispatch(addUserTeams(activeTeams));
                    dispatch(addTeams(activeTeams));

                    return;
                } else {
                    const scopedTeams = results.filter((result) => includes(teamIds, result.id));
                    activeTeams = scopedTeams.filter((result) => result.state === true);
                    dispatch(addUserTeams(activeTeams));
                    dispatch(addTeams(activeTeams));
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getTags = () => {
        const teams = get(userSession, "teams", []);
        JelouApiV1.get(`/company/${userSession.companyId}/tags`, {
            params: {
                ...(!isEmpty(teams) ? { teams } : {}),
            },
        })
            .then((res) => {
                const tagsArray = get(res, "data.data", []);
                dispatch(setTags(tagsArray));
            })
            .catch((err) => {
                console.log("=== ERROR", err);
            });
    };

    const viewSidebar = () => {
        switch (toUpper(section)) {
            case "CHATS":
                return <ChatSidebar sortOrder={sortOrderRoom} />;
            case "ARCHIVED":
                return <ArchivedSidebar loadingArchived={loadingArchived} getArchivedFiles={getArchivedFiles} setCurrentRoom={setCurrentRoom} />;
            case "INBOX":
                return <InboxSidebar />;
            case "POSTS":
                return (
                    <PostSidebar
                        showAscOptions={showAscOptions}
                        setShowAscOptions={setShowAscOptions}
                        sortOrder={sortOrder}
                        setSortOrder={setSortOrder}
                        filteredThread={filteredThread}
                        setFilteredThread={setFilteredThread}
                        groupPost={groupPost}
                    />
                );
            case "EMAILS":
                return (
                    <EmailSidebar
                        createEmailPermission={createEmailPermission}
                        onCreateEmail={onCreateEmail}
                        sortOrder={sortOrder}
                        getEmails={getEmails}
                        showEmail={showEmail}
                        setShowEmail={setShowEmail}
                        total={total}
                        setTotal={setTotal}
                        setExpirationEmails={setExpirationEmails}
                        cleanFilters={cleanFilters}
                        setTotalPages={setTotalPages}
                        setLoadingEmails={setLoadingEmails}
                        actualPage={actualPage}
                        setActualPage={setActualPage}
                        isFavorite={isFavorite}
                        setIsFavorite={setIsFavorite}
                        status={status}
                        setStatus={setStatus}
                        priority={priority}
                        setPriority={setPriority}
                        dueDate={dueDate}
                        setDueDate={setDueDate}
                        emailsTags={emailsTags}
                        setEmailsTags={setEmailsTags}
                        user={user}
                    />
                );

            default:
                return <div></div>;
        }
    };

    const isLoadingFirstMessage = useSelector((state) => state.isLoadingFirstMessage);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    return (
        <div
            className={`relative mr-0 w-full flex-col bg-white mid:mr-4 mid:rounded-xl ${isLoadingFirstMessage && isMobile && `hidden mid:flex`} ${
                !showChat ? "flex" : "hidden mid:flex"
            } ${section === "emails" ? "mid:w-72" : "mid:w-72 xxl:w-76"}`}>
            <div className="flex w-full flex-1 flex-col overflow-hidden bg-white mid:rounded-xl">
                <div className="hidden mid:block">
                    {(section === "chats" || section === "" || section === "posts") && subSection !== "archived" && <Queue section={section} />}
                </div>
                {section === "posts" && subSection === "archived" && (
                    <div className="flex h-14 items-center space-x-2 border-b-default border-black border-opacity-10 bg-primary-600 px-4">
                        <NavLink className="flex cursor-pointer items-center" onClick={() => dispatch(unsetCurrentPost())} to={`/pma/posts`}>
                            <div className="cursor-pointer pr-2 text-13 text-primary-200 focus:outline-none">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-6 sm:h-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </div>
                            <span className="flex flex-row items-center space-x-2">
                                <ArchivedIcon className="h-5 w-6 fill-current font-bold text-primary-200 sm:h-6" />
                                <p className="font-lg font-medium text-primary-200">{t("pma.Archivados")}</p>
                            </span>
                        </NavLink>
                    </div>
                )}
                {section === "archived" && (
                    <NavLink
                        to={`/pma/chats`}
                        className="border-btm hidden h-14 w-full border-gray-400 border-opacity-25 bg-primary-600 py-3 pl-3 pr-5 sm:py-3 mid:flex">
                        <button
                            onClick={() => dispatch(unsetCurrentRoom())}
                            className="flex w-full flex-row items-center justify-start space-x-3 focus:outline-none">
                            <div className="pr-2 text-13 text-primary-200 focus:outline-none">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-6 sm:h-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </div>
                            <span className="flex flex-row items-center space-x-2">
                                <ArchivedIcon className="h-5 w-6 fill-current font-bold text-primary-200 sm:h-6" />
                                <p className="font-lg font-medium text-primary-200">{t("pma.Archivados")}</p>
                            </span>
                        </button>
                    </NavLink>
                )}
                {section !== "emails" && (
                    <SearchRoom
                        searchOnType={searchOnType}
                        searchPosts={searchPosts}
                        getArchivedFiles={getArchivedFiles}
                        currentView={currentView}
                        setCurrentView={setCurrentView}
                        setShowAscOptions={setShowAscOptions}
                        sortOrderRoom={sortOrderRoom}
                        setSortOrderRoom={setSortOrderRoom}
                        sortOrder={sortOrder}
                        setSortOrder={setSortOrder}
                        groupPost={groupPost}
                        setGroupPost={setGroupPost}
                        loading={loading}
                        setLoading={setLoading}
                        showSortOptions={showSortOptions}
                        setShowSortOptions={setShowSortOptions}
                        showChatSortOptions={showChatSortOptions}
                        setShowChatSortOptions={setShowChatSortOptions}
                    />
                )}
                {isMobile && (
                    <div className="mid:hidden">
                        {(section === "chats" || section === "") && section !== "archived" && <Queue section={section} />}
                    </div>
                )}
                {(section === "chats" || section === "") && (
                    <NavLink
                        to={`/pma/archived`}
                        onClick={() => dispatch(unsetCurrentRoom())}
                        className="border-btm flex w-full border-gray-400/25 px-5 py-3 sm:px-5 sm:py-3">
                        <button className="flex w-full flex-row items-center justify-start space-x-3 focus:outline-none">
                            <ArchivedIcon className="h-5 w-6 fill-current text-primary-200 sm:w-6" />
                            <span className="text-13 font-semibold text-gray-400 sm:text-base">{t("pma.Archivados")}</span>
                        </button>
                    </NavLink>
                )}
                {section === "posts" && subSection !== "archived" && (
                    <NavLink
                        to={`/pma/posts/archived`}
                        onClick={() => dispatch(unsetCurrentPost())}
                        className="border-btm flex w-full border-gray-400/25 px-5 py-3 sm:px-5 sm:py-3">
                        <button className="flex w-full flex-row items-center justify-start space-x-3 focus:outline-none">
                            <ArchivedIcon className="h-5 w-6 fill-current text-primary-200 sm:w-6" />
                            <span className="text-13 font-semibold text-gray-400 sm:text-base">{t("pma.Archivados")}</span>
                        </button>
                    </NavLink>
                )}
                {viewSidebar()}
            </div>
            <MobileSidebar view={section} />
        </div>
    );
};
export default Sidebar;
