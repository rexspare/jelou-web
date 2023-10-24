import {
    AutomaticTransferIcon,
    BroadcastIconOrigin,
    InducedByAdminIcon,
    InducedByOperatorIcon,
    InducedBYSystemIcon,
    InducedIcon,
    OrganicIcon,
    TicketIcon,
    TransferIcon,
} from "@apps/shared/icons";

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

export const ORIGIN_ROOM = {
    INDUCED: "induced",
    INDUCED_BY_SYSTEM: "induced_by_system",
    INDUCED_BY_ADMIN: "induced_by_admin",
    INDUCED_BY_OPERATOR: "induced_by_operator",
    CLOSED: "closed",
    TRANSFER: "transfer",
    AUTO_TRANSFER: "automatic_transfer",
    TICKET: "ticket",
    BROADCAST: "broadcast",
    ORGANIC: "organic",
};

export const ORIGINS_ROOMS_ICONS = {
    [ORIGIN_ROOM.INDUCED]: {
        Icon: InducedIcon,
        color: "#00B3C7",
        bg: "#E6F7F9",
    },
    [ORIGIN_ROOM.INDUCED_BY_SYSTEM]: {
        Icon: InducedBYSystemIcon,
        color: "#00B3C7",
        bg: "#E6F7F9",
    },
    [ORIGIN_ROOM.INDUCED_BY_ADMIN]: {
        Icon: InducedByAdminIcon,
        color: "#00B3C7",
        bg: "#E6F7F9",
    },
    [ORIGIN_ROOM.INDUCED_BY_OPERATOR]: {
        Icon: InducedByOperatorIcon,
        color: "#00B3C7",
        bg: "#E6F7F9",
    },
    [ORIGIN_ROOM.TRANSFER]: {
        Icon: TransferIcon,
        color: "#00A2CF",
        bg: "#E6F6FA",
    },
    [ORIGIN_ROOM.AUTO_TRANSFER]: {
        Icon: AutomaticTransferIcon,
        color: "#00A2CF",
        bg: "#E6F6FA",
    },
    [ORIGIN_ROOM.TICKET]: {
        Icon: TicketIcon,
        color: "#D39C00",
        bg: "#FFFBF1",
    },
    [ORIGIN_ROOM.BROADCAST]: {
        Icon: BroadcastIconOrigin,
        color: "#9C5E91",
        bg: "#FFEFF4",
    },
    [ORIGIN_ROOM.ORGANIC]: {
        Icon: OrganicIcon,
        color: "#44A842",
        bg: "#F3FFF3",
    },
};
