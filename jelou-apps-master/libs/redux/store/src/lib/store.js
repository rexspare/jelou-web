import { configureStore } from "@reduxjs/toolkit";

import actualConversation from "./reducers/actualConversation";
import actualConversationNotReplied from "./reducers/actualConversationNotReplied";
import actualEmails from "./reducers/actualEmails";
import actualTray from "./reducers/actualTray";
import answerAIQueue from "./reducers/answerAIQueue";
import archivedMessages from "./reducers/archivedMessages";
import archivedPosts from "./reducers/archivedPosts";
import archivedQuerySearch from "./reducers/archivedQuerySearch";
import archivedRooms from "./reducers/archivedRooms";
import archivedSearchBy from "./reducers/archivedSearchBy";
import attendedConversation from "./reducers/attendedConversation";
import audio from "./reducers/audio";
import unauthorized from "./reducers/authorization";
import averageReply from "./reducers/averageReply";
import avgConversationTime from "./reducers/avgConversationTime";
import avgOperatorReply from "./reducers/avgOperatorReply";
import bots from "./reducers/bots";
import botsMonitoring from "./reducers/botsMonitoring";
import datasource from "./reducers/brainDatasource";
import datastore from "./reducers/brainDatastore";
import source from "./reducers/brainSource";
import showTesterChat from "./reducers/brainTesterChat";
import byRecover from "./reducers/byRecover";
import campaignNotSeen from "./reducers/campaignNotSeen";
import channel from "./reducers/channel";
import chatManager from "./reducers/chatManager";
import clients from "./reducers/clients";
import clientsMessages from "./reducers/clientsMessages";
import clientsRooms from "./reducers/clientsRooms";
import company from "./reducers/company";
import conversation from "./reducers/conversation";
import conversationId from "./reducers/conversationId";
import conversations from "./reducers/conversations";
import currentArchivedRoom from "./reducers/currentArchivedRoom";
import currentCompany from "./reducers/currentCompany";
import currentEmail from "./reducers/currentEmail";
import currentPost from "./reducers/currentPost";
import currentRoom from "./reducers/currentRoom";
import currentRoomClients from "./reducers/currentRoomClients";
import dashboards from "./reducers/dashboards";
import databases from "./reducers/databases";
import emailQuerySearch from "./reducers/emailQuerySearch";
import emailSearchBy from "./reducers/emailSearchBy";
import emails from "./reducers/emails";
import expiredEmails from "./reducers/expiredEmails";
import filters from "./reducers/filters";
import filtersHsm from "./reducers/filtersHsm";
import flows from "./reducers/flows";
import generalConversations from "./reducers/generalConversations";
import globalSearchMessage from "./reducers/globalSearchMessage";
import hsm from "./reducers/hsm";
import inQueue from "./reducers/inQueue";
import inputMessages from "./reducers/inputMessages";
import isLoadingArchivedPostSidebar from "./reducers/isLoadingArchivedPostSidebar";
import isLoadingEmails from "./reducers/isLoadingEmails";
import isLoadingFirstMessage from "./reducers/isLoadingFirstMessage";
import isLoadingForwardMessages from "./reducers/isLoadingForwardMessages";
import isLoadingMessages from "./reducers/isLoadingMessages";
import isLoadingPost from "./reducers/isLoadingPost";
import isLoadingPostSidebar from "./reducers/isLoadingPostSidebar";
import isLoadingPreviousMessages from "./reducers/isLoadingPreviousMessages";
import isLoadingRoom from "./reducers/isLoadingRoom";
import isOperatorOfflineModal from "./reducers/isOperatorOffline";
import messages from "./reducers/messages";
import motives from "./reducers/motives";
import nextDraftRoom from "./reducers/nextDraftRoom";
import notAttendedConversation from "./reducers/notAttendedConversation";
import notReadEmails from "./reducers/notReadEmails";
import operatorAvgResponseTime from "./reducers/operatorAvgResponseTime";
import operatorSelected from "./reducers/operatorSelected";
import operators from "./reducers/operators";
import operatorsHistory from "./reducers/operatorsHistory";
import pendingConversations from "./reducers/pendingConversations";
import pendingNumber from "./reducers/pendingNumber";
import pendingTickets from "./reducers/pendingTickets";
import permissions from "./reducers/permissions";
import pmaNotifications from "./reducers/pmaNotifications";
import posts from "./reducers/posts";
import pusherIsConnected from "./reducers/pusherIsConnected";
import query from "./reducers/query";
import queues from "./reducers/queues";
import recoverChat from "./reducers/recoverChat";
import replyId from "./reducers/replyId";
import reports from "./reducers/reports";
import rooms from "./reducers/rooms";
import schedules from "./reducers/schedules.slice";
import scrollDown from "./reducers/scrollDown";
import scrollUp from "./reducers/scrollUp";
import session from "./reducers/session";
import sessionActionsPma from "./reducers/sessionActionsPma";
import sessionStorage from "./reducers/sessionStorage";
import shoppingCartCounter from "./reducers/shoppingCartCounter";
import showChat from "./reducers/showChat";
import showDraft from "./reducers/showDraft";
import showSidebar from "./reducers/showSidebar";
import statusOperator from "./reducers/statusOperator";
import storedParams from "./reducers/storedParams";
import subCompanies from "./reducers/subCompanies";
import tags from "./reducers/tags";
import teamScopes from "./reducers/teamScopes";
import teams from "./reducers/teams";
import tickets from "./reducers/tickets";
import totalsByTeams from "./reducers/totalsByTeams";
import transferedConversation from "./reducers/transferedConversation";
import userSession from "./reducers/userSession";
import userTeams from "./reducers/userTeams";
import users from "./reducers/users";
import widgetMetadata from "./reducers/widgetMetadata";

// import { Tracker } from "@apps/shared/modules";
// import trackerRedux from "@openreplay/tracker-redux";

const middlewares = [];
// middlewares.push(Tracker.use(trackerRedux()));

export const Store = configureStore({
    reducer: {
        pusherIsConnected,
        showDraft,
        nextDraftRoom,
        actualConversation,
        actualConversationNotReplied,
        actualEmails,
        actualTray,
        archivedMessages,
        archivedPosts,
        archivedQuerySearch,
        answerAIQueue,
        archivedRooms,
        archivedSearchBy,
        attendedConversation,
        audio,
        averageReply,
        avgConversationTime,
        avgOperatorReply,
        bots,
        botsMonitoring,
        byRecover,
        campaignNotSeen,
        channel,
        chatManager,
        clients,
        clientsMessages,
        clientsRooms,
        company,
        conversation,
        conversationId,
        conversations,
        currentArchivedRoom,
        currentCompany,
        currentEmail,
        currentPost,
        currentRoom,
        currentRoomClients,
        dashboards,
        databases,
        datastore,
        datasource,
        emailQuerySearch,
        emails,
        emailSearchBy,
        expiredEmails,
        filters,
        filtersHsm,
        flows,
        generalConversations,
        globalSearchMessage,
        hsm,
        inputMessages,
        inQueue,
        isLoadingArchivedPostSidebar,
        isLoadingEmails,
        isLoadingFirstMessage,
        isLoadingForwardMessages,
        isLoadingMessages,
        isLoadingPost,
        isLoadingPostSidebar,
        isLoadingPreviousMessages,
        isLoadingRoom,
        messages,
        motives,
        notAttendedConversation,
        notReadEmails,
        operators,
        operatorSelected,
        operatorsHistory,
        operatorAvgResponseTime,
        pendingConversations,
        pendingNumber,
        pendingTickets,
        permissions,
        pmaNotifications,
        posts,
        query,
        queues,
        recoverChat,
        replyId,
        reports,
        rooms,
        schedules,
        scrollDown,
        scrollUp,
        session,
        sessionActionsPma,
        sessionStorage,
        shoppingCartCounter,
        showChat,
        showSidebar,
        showTesterChat,
        source,
        statusOperator,
        storedParams,
        subCompanies,
        tags,
        teams,
        teamScopes,
        userTeams,
        tickets,
        totalsByTeams,
        transferedConversation,
        unauthorized,
        users,
        userSession,
        widgetMetadata,
        isOperatorOfflineModal,
    },
    devTools: true,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middlewares),
});
