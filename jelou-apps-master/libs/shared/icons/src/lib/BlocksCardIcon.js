import React from "react";
import Icon from "./Icon";

export default function BlocksCardIcon({ isActive, width = 28, height = 28 } = {}) {
    const [fill, stroke] = isActive ? ["#F1F3F5", "#727C94"] : ["#fff", "#B0B6C2"];
    return (
        <Icon viewBox="0 0 40 40" width={width} height={height} fill="none">
            <path d="M0 7a7 7 0 0 1 7-7h26a7 7 0 0 1 7 7v26a7 7 0 0 1-7 7H7a7 7 0 0 1-7-7V7Z" fill={fill} fillOpacity={0.65} />
            <rect x={9.75} y={9.75} width={7.3} height={7.3} rx={1.25} stroke={stroke} strokeWidth={1.5} />
            <rect x={9.75} y={22.95} width={7.3} height={7.3} rx={1.25} stroke={stroke} strokeWidth={1.5} />
            <rect x={22.95} y={9.75} width={7.3} height={7.3} rx={1.25} stroke={stroke} strokeWidth={1.5} />
            <rect x={22.95} y={22.95} width={7.3} height={7.3} rx={1.25} stroke={stroke} strokeWidth={1.5} />
        </Icon>
    );
}
