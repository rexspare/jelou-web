import { JelouApiV1 } from "@apps/shared/modules";

/* HSM CAMPAIGN RESPONSE TYPES */
export const RESPONSE_TYPES = {
    FLOW: "FLOW",
    INPUT: "INPUT",
    OPTIONS: "OPTIONS",
    BUTTONS: "BUTTONS",
};

export const DURATION = {
    SECONDS: "SECONDS",
    MINUTES: "MINUTES",
    HOUR: "HOUR",
};

export const DEFAULT_LOGO = "https://s3-us-west-2.amazonaws.com/cdn.devlabs.tech/bsp-images/icono_bot.svg";

/* MESSAGE STATUSES */
export const MESSAGE_STATUSES = {
    CREATED: "CREATED",
    DELIVERED_CHANNEL: "DELIVERED_CHANNEL",
    DELIVERED_USER: "DELIVERED_USER",
    FAILED: "FAILED",
};

export const QR_CONST = {
    type: "QUICKREPLY",
    isVisible: true,
    language: "ES",
};

/* USER TYPES */
export const USER_TYPES = {
    USER: "user",
    OPERATOR: "operator",
    BOT: "bot",
    BROADCAST: "broadcast",
};

/* REPLY ID */
export const SET_REPLY_ID = "SET_REPLY_ID";
export const REMOVE_REPLY_ID = "REMOVE_REPLY_ID";

export const ANNOUNCEMENTS = "/announcements";

export const NOT_ASSIGN_REASON = {
    OPERATORS_NOT_IN_SCHEDULER: "OPERATORS_NOT_IN_SCHEDULER",
    OPERATOR_NOT_FOUND: "OPERATOR_NOT_FOUND",
    AUTOMATIC_ASSIGNATION_CLOSE: "AUTOMATIC_ASSIGNATION_CLOSE",
    NOT_REPLIED_BY_OPERATOR: "NOT_REPLIED_BY_OPERATOR",
    IN_LUNCH_TIME: "IN_LUNCH_TIME",
    MANAGING: "MANAGING",
    NOT_ASSIGN_REASON: "NOT_ASSIGN_REASON",
};

export const USER_STATE = {
    ACTIVE: "ACTIVE",
    AUTO_TRANSFER: "AUTO_TRANSFER",
    EXPIRED: "EXPIRED",
    CLOSED: "CLOSED",
    TRANSFERRED: "TRANSFERRED",
};

export const ENDED_REASON = {
    CLOSED_BY_AUTO_TRANSFER: "CLOSED_BY_AUTO_TRANSFER",
    EXPIRED: "EXPIRED",
    CLOSED_BY_OPERATOR: "CLOSED_BY_OPERATOR",
    TRANSFERRED: "TRANSFERRED",
};

export const COMPANY_SETTINGS = {
    GENERAL: "COMPANY_GENERAL",
};

export const TEAMS_SETTINGS = {
    GENERAL: "TEAMS_GENERAL",
};

// const URLS_JELOU = {
//   GET_COMPANY: '/v1/company',
//   GET_SUBCOMPANIES: `/v1/company/${companyId}/subcompanies`,
//   GET_BOTS: '/v1/bots',
//   GET_HSM: `/v1/whatsapp/${botId}/hsm`,
//   UPLOAD_IMAGE: `/v1/bots/${botId}/images/upload/`,
//   SEND_FILE: `/v1/hsm/file`,
//   GET_FLOWS: `/v1/bots/${botId}/flows`,
//   GET_CONFIGURATIONS: `/v1/bots/${botId}/campaigns/configurations`,
//   UPDATE_CONFIGURATIONS: `/v1/bots/${botId}/campaigns/configurations/${configurationId}`,
//   REMOVE_CONFIGURATION: `/v1/bots/${botId}/campaigns/configurations/${configurationId}`,
//   GET_FLOW_QUESTION: `/v1/bots/${botId}/flows/${questionId}`,
//   GET_QUESTION: `/v1/bots/${botId}/flows/${flowId}/bubbles`,
//   GET_HSM_REPORT: `/v1/bots/${botId}/notifications`,
//   GET_CAMPAIGN_NAME: `/v1/bots/${botId}/campaigns`,
//   TEMPLATE_MODAL: `/v1/bots/${botId}/templates/${templateId}`,
//   GET_HSM_TEMPLATE: `/v1/bots/${botId}/templates/${templateId}`,
//   CREATE_TEMPLATE: `/v1/bots/${botId}/templates`,
// };

export const getCompanyHeaders = (headers = false) => {
    return JelouApiV1.get("company", headers).catch((error) => {
        console.log(error);
    });
};

const getCompany = (headers = false) => {
    return JelouApiV1.get("company", headers).catch((error) => {
        console.log(error);
    });
};

const getBotById = (botId) => {
    return JelouApiV1.get(`company/${botId}`).catch((error) => {
        console.log(error);
    });
};

export const JelouApi = {
    getCompany,
    getBotById,
};

export const USED_TIME_ZONE = "America/Guayaquil";

/* RINGING SOUND */
export const URL_PHONE_RING = "https://s3.us-west-2.amazonaws.com/cdn.devlabs.tech/outgoing_ringing.mp3";

export const currentSectionPma = {
    CHATS: "CHATS",
    ARCHIVED: "ARCHIVED",
    INBOX: "INBOX",
    POSTS: "POSTS",
    EMAILS: "EMAILS",
};

/* PROVIDERS */
export const PROVIDERS = {
    PUSHER: "pusher",
    TALKTOLK: "talktolk",
};

export const WIDGET_METADATA_ACTIONS = {
    SAVE_DATA: "SAVE_DATA",
};

export const WIDGET_ALLOWED_COMPANIES = [
    { id: 1, name: "Shippify" },
    { id: 35, name: "Datafast" },
    { id: 123, name: "Security Data" },
    { id: 131, name: "Farmacias MIA" },
    { id: 312, name: "ABInBev Colombia" },
    { id: 339, name: "Movil Group" },
    { id: 135, name: "Jelou" },
];

export const CHANNELS = Object.freeze({
    TWITTER: "twitter",
    WHATSAPP: "whatsapp",
    FACEBOOK_FEED: "facebook_feed",
    INSTAGRAM: "instagram",
    FACEBOOK: "facebook",
    WIDGET: "widget",
});

export const TABS = {
    AI: "ai",
    NOTES: "notes",
    PROFILE: "profile",
    CATALOGUE: "catalogue",
    CRM: "crm",
};

export const tabsList = [
    // {
    //     name: TABS.AI,
    //     label: "AI",
    //     disable: false,
    // },
    {
        name: TABS.CRM,
        label: "CRM",
        disable: false,
    },
    {
        name: TABS.PROFILE,
        label: "Perfil",
        disable: false,
    },
    {
        name: TABS.NOTES,
        label: "Notas",
        disable: false,
    },
];

/* BROADCAST TYPES */
export const BROADCAST_TYPES = {
    HSM: "HSM",
    QUICKREPLY: "QUICKREPLY",
    IMAGE: "IMAGE",
    DOCUMENT: "DOCUMENT",
};

/* FILE SIZES */
export const MAX_SIZE = "25000"; // 25Mb
export const MAX_SIZE_MB = 25; // 25Mb -> defatult
export const MAX_SIZE_MB_WHATSAPP = 16; // 16Mb
export const MAX_SIZE_MB_DOCUMENTS = 90; // 90Mb

/* MAX_LENGTH */
export const FACEBOOK_MAX_LENGTH = 1000;
export const INSTAGRAM_MAX_LENGTH = 1000;

export const CHANNELS_VIDEO_SUPORT = { WHATSAPP: "WHATSAPP", FACEBOOK: "FACEBOOK", WIDGET: "WIDGET" };

//JelouApiV1
// (/v1/company)
// (/v1/company/${id}/subcompanies)
// (/v1/bots)
// (/v1/whatsapp/${bot.id}/hsm)
// (/v1/bots/${currentBot.id}/images/upload/)
// (/v1/hsm/file)
// (/v1/bots/${currentBot.id}/flows)
// (/v1/bots/${currentBot.id}/campaigns/configurations)
// (/v1/bots/${currentBot.id}/campaigns/configurations/${configuration.id})
// (/v1/bots/${currentBot.id}/campaigns/configurations/${id})
// (/v1/bots/${currentBot.id}/flows/${questionId})
// (/v1/bots/${currentBot}/flows/${flow.id}/bubbles)
// (/v1/bots/${bot.id}/notifications)
// (/v1/bots/${botId.id}/campaigns)
// (/v1/whatsapp/${botId.id}/hsm)
// (/v1/bots/${bot.id}/notifications)
// (/v1/bots/${botId}/templates/${id})
// (/v1/bots/${bot.id}/templates)
// (/v1/bots/${bot}/templates)
// (/v1/bots/${botId}/templates/${id})

// const URLS_APPS = {
//   ANNOUNCEMENTS: '/announcements',
//   GET_BOTS: `/companies/${companyId}/bots/data`,
//   BOT: `companies/${companyId}/bots/${botId}`,
//   USER_BOT: `users/bots/${bot.id}`,
//   TEAMS: `/companies/${companyId}/teams/${bot.id}`,
//   BOTS_CREATE: `/companies/${company}/bots/create`,
//   LOAD_TEMPLATE: `/companies/${company}/bots/create`,
//   ROOMS: `/clients/rooms?`,
//   GET_ROOM: `/clients/room/${roomId}`,
//   GET_CLIENT_MESSAGE: `/clients/rooms/${roomId}/messages?`,
//   GET_CLIENT_OPERATOR: `/clients/rooms/${roomId}/operators?`,
//   GET_STORED_PARAMS: `/clients/rooms/${roomId}/information?`,
//   GET_PROFILE: `/clients?`,
//   DOWNLOAD_CLIENT_MESSAGE: `/clients/download/messages?`,
//   GET_TEAMS: `/companies/${companyID}/teams`,
//   RESET: `/auth/reset/password`,
//   LOGIN: `/auth/me`,
// };

// DashboardServer
// (/announcements)
// (/companies/${company}/bots/data)
// (companies/${companyId}/bots/${bot})
// (companies/${companyID}/bots/${botHeader.id})
// (users/bots/${bot.id})
// (/companies/${companyId}/teams/${bot.id})
// (/companies/${companyID}/bots/${bot.id})
// (/companies/${company}/bots/create)
// (/bot_templates)
// (/clients/rooms?)
// (/clients/room/${roomId})
// (/clients/rooms/${roomId}/messages?)
// (/clients/rooms/${roomId}/operators?)
// (/clients/rooms/${roomId}/information?)
// (/clients?)
// (/clients/rooms/${roomId}/information?)
// (/clients/rooms/${roomId}/messages?)
// (/clients/rooms/${roomId}/operators?)
// (/clients/download/messages?)
// (/clients/download/messages?)
// (/clients/rooms/${roomId}/messages?)
// (/clients/rooms/${roomId}/messages?)
// (/companies/${companyID}/teams)
// (/auth/reset/password)
// (/auth/me)

// (/auth/recover/password)
// (/auth/register/social)
// (/auth/register)
// (/companies/${company.id}/impersonate)
// (/companies/${companyId}/bots/data)
// (/companies/${companyId}/users)
// (/companies/${companyId}/teams)
// (/companies/${companyId}/users)
// (/schedulers)
// (/schedulers/schedulerable_options/bot)
// (/schedulers/schedulerable_options/operator)
// (/schedulers/schedulerable_options/team)
// (/schedulers/${scheduleToDelete})
// (/schedulers/${scheduleId})
// (/auth/logout)
// (/modules/permissions)
// (/companies/${companyId}/roles/permissions)
// (/companies/${companyId}/roles/${activeRole.id})
// (/companies/${companyId}/roles)
// (/companies/${companyId}/roles/${role.id})
// (/companies/${companyId}/teams/${team.id})
// (/companies/${companyId}/teams/create)
// (/companies/${companyId}/teams)
// (/companies/${companyId}/teams/${team.id})
// (/companies/${companyId}/teams?state=1)
// (/companies/${companyId}/roles/permissions)
// (/companies/${companyId}/users/${user.id})
// (/companies/${companyId}/users)
// (/auth/login/social)
// (/auth/login)

/**
 * Types files for the drop zone
 */
export const TYPES_FILE = {
    jpeg: "image/jpeg",
    jpg: "image/jpg",
    png: "image/png",
    excel: "application/vnd.ms-excel",
    xls: "application/xls",
    xlsx: "application/xlsx",
    xlsx1: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    pdf: "application/pdf",
    word: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    docx: "application/docx",
    zip: "application/zip",
    powerPoint: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    powerPoint1: "vnd.openxmlformats-officedocument.presentationml.presentation",
    pptx: "application/pptx",
};

export const DOCUMENT_MESSAGE_TYPES = {
    image: "IMAGE",
    document: "DOCUMENT",
    video: "VIDEO",
};

export const unitInMB = 1024 * 1024;

export const ID_COMPANY_BG = 155;

// LOGOUT MODAL
export const ROOM_TYPES = {
    CLIENT: "client",
    COMPANY: "company",
    REPLY: "reply",
    TICKET: "ticket",
};

export const MESSAGE_TYPES = Object.freeze({
    SUCCESS: "SUCCESS",
    ERROR: "ERROR",
});

export const ARRAY_CHANNEL_TYPES = [
    { name: "Facebook", value: "Facebook" },
    { name: "Instagram", value: "Instagram" },
    { name: "Whatsapp", value: "Whatsapp" },
    { name: "Alexa", value: "Alexa" },
    { name: "Email", value: "email" },
    { name: "Facebook Feed", value: "Facebook_Feed" },
    { name: "Google", value: "Google" },
    { name: "Twitter", value: "Twitter" },
    { name: "Twitter Replies", value: "Twitter_replies" },
    { name: "Asistente de voz", value: "voiceassistance" },
    { name: "Widget", value: "Widget" },
];

export const TOAST_POSITION = Object.freeze({
    TOP_RIGHT: "top-right",
    TOP_LEFT: "top-left",
    TOP_CENTER: "top-center",
    BOTTOM_RIGHT: "bottom-right",
    BOTTOM_LEFT: "bottom-left",
    BOTTOM_CENTER: "bottom-center",
});

export const EVENT_KEY = Object.freeze({
    ENTER: "Enter",
    ESCAPE: "Escape",
    ARROW_LEFT: "ArrowLeft",
});
export const OPERATOR_STATUS = {
    ONLINE: "ONLINE",
    OFFLINE: "OFFLINE",
    BUSY: "BUSY",
};
