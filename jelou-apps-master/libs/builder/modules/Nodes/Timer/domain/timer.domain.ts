import type { ListBoxElement } from "@builder/common/Headless/Listbox";
import { BaseConfiguration } from "../../domain/nodes";

export interface Timer {
    configuration: BaseConfiguration & {
        duration: number;
        time: TimerTime;
        timeInSeconds: number;
    };
}

export enum TimerTime {
    Seconds = "seconds",
    Minutes = "minutes",
    Hours = "hours",
    Days = "days",
}

export const timeList: Array<ListBoxElement> = [
    {
        id: TimerTime.Seconds,
        name: "Segundos",
        value: TimerTime.Seconds,
    },
    {
        id: TimerTime.Minutes,
        name: "Minutos",
        value: TimerTime.Minutes,
    },
    {
        id: TimerTime.Hours,
        name: "Horas",
        value: TimerTime.Hours,
    },
    {
        id: TimerTime.Days,
        name: "Días",
        value: TimerTime.Days,
    },
];
