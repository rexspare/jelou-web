// import store from './lib/store';

export { setActualConversation, unsetActualConversation } from "./lib/reducers/actualConversation";
export { setActualConversationNotReplied, unsetActualConversationNotReplied } from "./lib/reducers/actualConversationNotReplied";
export { setAttendedConversation, unsetAttendedConversation } from "./lib/reducers/attendedConversation";
export { setAverageReply, unsetAverageReply } from "./lib/reducers/averageReply";
export { setAvgConversationTime } from "./lib/reducers/avgConversationTime";
export { setAvgOperatorReply, unsetAvgOperatorReply } from "./lib/reducers/avgOperatorReply";
export { deleteBots, getBots, getBotsByChannel, getBotsPma, updateBot } from "./lib/reducers/bots";
export { setChannels } from "./lib/reducers/channel";
export { addClients, resetClients } from "./lib/reducers/clients";
export { addClientsMessage, addClientsMessages, deleteClientsMessages } from "./lib/reducers/clientsMessages";
export { setCompany, unsetCompany } from "./lib/reducers/company";
export { deleteConversation, getConversations, setConversations, updateConversations } from "./lib/reducers/conversations";
export { setCurrentCompany, unsetCurrentCompany } from "./lib/reducers/currentCompany";
export { setCurrentRoom, setCurrentRoomAfterRecover, unsetCurrentRoom, updateCurrentRoom } from "./lib/reducers/currentRoom";
export { deleteGeneralConversations, getGeneralConversations, setGeneralConversations, updateGeneralConversations } from "./lib/reducers/generalConversations";
export { setGlobalSearchMessage, unsetGlobalSearchMessage } from "./lib/reducers/globalSearchMessage";
export { setIsLoadingArchivedPostSidebar } from "./lib/reducers/isLoadingArchivedPostSidebar";
export { loadingForwardMessages } from "./lib/reducers/isLoadingForwardMessages";
export { setIsLoadingPost } from "./lib/reducers/isLoadingPost";
export { setIsLoadingPostSidebar } from "./lib/reducers/isLoadingPostSidebar";
export { loadingMessages } from "./lib/reducers/isLoadingPreviousMessages";
export { setIsLoadingRoom } from "./lib/reducers/isLoadingRoom";
export { setNotAttendedConversation, unsetNotAttendedConversation } from "./lib/reducers/notAttendedConversation";
export { deleteOperatorSelected, getOperator, setOperatorSelected, updateOperatorSelected } from "./lib/reducers/operatorSelected";
export { addOperators, deleteOperator, getOperators, getOperatorsPma, setOperators, updateOperators } from "./lib/reducers/operators";
export { addOperatorsHistory, unsetOperatorsHistory } from "./lib/reducers/operatorsHistory";
export { deletePendingConversations, getPendingConversations, setPendingConversations, updatePendingConversations } from "./lib/reducers/pendingConversations";
export { setPendingNumber } from "./lib/reducers/pendingNumber";
export { addNewOnePendingTicket, deleteOnePendingTicket, setPendingTickets } from "./lib/reducers/pendingTickets";
export { setPermissions } from "./lib/reducers/permissions";
export { addMoreRooms, addRoom, addRooms, deleteRoom, setRooms, unsetRooms, updateRoom, updateRoomById, updateRooms } from "./lib/reducers/rooms";
export { addMoreSchedules, addNewSchedule, deleteScheduleFromList, setSchedulesList, updateSchedule } from "./lib/reducers/schedules.slice";
export { isScrollingDown } from "./lib/reducers/scrollDown";
export { isScrollingUp } from "./lib/reducers/scrollUp";
export { setStoredParams, unsetStoredParams, updateStoredParams } from "./lib/reducers/storedParams";
export { setSubCompanies } from "./lib/reducers/subCompanies";
export { addTeamScopes } from "./lib/reducers/teamScopes";
export { addTeams, getTeams } from "./lib/reducers/teams";
export { addTicket, addTickets, deleteTicket, updateTicket } from "./lib/reducers/tickets";
export { setTotalsByTeam, updateTotalsByTeam } from "./lib/reducers/totalsByTeams";
export { setTransferedConversation, unsetTransferedConversation } from "./lib/reducers/transferedConversation";
export { getUserSession, setUserSession, updateUserSession } from "./lib/reducers/userSession";
export { addUserTeams } from "./lib/reducers/userTeams";
export { getUsers } from "./lib/reducers/users";

export { setUnauthorization } from "./lib/reducers/authorization";
export { deleteBotsMonitoring, getBotsMonitoring } from "./lib/reducers/botsMonitoring";
export { setByRecover } from "./lib/reducers/byRecover";
export { setCampaignNotSeen } from "./lib/reducers/campaignNotSeen";
export { setDashboards } from "./lib/reducers/dashboards";
export { setFilters } from "./lib/reducers/filters";
export { setFiltersHsm } from "./lib/reducers/filtersHsm";
export { setInQueue } from "./lib/reducers/inQueue";
export { setSession } from "./lib/reducers/session";
export { setSessionStorage } from "./lib/reducers/sessionStorage";

export { addDatabase, setDatabases } from "./lib/reducers/databases";
export { setReports } from "./lib/reducers/reports";
export { Store } from "./lib/store";

// PMA //
export { setActualEmails } from "./lib/reducers/actualEmails";
export { setAnswerAIQueue, updateAnswerAIQueue } from "./lib/reducers/answerAIQueue";
export { setActualTray } from "./lib/reducers/actualTray";
export { addArchivedMessage, addArchivedMessages, setArchivedMessage } from "./lib/reducers/archivedMessages";
export { addArchivedPost, addArchivedPosts, deleteArchivedPost, deleteArchivedPosts } from "./lib/reducers/archivedPosts";
export { addQuerySearch, deleteQuerySearch } from "./lib/reducers/archivedQuerySearch";
export { addRoomsArchived, deleteRoomArchived, deleteRoomsArchived, setRoomArchived, updateArchivedRoom } from "./lib/reducers/archivedRooms";
export { addSearchBy, deleteSearchBy } from "./lib/reducers/archivedSearchBy";
export { setPlayingAudio } from "./lib/reducers/audio";
export { setChatManager } from "./lib/reducers/chatManager";
export { addClientsRooms, addMoreClientsRooms, unsetClientsRooms, updateClientsRooms } from "./lib/reducers/clientsRooms";
export { setConversationId } from "./lib/reducers/conversationId";
export { setCurrentArchivedRoom, unsetCurrentArchivedRoom, updateCurrentArchivedRoom } from "./lib/reducers/currentArchivedRoom";
export { setCurrentEmail, unsetCurrentEmail, updateCurrentEmail } from "./lib/reducers/currentEmail";
export { setCurrentPost, unsetCurrentPost, updateCurrentPost } from "./lib/reducers/currentPost";
export { setCurrentRoomClients, unsetCurrentRoomClients } from "./lib/reducers/currentRoomClients";
export { addEmailQuerySearch, deleteEmailQuerySearch } from "./lib/reducers/emailQuerySearch";
export { addEmailSearchBy, deleteEmailSearchBy } from "./lib/reducers/emailSearchBy";
export { addEmail, addEmails, deleteEmail, deleteEmails, setEmails, updateEmail, updateEmails } from "./lib/reducers/emails";
export { setExpiredEmails } from "./lib/reducers/expiredEmails";
export { addFlows, deleteFlows, updateFlows } from "./lib/reducers/flows";
export { addHSM, deleteHsm, setHsm } from "./lib/reducers/hsm";
export { setInputMessage } from "./lib/reducers/inputMessages";
export { setIsLoadingEmails } from "./lib/reducers/isLoadingEmails";
export { setIsLoadingFirstMessage } from "./lib/reducers/isLoadingFirstMessage";
export { setIsLoadingMessages } from "./lib/reducers/isLoadingMessages";
export { setShowDisconnectedModal } from "./lib/reducers/isOperatorOffline";
export { ackMessage, addMailsMessages, addMessage, addMessages, deleteMessages, removeRoomMessages, setMessages, updateMessage } from "./lib/reducers/messages";
export { setMotives } from "./lib/reducers/motives";
export { setNextDraftRoom } from "./lib/reducers/nextDraftRoom";
export { setNotReadEmails } from "./lib/reducers/notReadEmails";
export { updateOperatorAvgResponseTime } from "./lib/reducers/operatorAvgResponseTime";
export { addChatNotification, removeChatNotification, setChatNotification } from "./lib/reducers/pmaNotifications";
export { _deleted, addPost, addPosts, deletePost, deletePosts, updatePost } from "./lib/reducers/posts";
export { setPusherIsConnected } from "./lib/reducers/pusherIsConnected";
export { setQuery } from "./lib/reducers/query";
export { addQueue, addQueues, deleteQueue, updateQueue } from "./lib/reducers/queues";
export { setRecoverChat } from "./lib/reducers/recoverChat";
export { removeReplyId, setReplyId } from "./lib/reducers/replyId";
export { logInUser, logOutUser, sendToken, setUrl } from "./lib/reducers/sessionActionsPma";
export { plusCounter, restCounter, restartCounter, showCounter } from "./lib/reducers/shoppingCartCounter";
export { showMobileChat } from "./lib/reducers/showChat";
export { setShowDraft } from "./lib/reducers/showDraft";
export { setShowSidebar } from "./lib/reducers/showSidebar";
export { setStatusOperator } from "./lib/reducers/statusOperator";
export { setTags } from "./lib/reducers/tags";
export { saveData } from "./lib/reducers/widgetMetadata";

/** BRAIN */
export { setDatasource } from "./lib/reducers/brainDatasource";
export { setDatastore, updateDatastore } from "./lib/reducers/brainDatastore";
export { setSource } from "./lib/reducers/brainSource";
export { setShowTesterChat } from "./lib/reducers/brainTesterChat";
