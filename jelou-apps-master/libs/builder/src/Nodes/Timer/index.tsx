import { NodeProps } from "reactflow";

import { TimerIcon } from "@builder/Icons";
import { WrapperNode } from "../Wrapper";
import { Timer, TimerTime } from "../../../modules/Nodes/Timer/domain/timer.domain";

export const TimerNode = ({ data, id, selected }: NodeProps<Timer>) => {
    const { title, duration, time } = data.configuration;

    const stringTime = { [TimerTime.Seconds]: "Segundos", [TimerTime.Minutes]: "Minutes", [TimerTime.Hours]: "Horas", [TimerTime.Days]: "Días" };
    const content = `${String(duration)} ${stringTime[time]}`;

    const wrapperNodeStyles = {
        bg: "#FFFAE8",
        bgHeader: "#FFF2CD",
        textColorHeader: "#987001",
    };

    return (
        <WrapperNode
            title={title}
            nodeId={id}
            selected={selected}
            showDefaultHandle={true}
            Icon={() => <TimerIcon width={24} height={24} />}
            isActiveButtonsBlock={false}
            styleNode={wrapperNodeStyles}
        >
            <div>{content}</div>
        </WrapperNode>
    );
};
