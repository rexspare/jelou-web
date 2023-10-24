import { BaseConfiguration } from "../../domain/nodes";

export const MAX_CONTENT_LENGHT = 100;
export const MIN_CONTENT_LENGTH = 0;

export interface StickyNote {
    configuration: BaseConfiguration & {
        colorPalette: StickyColorPaletteColor;
    };
}

export enum StickyColorPaletteColor {
    Yellow = "yellow",
    SkyBlue = "skyBlue",
    Blue = "blue",
    WarmGreen = "warmGreen",
    Green = "green",
    Turquoise = "turquoise",
    Pink = "pink",
    Lilac = "lilac",
    Red = "red",
}

export interface StickyColorPaletteType {
    title: string;
    bg: { index: number; color: string };
    header: { index: number; color: string };
    text: { index: number; color: string };
}

const generateColors = (colors: { bg: string; header: string; text: string }): Omit<StickyColorPaletteType, "title"> => ({
    bg: { index: 0, color: colors.bg },
    header: { index: 1, color: colors.header },
    text: { index: 2, color: colors.text },
});

export const stickyColorPalette = new Map<StickyColorPaletteColor, StickyColorPaletteType>([
    [
        StickyColorPaletteColor.Yellow,
        {
            title: "Amarillo",
            ...generateColors({ bg: "#FFFAE8", header: "#FFF2CD", text: "#987001" }),
        },
    ],
    [
        StickyColorPaletteColor.SkyBlue,
        {
            title: "Celeste",
            ...generateColors({ bg: "#E6F6FA", header: "#BAE2ED", text: "#006986" }),
        },
    ],
    [
        StickyColorPaletteColor.Blue,
        {
            title: "Azul",
            ...generateColors({ bg: "#E8F4FF", header: "#C9E5FF", text: "#1375CF" }),
        },
    ],
    [
        StickyColorPaletteColor.WarmGreen,
        {
            title: "Verde cálido",
            ...generateColors({ bg: "#F3FFF3", header: "#DCFFDC", text: "#5E8E3E" }),
        },
    ],
    [
        StickyColorPaletteColor.Green,
        {
            title: "Verde",
            ...generateColors({ bg: "#E9F5F3", header: "#C1E1DC", text: "#209F8B" }),
        },
    ],
    [
        StickyColorPaletteColor.Turquoise,
        {
            title: "Turqueza",
            ...generateColors({ bg: "#E6F7F9", header: "#BFECF1", text: "#00B3C7" }),
        },
    ],
    [
        StickyColorPaletteColor.Pink,
        {
            title: "Rosa",
            ...generateColors({ bg: "#FFEFF4", header: "#FFE7FB", text: "#F71963" }),
        },
    ],
    [
        StickyColorPaletteColor.Lilac,
        {
            title: "Lila",
            ...generateColors({ bg: "#F4EDFD", header: "#EDDEFF", text: "#814FEC" }),
        },
    ],
    [
        StickyColorPaletteColor.Red,
        {
            title: "Rojo",
            ...generateColors({ bg: "#FDEFED", header: "#FFD0CB", text: "#EC5F4F" }),
        },
    ],
]);
