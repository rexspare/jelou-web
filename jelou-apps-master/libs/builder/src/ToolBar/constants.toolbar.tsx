import { SkillIcon } from "@apps/shared/icons";
import { NODE_TYPES } from "@builder/modules/Nodes/domain/constants";
import { BLOCK_TYPES } from "@builder/modules/Nodes/message/domain/constants.message";
import { ObjectList } from "@builder/pages/Home/ToolKits/types.toolkits";

import { v4 } from "uuid";

import { VariableIcon } from "@builder/Icons/Variable.Icon";
import { ListBoxElement } from "@builder/common/Headless/Listbox";
import {
    AudioIcon,
    CodeIcon,
    ConditionIcon,
    ContactIcon,
    // CustomerExperience,
    CustomerConnect,
    DatumNodeIcon,
    // DeleteEdgeIcon,
    DocumentsIcon,
    EditPencil,
    EndIcon,
    // FormulaIcon,
    // GoToStepIcon,
    HttpIcon,
    LocationIcon,
    LockIcon,
    // KeyWordIcon,
    MediaIcon,
    OptionsListIcon,
    // OnboardingActionIcon,
    QuestionIcon,
    QuickRepliesIcon,
    QuickReplyIcon,
    RandomIcon,
    StepIcon,
    // RevealIcon,
    // ValidationIcon
    StickerIcon,
    StickyNoteIcon,
    // ShopActionIcon,
    TextIcon,
    TimerIcon,
    UnlockIcon,
    VideoIcon,
} from "../Icons";

type NodeItem = {
    id: number;
    text: string;
    color: string;
    bgIcon: string;
    Icon: React.FC<{
        width?: number;
        height?: number;
        color?: string;
    }>;
    nodeType: NODE_TYPES;
    initialData?: BLOCK_TYPES;
    dragImage?: string;
};

export type ActionListType = {
    id: string;
    title: string;
    list: NodeItem[];
};

export const QUESTIONS_LIST_NODES: NodeItem[] = [
    {
        id: 1,
        text: "Pregunta",
        color: "#00A2CF",
        bgIcon: "#E6F6FA",
        Icon: QuestionIcon,
        nodeType: NODE_TYPES.INPUT,
        initialData: undefined,
        dragImage: "https://cdn.jelou.ai/workflows%2Fimage%2Ff5440250-25e3-45b8-9f3f-2c7aba73298d-1693512348187.png",
    },
];

export const SERVICES_LIST_NODES: NodeItem[] = [
    {
        id: 2,
        text: "Texto",
        color: "#727C94",
        bgIcon: "#F4F4F4",
        Icon: TextIcon,
        nodeType: NODE_TYPES.MESSAGE,
        initialData: BLOCK_TYPES.TEXT,
        dragImage: "https://cdn.jelou.ai/icons/Texto.png",
    },
    {
        id: 3,
        text: "Imagen",
        color: "#5E8E3E",
        bgIcon: "#F3FFF3",
        Icon: MediaIcon,
        nodeType: NODE_TYPES.MESSAGE,
        initialData: BLOCK_TYPES.IMAGE,
        dragImage: "https://cdn.jelou.ai/icons/Imagen.png",
    },
    {
        id: 4,
        text: "Video",
        color: "#5E8E3E",
        bgIcon: "#F3FFF3",
        Icon: VideoIcon,
        nodeType: NODE_TYPES.MESSAGE,
        initialData: BLOCK_TYPES.VIDEO,
        dragImage: "https://cdn.jelou.ai/icons/Video.png",
    },
    {
        id: 5,
        text: "Audio",
        color: "#5E8E3E",
        bgIcon: "#F3FFF3",
        Icon: AudioIcon,
        nodeType: NODE_TYPES.MESSAGE,
        initialData: BLOCK_TYPES.AUDIO,
        dragImage: "https://cdn.jelou.ai/icons/Audio.png",
    },
    {
        id: 6,
        text: "Sticker",
        color: "#5E8E3E",
        bgIcon: "#F3FFF3",
        Icon: StickerIcon,
        nodeType: NODE_TYPES.MESSAGE,
        initialData: BLOCK_TYPES.STICKER,
        dragImage: "https://cdn.jelou.ai/icons/Sticker.png",
    },
    {
        id: 7,
        text: "Documento",
        color: "#987001",
        bgIcon: "#FFFBF1",
        Icon: DocumentsIcon,
        nodeType: NODE_TYPES.MESSAGE,
        initialData: BLOCK_TYPES.FILE,
        dragImage: "https://cdn.jelou.ai/icons/Documento.png",
    },
    {
        id: 8,
        text: "Contacto",
        color: "#5E8E3E",
        bgIcon: "#F3FFF3",
        Icon: ContactIcon,
        nodeType: NODE_TYPES.MESSAGE,
        initialData: BLOCK_TYPES.CONTACT,
        dragImage: "https://cdn.jelou.ai/icons/Contacto.png",
    },
    {
        id: 9,
        text: "Ubicación",
        color: "#00A2CF",
        bgIcon: "#E6F6FA",
        Icon: LocationIcon,
        nodeType: NODE_TYPES.MESSAGE,
        initialData: BLOCK_TYPES.LOCATION,
        dragImage: "https://cdn.jelou.ai/icons/Ubicacion.png",
    },
    {
        id: 10,
        text: "Lista",
        color: "#40C6D5",
        bgIcon: "#F2FBFC",
        Icon: OptionsListIcon,
        nodeType: NODE_TYPES.MESSAGE,
        initialData: BLOCK_TYPES.LIST,
        dragImage: "https://cdn.jelou.ai/icons/Lista.png",
    },
    {
        id: 11,
        text: "Botones",
        color: "#40C6D5",
        bgIcon: "#F2FBFC",
        Icon: QuickRepliesIcon,
        nodeType: NODE_TYPES.MESSAGE,
        initialData: BLOCK_TYPES.BUTTONS,
        dragImage: "https://cdn.jelou.ai/icons/botones.png",
    },
    {
        id: 12,
        text: "Respuestas rápidas",
        color: "#40C6D5",
        bgIcon: "#F2FBFC",
        Icon: QuickReplyIcon,
        nodeType: NODE_TYPES.MESSAGE,
        initialData: BLOCK_TYPES.QUICK_REPLY,
        dragImage: "https://cdn.jelou.ai/icons/Imagen.png",
    },
];

export const MESSAGE_LIST_NODES: NodeItem[] = [
    {
        id: 13,
        text: "Paso",
        color: "#00A2CF",
        bgIcon: "#E6F6FA",
        Icon: StepIcon,
        nodeType: NODE_TYPES.EMPTY,
        dragImage: "https://cdn.jelou.ai/workflows%2Fimage%2Fdb6774ca-269b-4fcb-a178-93d9fee5c9e0-1693512679234.png",
    },
    {
        id: 14,
        text: "Notas",
        color: "#00A2CF",
        bgIcon: "#E6F6FA",
        Icon: StickyNoteIcon,
        nodeType: NODE_TYPES.NOTE,
        dragImage: "https://cdn.jelou.ai/workflows%2Fimage%2F4d515404-9c5a-45de-b0a8-c1897f3b6afe-1693512611354.png",
    },
    {
        id: 15,
        text: "Pausa",
        color: "#00A2CF",
        bgIcon: "#E6F6FA",
        Icon: TimerIcon,
        nodeType: NODE_TYPES.TIMER,
        dragImage: "https://cdn.jelou.ai/workflows%2Fimage%2F3b59cc06-11e0-4054-b1d4-42b9e1669702-1693512661596.png",
    },
    {
        id: 16,
        text: "Condición",
        color: "text-[#FFEFF4]",
        bgIcon: "bg-[#9C5E91]",
        Icon: () => <ConditionIcon width={20} height={20} />,
        nodeType: NODE_TYPES.CONDITIONAL,
        initialData: undefined,
        dragImage: "https://cdn.jelou.ai/icons/conditional.png",
    },
    {
        id: 17,
        text: "Aleatorio",
        color: "#40C6D5",
        bgIcon: "#F2FBFC",
        Icon: RandomIcon,
        nodeType: NODE_TYPES.RANDOM,
        initialData: undefined,
        dragImage: "https://cdn.jelou.ai/workflows%2Fimage%2Fa9f913cf-fba8-4adf-afe2-5a157a8b6620-1695158891572.png",
    },
    {
        id: 18,
        text: "Skill",
        color: "#00A2CF",
        bgIcon: "#E6F6FA",
        Icon: () => <SkillIcon height={32} width={32} showBackground={false} color="currentColor" />,
        nodeType: NODE_TYPES.SKILL,
        initialData: undefined,
        dragImage: "https://cdn.jelou.ai/icons/skill-icon.png",
    },
    {
        id: 19,
        text: "Conectar asesor",
        Icon: CustomerConnect,
        nodeType: NODE_TYPES.PMA,
        initialData: undefined,
        bgIcon: "",
        color: "",
        dragImage: "https://cdn.jelou.ai/workflows%2Fimage%2F45786a9a-3183-45bb-a470-ced48be33106-1695739305597.png",
    },
    {
        id: 20,
        Icon: () => <DatumNodeIcon width={18} />,
        bgIcon: "",
        color: "",
        nodeType: NODE_TYPES.DATUM,
        text: "Datum",
        initialData: undefined,
        dragImage: undefined,
    },
    {
        id: 21,
        text: "Variable",
        Icon: VariableIcon,
        nodeType: NODE_TYPES.MEMORY,
        initialData: undefined,
        bgIcon: "",
        color: "",
        dragImage: "https://s3.us-west-2.amazonaws.com/cdn.devlabs.tech/workflows%2Fimage%2Fa7671c04-6026-4a01-884d-1c51e33764ee-1697570850831.png",
    },
];

export const END_TOOL_NODE_LIST: NodeItem[] = [
    {
        id: 21,
        text: "End",
        color: "text-[#fff]",
        bgIcon: "bg-[#00A2CF]",
        Icon: EndIcon,
        nodeType: NODE_TYPES.END,
        initialData: undefined,
        dragImage: "https://cdn.jelou.ai/icons/end.png",
    },
];

export const TOOL_NODE_LIST: NodeItem[] = [
    {
        id: 22,
        text: "Code",
        color: "text-[#D7B8FF]",
        bgIcon: "bg-[#36055C]",
        Icon: CodeIcon,
        nodeType: NODE_TYPES.CODE,
        initialData: undefined,
        dragImage: "https://cdn.jelou.ai/icons/code.png",
    },
    {
        id: 23,
        text: "API",
        color: "text-[#fff]",
        bgIcon: "bg-[#006757]",
        Icon: HttpIcon,
        nodeType: NODE_TYPES.HTTP,
        initialData: undefined,
        dragImage: "https://cdn.jelou.ai/workflows%2Fimage%2Fe0f577cb-d900-4fee-9fae-e89caf71dbc5-1696010131663.png",
    },
    {
        id: 24,
        text: "Condición",
        color: "text-[#FFEFF4]",
        bgIcon: "bg-[#9C5E91]",
        Icon: ConditionIcon,
        nodeType: NODE_TYPES.CONDITIONAL,
        initialData: undefined,
        dragImage: "https://cdn.jelou.ai/icons/conditional.png",
    },
    {
        id: 25,
        text: "Variable",
        Icon: VariableIcon,
        nodeType: NODE_TYPES.MEMORY,
        initialData: undefined,
        bgIcon: "",
        color: "",
        dragImage: "https://s3.us-west-2.amazonaws.com/cdn.devlabs.tech/workflows%2Fimage%2Fa7671c04-6026-4a01-884d-1c51e33764ee-1697570850831.png",
    },
    {
        id: 13,
        text: "Notas",
        color: "#00A2CF",
        bgIcon: "#E6F6FA",
        Icon: StickyNoteIcon,
        nodeType: NODE_TYPES.NOTE,
        dragImage: "https://cdn.jelou.ai/workflows%2Fimage%2F4d515404-9c5a-45de-b0a8-c1897f3b6afe-1693512611354.png",
    },
    {
        id: 26,
        text: "Datum",
        color: "",
        bgIcon: "",
        Icon: () => <DatumNodeIcon width={18} />,
        nodeType: NODE_TYPES.DATUM,
        initialData: undefined,
        dragImage: undefined,
    },
];

export const ALL_NODE_LIST_STRUCTURE = [...MESSAGE_LIST_NODES, ...TOOL_NODE_LIST];

export enum INPUTS_TYPES {
    BOOLEAN = "BOOLEAN",
    STRING = "STRING",
    NUMBER = "NUMBER",
    ENUM = "ENUM",
    LIST = "ARRAY",
    OBJECT = "OBJECT",
}

export const INPUTS_TYPES_LABELS = {
    [INPUTS_TYPES.BOOLEAN]: "Booleano",
    [INPUTS_TYPES.STRING]: "Texto",
    [INPUTS_TYPES.NUMBER]: "Número",
    [INPUTS_TYPES.ENUM]: "Desplegable",
    [INPUTS_TYPES.LIST]: "Lista",
    [INPUTS_TYPES.OBJECT]: "Objeto",
};

export const INPUTS_TYPES_OPTIONS = [
    {
        label: INPUTS_TYPES_LABELS[INPUTS_TYPES.BOOLEAN],
        value: INPUTS_TYPES.BOOLEAN,
    },
    {
        label: INPUTS_TYPES_LABELS[INPUTS_TYPES.STRING],
        value: INPUTS_TYPES.STRING,
    },
    {
        label: INPUTS_TYPES_LABELS[INPUTS_TYPES.NUMBER],
        value: INPUTS_TYPES.NUMBER,
    },
    {
        label: INPUTS_TYPES_LABELS[INPUTS_TYPES.ENUM],
        value: INPUTS_TYPES.ENUM,
    },
    {
        label: INPUTS_TYPES_LABELS[INPUTS_TYPES.LIST],
        value: INPUTS_TYPES.LIST,
    },
    {
        label: INPUTS_TYPES_LABELS[INPUTS_TYPES.OBJECT],
        value: INPUTS_TYPES.OBJECT,
    },
];

export enum INPUTS_NAME {
    NAME = "name",
    DESCRIPTION = "description",
    TYPE = "type",
    REQUIRED = "required",
    DISPLAY_NAME = "displayName",
    FORM = "form",
    CODE = "code",
}

type defaultConfigurationType = {
    complementaryColor: string;
    principalColor: string;
    thumbnail: string | null;
};

export const defaultConfiguration: defaultConfigurationType = {
    complementaryColor: "#ccc",
    principalColor: "#FFFFFF",
    thumbnail: null,
};

const uuid = v4();

export const userMock = {
    id: uuid,
    socketId: uuid,
    referenceId: uuid,
    names: "Fernando Sánchez",
    botId: "98cbf138-b4c7-4375-be92-e6177c0d9243",
    roomId: `G:98cbf138-b4c7-4375-be92-e6177c0d9243:${uuid}`,
    legalId: null,
};

export enum PIVACY_TYPES {
    PUBLIC = "public",
    PRIVATE = "private",
}

export const PRIVACY_OPTIONS: ListBoxElement[] = [
    {
        id: 1,
        name: "Privado",
        value: PIVACY_TYPES.PRIVATE,
        separator: true,
        description: "Solo los usuarios de mi compañía pueden utilizar esta herramienta",
        Icon: () => <LockIcon width={20} height={20} />,
    },
    {
        id: 2,
        name: "Público",
        value: PIVACY_TYPES.PUBLIC,
        separator: false,
        description: "Todas las compañías pueden utilizar esta herramienta",
        Icon: () => <UnlockIcon width={20} height={20} />,
    },
];

export const EDIT_PERMISSIONS_OPTIONS: ListBoxElement[] = [
    {
        id: 1,
        name: "Editable",
        value: "editable",
        separator: true,
        description: "La herramienta es completamente editable para la creación de nuevas versiones",
        Icon: () => <EditPencil width={20} height={20} />,
    },
];

export enum CREATE_INPUT_STEP {
    MAIN_DATA = "MAIN_DATA",
    INPUT_TYPE = "INPUT_TYPE",
}

export const CREATE_INPUT_STEPS = [
    {
        number: 1,
        id: CREATE_INPUT_STEP.MAIN_DATA,
        title: "Datos principales",
        hasLine: true,
    },
    {
        number: 2,
        id: CREATE_INPUT_STEP.INPUT_TYPE,
        title: "Tipo de input",
        hasLine: false,
    },
];

export const INPUT_MAIN_DATA = {
    name: "",
    displayName: "",
    description: "",
    required: true,
    configuration: {},
};

export enum LIST_TYPE {
    STRING = "string",
    NUMBER = "number",
}

export const LIST_OPTIONS_LABELS = {
    [LIST_TYPE.STRING]: "Texto",
    [LIST_TYPE.NUMBER]: "Número",
};

export const LIST_OPTIONS = [
    {
        label: LIST_OPTIONS_LABELS[LIST_TYPE.STRING],
        value: LIST_TYPE.STRING,
    },
    {
        label: LIST_OPTIONS_LABELS[LIST_TYPE.NUMBER],
        value: LIST_TYPE.NUMBER,
    },
];

export enum OBJECT_TYPE {
    STRING = "STRING",
    NUMBER = "NUMBER",
    BOOLEAN = "BOOLEAN",
}

export const OBJECT_OPTIONS_LABELS = {
    [OBJECT_TYPE.STRING]: "Texto",
    [OBJECT_TYPE.NUMBER]: "Número",
    [OBJECT_TYPE.BOOLEAN]: "Booleano",
};

export const INPUT_TYPE_OBJECT = [
    {
        label: OBJECT_OPTIONS_LABELS[OBJECT_TYPE.STRING],
        value: OBJECT_TYPE.STRING,
    },
    {
        label: OBJECT_OPTIONS_LABELS[OBJECT_TYPE.NUMBER],
        value: OBJECT_TYPE.NUMBER,
    },
    {
        label: OBJECT_OPTIONS_LABELS[OBJECT_TYPE.BOOLEAN],
        value: OBJECT_TYPE.BOOLEAN,
    },
];

export const DEFAULT_OBJECT: ObjectList = { id: 0, displayName: "", name: "", type: "", required: true };
