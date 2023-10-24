import { BrainIcon, ChatGTPIcon, ClaudeIcon, FlowIcon } from "@apps/shared/icons";
import { t } from "i18next";
import { AppIcon, Facebook, Instagram, Twitter, WebIcon, Whatsapp } from "@apps/shared/icons";
import { ToolKitIcon } from "@builder/Icons";

export const BRAIN_LOCATION = "/brain";

export const DESCRIPTION_MAX_LENGTH = 120;

export const DESCRIPTION_MIN_LENGTH = 10;

export const BLOCK_MAX_LENGTH = 65535;

export const NAME_MIN_LENGTH = 3; //Name of the datasource, datastore or channel

export const NAME_MIN_LENGTH_WHATSAPP = 6; //Name of the datasource, datastore or channel

export const NAME_MAX_LENGTH = 50; //Name of the datasource, datastore or channel

export const NAME_MAX_LENGTH_SUBTITLE = 100; //Name of the datasource, datastore or channel

export const DATASOURCE_TEXT_MIN_LENGTH = 17; //Minimum length of the content of a datasource type "text", effectively apply -7, meaning minLenght = 10

export const TESTER_TEMPERATURE_BULLETS = 1;

export const AMOUNT_BOTS = 3;

export const QR_BOT_NUMBER = "593985263429";

export const PRODUCTION_TYPE_WA = {
    ON_PREMISE: "ON_PREMISE",
    CLOUD: "CLOUD",
};

export const CREATE_PRODUCTION_STEP = {
    ENVIRONMENT: "ENVIRONMENT",
    FINISH: "FINISH",
};

export const ALLOWED_EXTENSIONS = Object.freeze({
    PDF: ".pdf",
    IMAGE: "image/png, image/jpeg",
});

export const DATASTORE = Object.freeze({
    SINGULAR_CAPITALIZED: "Brain",
    SINGULAR_LOWER: "brain",
    PLURAL_CAPITALIZED: "Brains",
    PLURAL_LOWER: "brains",
});

export const DATASOURCE = Object.freeze({
    SINGULAR_CAPITALIZED: "Knowledge",
    SINGULAR_LOWER: "knowledge",
    PLURAL_CAPITALIZED: "Knowledges",
    PLURAL_LOWER: "knowledges",
});

export const SOURCE = Object.freeze({
    SINGULAR_CAPITALIZED: "Source",
    SINGULAR_LOWER: "source",
    PLURAL_CAPITALIZED: "Sources",
    PLURAL_LOWER: "sources",
});

export const BLOCK = Object.freeze({
    SINGULAR_CAPITALIZED: "Block",
    SINGULAR_LOWER: "block",
    PLURAL_CAPITALIZED: "Blocks",
    PLURAL_LOWER: "blocks",
});

export const CHANNEL = Object.freeze({
    SINGULAR_CAPITALIZED: "Channel",
    SINGULAR_LOWER: "channel",
    PLURAL_CAPITALIZED: "Channels",
    PLURAL_LOWER: "channels",
});

export const SKILL = Object.freeze({
  SINGULAR_CAPITALIZED: "Skill",
  SINGULAR_LOWER: "skill",
  PLURAL_CAPITALIZED: "Skills",
  PLURAL_LOWER: "skills",
});

export const TOOL = Object.freeze({
  SINGULAR_CAPITALIZED: "Tool",
  SINGULAR_LOWER: "tool",
  PLURAL_CAPITALIZED: "Tools",
  PLURAL_LOWER: "tools",
});

export const DATASTORE_TABLE_HEADERS = [
    {
        label: t("common.name"),
        key: "name",
        isSort: false,
    },
    {
        label: `No. ${DATASOURCE.PLURAL_CAPITALIZED}`,
        key: "knowledge_count",
        isSort: false,
    },
    {
        label: t("common.type"),
        key: "types",
        isSort: false,
    },
];

export const DATASOURCE_TABLE_HEADERS = [
    {
        label: t("common.name"),
        key: "name",
        isSort: false,
    },
    {
        label: t("common.type"),
        key: "type",
        isSort: false,
    },
    {
        label: t("common.size"),
        key: "tokens",
        isSort: false,
    },
    {
        label: t("common.status"),
        key: "sync_status",
        isSort: false,
    },
    {
        label: t("common.lastUpdate"),
        key: "updated_at",
        isSort: false,
    },
];

export const CHANNELS_TABLE_HEADERS = [
    {
        label: t("common.name"),
        key: "name",
        isSort: false,
    },
    {
        label: t("common.type"),
        key: "type",
        isSort: false,
    },
    {
        label: t("common.status"),
        key: "sync_status",
        isSort: false,
    },
    {
        label: "Id",
        key: "reference_id",
        isSort: false,
    },
];

export const DATASOURCE_STATUS = Object.freeze({
    SYNCED: "synced",
    SYNCING: "syncing",
    PENDING: "pending",
    FAILED: "failed",
});

export const DATASOURCE_STATUS_TRANSLATIONS = Object.freeze({
    [DATASOURCE_STATUS.SYNCED]: t("common.synced"),
    [DATASOURCE_STATUS.SYNCING]: t("common.syncing"),
    [DATASOURCE_STATUS.PENDING]: t("common.pending"),
    [DATASOURCE_STATUS.FAILED]: t("common.failed"),
});

export const DATASOURCE_TYPES = Object.freeze({
    TEXT: "text",
    FILE: "file",
    WORKFLOW: "flow",
    WEBPAGE: "webpage",
    WEBSITE: "website",
    SKILL: "skill",
});

export const DATASOURCE_TYPE_TRANSLATIONS = Object.freeze({
    [DATASOURCE_TYPES.TEXT]: t("common.text"),
    [DATASOURCE_TYPES.FILE]: t("common.file"),
    [DATASOURCE_TYPES.WORKFLOW]: t("common.flow"),
    [DATASOURCE_TYPES.WEBPAGE]: t("common.webpage"),
    [DATASOURCE_TYPES.WEBSITE]: t("common.website"),
    [DATASOURCE_TYPES.SKILL]: "skill",
});

export const CHANNEL_STATUS = Object.freeze({
    ACTIVE: "active",
    NOT_ACTIVE: "not_active",
});

export const CHANNEL_TYPES = Object.freeze({
    WHATSAPP: "whatsapp",
    FACEBOOK: "facebook",
    INSTAGRAM: "instagram",
    WEB: "web",
    TWITTER: "twitter",
});

export const CHANNEL_PRODUCTION_TYPE = Object.freeze({
    CLOUD: "whatsapp_cloud",
    ON_PREMISE: "gupshup",
});

export const CHANNEL_TYPES_TRANSLATIONS = Object.freeze({
    WHATSAPP: t("common.whatsappChannel"),
    FACEBOOK: t("common.facebookChannel"),
    INSTAGRAM: t("common.instagramChannel"),
    WEB: t("common.webChannel"),
});

export const ITEM_TYPES = Object.freeze({
    DATASTORE: DATASTORE.SINGULAR_LOWER,
    DATASOURCE: DATASOURCE.SINGULAR_LOWER,
    SOURCE: SOURCE.SINGULAR_LOWER,
    BLOCK: BLOCK.SINGULAR_LOWER,
    FLOW: DATASOURCE_TYPES.WORKFLOW,
    SKILL: DATASOURCE_TYPES.SKILL,
});

export const WHATSAPP_FEATURES = Object.freeze([t("brain.whatsappFeature1"), t("brain.whatsappFeature2"), t("brain.whatsappFeature3")]);

export const FACEBOOK_FEATURES = Object.freeze([
    t("brain.facebookFeature1"),
    t("brain.facebookFeature2"),
    t("brain.facebookFeature3"),
    t("brain.facebookFeature4"),
]);

export const INSTAGRAM_FEATURES = Object.freeze([t("brain.instagramFeature1"), t("brain.instagramFeature2"), t("brain.instagramFeature3")]);

export const WEB_FEATURES = Object.freeze([t("brain.webMessengerFeature1"), t("brain.webMessengerFeature2"), t("brain.webMessengerFeature3")]);

export const CHANNEL_ICONS = {
    FACEBOOK: <Facebook width="0.938rem" height="0.938rem" />,
    FACEBOOK_FEED: <Facebook width="0.938rem" height="0.938rem" />,
    WHATSAPP: <Whatsapp width="0.875rem" height="0.875rem" />,
    TWITTER: <Twitter width="1.063rem" height="1.063rem" />,
    TWITTER_REPLIES: <Twitter width="1.063rem" height="1.063rem" />,
    INSTAGRAM: <Instagram width="1.063rem" height="1.063rem" />,
    WEB: <WebIcon width="1.063rem" height="1.063rem" />,
    WIDGET: <AppIcon width="1.063rem" height="1.063rem" />,
};

export const TESTER_KEYS = Object.freeze({
    SOURCE: "source",
    URL: "URL",
    SCORE: "score",
    DATASTORE_ID: "datastoreId",
    DATASOURCE: "datasource",
    SOURCE_INFO: "sourceInfo",
    BLOCK_ID: "blockId",
    TYPE_FLOW: "isDatasourceTypeFlow",
});

export const TESTER_SENDER = Object.freeze({
    USER: "user",
    ARTIFICIAL_INTELLIGENCE: "ai",
});

export const TESTER_NAMES = Object.freeze({
    BUTTON: "Chat",
    HEADER_TITLE: "Tester chat",
    HEADER_SETTINGS: t("common.settings"),
});

export const TESTER_MODEL_OPTIONS = Object.freeze({
    GPT_3_5: "gpt-3.5",
    GPT_3_5_TURBO: "gpt-3.5-turbo",
    GPT_4: "gpt-4",
    CLAUDE: "claude-instant-1",
    CLAUDE2: "claude-2",
    AZURE:"azure-gpt-3.5-turbo",
    AZURE4:"azure-gpt-4"
});

export const TESTER_SCORE_OPTIONS = [
    { id: "0.5", name: "0.5", description: "" },
    { id: "0.6", name: "0.6", description: "" },
    { id: "0.7", name: "0.7 ", description: "" },
    { id: "0.8", name: "0.8", description: "" },
];

export const TESTER_DEFAULT_MODEL_OPTIONS = Object.freeze({
    model: TESTER_MODEL_OPTIONS.GPT_3_5_TURBO,
    minimum_score: "0.5",
    temperature: "0",
});

export const MODEL_OPTIONS = [
    { id: "gpt-3.5-turbo", name: "GTP 3.5", description: "", Icon: <ChatGTPIcon className="text-[#76BE88]" /> },
    { id: "gpt-3.5-turbo-16k", name: "GTP 3.5 16K", description: "", Icon: <ChatGTPIcon className="text-[#76BE88]" /> },
    { id: "gpt-4", name: "GTP-4", description: "", Icon: <ChatGTPIcon className="text-[#9A6DEF]" /> },
    { id: "claude-instant-1", name: "Claude", description: "", Icon: <ClaudeIcon /> },
    { id: "claude-2", name: "Claude 2", description: "", Icon: <ClaudeIcon /> },
    { id:"azure-gpt-3.5-turbo", name:"Azure GPT 3.5", description: "" ,Icon: <ChatGTPIcon className="text-[#0078D4]" />},
    { id:"azure-gpt-4", name:"Azure GPT 4", description: "" ,Icon: <ChatGTPIcon className="text-[#0078D4]" />}
];

export const LOADING_DATA_STATUS = Object.freeze({
    LOADING: "loading",
    SUCCESS: "success",
});

export const COMPONENT_NAME = Object.freeze({
    NAME: "name",
    DESCRIPTION: "description",
    TYPE: "type",
    METADATA: "metadata",
    CONTENT: "content",
    CHAT_INPUT: "chat-input",
    MODEL: "model",
    SCORE: "score",
    TEMPERATURE: "temperature",
});

export const METADATA_TYPES = Object.freeze({
    TEXT: "text", //string
    URL: "url", //string
    FILES: "files", //array
    FLOWS: "flows", //object
    SKILL: "skill_id", // string
});

export const TRUNCATION_CHARACTER_LIMITS = Object.freeze({
    HEADER: 46,
    COLUMN: 46,
    SMALL_COLUMN: 30,
    TITLE: 25,
});

export const SIZE_BUTTON = {
    _2XL: "2xl",
    xl: "xl",
    LG: "lg",
    MD: "md",
    SM: "sm",
};

export const LOGO_SIZE_OPTIONS = [
    {
        label: t("brain.Grande"),
        value: SIZE_BUTTON.LG,
    },
    {
        label: t("brain.Mediano"),
        value: SIZE_BUTTON.MD,
    },
    {
        label: t("brain.Pequeño"),
        value: SIZE_BUTTON.SM,
    },
];

export const START_BUTTON_SIZE_OPTIONS = [
    {
        label: t("brain.Extra extra grande"),
        value: SIZE_BUTTON._2XL,
    },
    {
        label: t("brain.Extra grande"),
        value: SIZE_BUTTON.XL,
    },
    {
        label: t("brain.Grande"),
        value: SIZE_BUTTON.LG,
    },
    {
        label: t("brain.Mediano"),
        value: SIZE_BUTTON.MD,
    },
    {
        label: t("brain.Pequeño"),
        value: SIZE_BUTTON.SM,
    },
];

export const POSITION_START_BUTTON = {
    TOP_LEFT: "tl",
    TOP_RIGHT: "tr",
    BOTTOM_LEFT: "bl",
    BOTTOM_RIGHT: "br",
};

export const POSITION_START_BUTTON_OPTIONS = [
    {
        label: t("brain.Arriba a la izquierda"),
        value: POSITION_START_BUTTON.TOP_LEFT,
    },
    {
        label: t("brain.Arriba a la derecha"),
        value: POSITION_START_BUTTON.TOP_RIGHT,
    },
    {
        label: t("brain.Abajo a la izquierda"),
        value: POSITION_START_BUTTON.BOTTOM_LEFT,
    },
    {
        label: t("brain.Abajo a la derecha"),
        value: POSITION_START_BUTTON.BOTTOM_RIGHT,
    },
];

export const BODY_PANEL_BORDER = {
    ROUND: "ROUND",
    FLAT: "FLAT",
};

export const BODY_PANEL_BORDER_OPTIONS = [
    {
        value: BODY_PANEL_BORDER.ROUND,
        label: t("brain.Redondeadas"),
    },
    {
        value: BODY_PANEL_BORDER.FLAT,
        label: t("brain.Cuadradas"),
    },
];

export const TOOLTIP_TEXT_COLOR = {
    MAIN: "main",
    GREY: "grey",
    LIGHT: "light",
    NONE: "none",
};

export const TOOLTIP_TEXT_COLOR_OPTIONS = [
    { value: TOOLTIP_TEXT_COLOR.MAIN, label: t("brain.Main") },
    { value: TOOLTIP_TEXT_COLOR.GREY, label: t("brain.Grey") },
    { value: TOOLTIP_TEXT_COLOR.LIGHT, label: t("brain.Light") },
];

export const TOOLTIP_TEXT_BACKGROUND_OPTIONS = [
    { value: TOOLTIP_TEXT_COLOR.MAIN, label: t("brain.Main") },
    { value: TOOLTIP_TEXT_COLOR.GREY, label: t("brain.Grey") },
    { value: TOOLTIP_TEXT_COLOR.LIGHT, label: t("brain.Light") },
    { value: TOOLTIP_TEXT_COLOR.NONE, label: t("brain.None") },
];

export const INTEGRATION_WIDGET_CODE = (apiKey) => `<script
    src="https://cdn.jelou.ai/widgets/loader.js"
    data-api-key="${apiKey}"
    data-init="true">
</script>`;

