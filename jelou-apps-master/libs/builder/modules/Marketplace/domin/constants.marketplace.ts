import { CategoryMarketplace, ClockMarketplace, SearchIcon, StarMarketplace } from "@builder/Icons";

export const MARKETPLACE_QUERY_KEY = "marketplace";

export enum SECTIONS_TABS_KEYS {
    EXPLORER = "explorer",
    CATEGORY = "category",
    MORE_RECENT = "more_recent",
    MORE_POPULAR = "more_popular",
}

export const SECTIONS_TABS = [
    {
        id: SECTIONS_TABS_KEYS.EXPLORER,
        label: "Explorar",
        Icon: SearchIcon,
        disabled: false,
    },
    {
        id: SECTIONS_TABS_KEYS.CATEGORY,
        label: "Categorias",
        Icon: CategoryMarketplace,
        disabled: true,
    },
    {
        id: SECTIONS_TABS_KEYS.MORE_RECENT,
        label: "Más actuales",
        Icon: ClockMarketplace,
        disabled: true,
    },
    {
        id: SECTIONS_TABS_KEYS.MORE_POPULAR,
        label: "Más populares",
        Icon: StarMarketplace,
        disabled: true,
    },
];
