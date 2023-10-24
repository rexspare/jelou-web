import { SkillIcon } from "@apps/shared/icons";
import {
    CodeIcon,
    ConditionIcon,
    CustomerConnect,
    DatumNodeIcon,
    EndIcon,
    ErrorIcon,
    HttpIcon,
    MessageIcon,
    QuestionIcon,
    RandomIcon,
    StepIcon,
    StickyNoteIcon,
    TimerIcon,
    ToolKitIcon,
} from "@builder/Icons";
import { VariableIcon } from "@builder/Icons/Variable.Icon";
import { NODE_TYPES } from "@builder/modules/Nodes/domain/constants";
import { OUTPUT_TYPES } from "@builder/modules/OutputTools/domain/contants.output";

export const ICONS_BY_NODE_TYPE: Record<string, React.FC<{ width: number }>> = {
    [NODE_TYPES.MESSAGE]: MessageIcon,
    [NODE_TYPES.PMA]: CustomerConnect,
    [NODE_TYPES.IF_ERROR]: ErrorIcon,
    [NODE_TYPES.IF]: ConditionIcon,
    [NODE_TYPES.INPUT]: QuestionIcon,
    [NODE_TYPES.HTTP]: HttpIcon,
    [NODE_TYPES.CODE]: CodeIcon,
    [NODE_TYPES.END]: EndIcon,
    [NODE_TYPES.TOOL]: ToolKitIcon,
    [NODE_TYPES.NOTE]: StickyNoteIcon,
    [NODE_TYPES.TIMER]: TimerIcon,
    [NODE_TYPES.EMPTY]: StepIcon,
    [NODE_TYPES.CONDITIONAL]: ConditionIcon,
    [NODE_TYPES.RANDOM]: RandomIcon,
    [NODE_TYPES.SKILL]: () => <SkillIcon height={32} width={32} showBackground={false} color="currentColor" />,
    [NODE_TYPES.DATUM]: () => <DatumNodeIcon />,
    [NODE_TYPES.MEMORY]: VariableIcon,
};

export const DEFAULT_STYLE = {
    bgColor: "#fff",
    textColor: "#727C94",
    maxWidth: "28rem",
};

type HeaderStyle = {
    bgColor: string;
    textColor: string;
    maxWidth?: string;
};

export const STYLE_HEADER_CONFIG: Record<string, HeaderStyle> = {
    [NODE_TYPES.IF]: {
        bgColor: "#9C5E91",
        textColor: "#fff",
        maxWidth: "46rem",
    },
    [NODE_TYPES.INPUT]: {
        bgColor: "#E6F6FA",
        textColor: "#00A2CF",
    },
    [NODE_TYPES.HTTP]: {
        bgColor: "#006757",
        textColor: "#fff",
        maxWidth: "45rem",
    },
    [NODE_TYPES.CODE]: {
        bgColor: "#D7B8FF",
        textColor: "#36055C",
        maxWidth: "45rem",
    },
    [NODE_TYPES.IF_ERROR]: {
        bgColor: "#ffebeb",
        textColor: "#f12b2c",
    },
    [OUTPUT_TYPES.FAILED]: {
        bgColor: "#ffebeb",
        textColor: "#f12b2c",
    },
    [OUTPUT_TYPES.SUCCESS]: {
        bgColor: "#e9fcf5",
        textColor: "#18ba81",
    },
    [NODE_TYPES.END]: {
        bgColor: "#EFF1F4",
        textColor: "#374361",
    },
    [NODE_TYPES.TOOL]: {
        bgColor: "#00A2CF",
        textColor: "#E6F6FA",
    },
    [NODE_TYPES.EMPTY]: {
        bgColor: "#FFFFF",
        textColor: "#00B3C7",
    },
    [NODE_TYPES.TIMER]: {
        bgColor: "#FFF2CD",
        textColor: "#987001",
    },
    [NODE_TYPES.CONDITIONAL]: {
        bgColor: "#fff",
        textColor: "#00B3C7",
        maxWidth: "48rem",
    },
    [NODE_TYPES.RANDOM]: {
        bgColor: "#fff",
        textColor: "#00B3C7",
    },
    [NODE_TYPES.MEMORY]: {
        bgColor: "#fff",
        textColor: "00B3C7",
    },
};
