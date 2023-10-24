import type { ListBoxElement } from "@builder/common/Headless/Listbox";

import { useState } from "react";
import { Node, useReactFlow } from "reactflow";

import { TYPE_ERRORS, renderMessage } from "@builder/common/Toastify";
import { useCustomsNodes } from "@builder/hook/customNodes.hook";
import { Timer, TimerTime, timeList } from "../domain/timer.domain";
import { convertDurationIntoSeconds } from "./utils";

type TimerConfigPanelProps = {
    nodeId: string;
};

export const useTimerConfigPanel = ({ nodeId }: TimerConfigPanelProps) => {
    const { updateLocalNode } = useCustomsNodes();

    const { getNode } = useReactFlow();
    const node = getNode(nodeId) as Node<Timer>;

    const { time: selectedTime, duration: selectedDuration } = node.data.configuration;
    const initialTime = timeList.find((time) => time.id === selectedTime) as ListBoxElement;

    const [duration, setDuration] = useState<number>(selectedDuration);
    const [time, setTime] = useState<ListBoxElement>(initialTime);

    const handleOnChangeDuration = (event: React.ChangeEvent<HTMLInputElement>) => {
        const onChangeDurationRequest = async () => {
            setDuration(Number(event.currentTarget.value));
            const timeInSeconds = convertDurationIntoSeconds(Number(event.currentTarget.value), time.value as TimerTime);

            const updatedData = {
                ...node.data.configuration,
                timeInSeconds,
                duration: Number(event.currentTarget.value),
            } as Timer["configuration"];

            await updateLocalNode(nodeId, { configuration: updatedData });
        };

        onChangeDurationRequest().catch((reason) => {
            const error = reason as Error;
            renderMessage(error.message, TYPE_ERRORS.ERROR);
        });
    };

    const handleSelectedTime = (optionSelected: ListBoxElement) => {
        const selectedTimeRequest = async () => {
            setTime(optionSelected);
            const timeInSeconds = convertDurationIntoSeconds(duration, optionSelected.value as TimerTime);

            const updatedData = {
                ...node.data.configuration,
                timeInSeconds,
                time: optionSelected.value,
            } as Timer["configuration"];

            await updateLocalNode(nodeId, { configuration: updatedData });
        };

        selectedTimeRequest().catch((reason) => {
            const error = reason as Error;
            renderMessage(error.message, TYPE_ERRORS.ERROR);
        });
    };

    return {
        duration,
        time,
        handleOnChangeDuration,
        handleSelectedTime,
    };
};
