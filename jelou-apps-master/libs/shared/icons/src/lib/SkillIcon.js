import React from "react";
import Icon from "./Icon";

const SkillIcon = ({ color = "#F3AF40", width, height, showBackground = true }) => {
    return (
        <Icon viewBox="0 0 49 48" width={width || 49} height={height || 48}>
            {showBackground && (
                <path
                    d="M48.9277 24C48.9277 37.2548 38.1826 48 24.9277 48C11.6729 48 0.927734 37.2548 0.927734 24C0.927734 10.7452 11.6729 0 24.9277 0C38.1826 0 48.9277 10.7452 48.9277 24Z"
                    fill={color}
                    opacity={0.15}
                />
            )}
            <path
                d="M18.7822 33.7141V20.5713C18.7822 23.2992 19.8407 25.9154 21.7248 27.8444C23.6089 29.7733 26.1642 30.857 28.8287 30.857"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
            <rect x="15.4336" y="13.7141" width="6.69767" height="6.85714" stroke={color} strokeWidth="2" strokeLinejoin="round" fill="none" />
            <rect x="28.8291" y="27.4285" width="6.69767" height="6.85714" stroke={color} strokeWidth="2" strokeLinejoin="round" fill="none" />
        </Icon>
    );
};
export default SkillIcon;
