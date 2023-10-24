import "dayjs/locale/es";
import "dayjs/locale/en";
import dayjs from "dayjs";
import has from "lodash/has";
import get from "lodash/get";
import first from "lodash/first";
import toUpper from "lodash/toUpper";
import isEmpty from "lodash/isEmpty";
import Clamp from "react-multiline-clamp";
import { useSelector, useDispatch } from "react-redux";
import React, { useState, useEffect, useRef, forwardRef } from "react";

import { showMobileChat, setCurrentPost, setIsLoadingPost } from "@apps/redux/store";
import { RoomAvatar } from "@apps/shared/common";

const conversationStyle =
    "relative py-[0.7rem] pl-4 pr-2 flex w-full items-center cursor-pointer select-none hover:bg-hover-conversation border-btm border-rght h-[6.3rem]";
const conversationActive = "conversationActivePost";

const PostRoom = forwardRef((props, ref) => {
    const { room, getPostMessages } = props;
    const currentPost = useSelector((state) => state.currentPost);
    const [isCurrent, setIsCurrent] = useState(false);
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";
    const date = dayjs(room.createdAt).format("DD/MM/YY");
    dayjs.locale(lang || "es");
    const dispatch = useDispatch();
    const [counter, setCounter] = useState(1);
    const isMounted = useRef(null);

    useEffect(() => {
        isMounted.current = true;

        if (!isEmpty(currentPost)) {
            setIsCurrent(room.id === get(currentPost, "id", currentPost._id));
        }
        return () => (isMounted.current = false);
    }, [currentPost]);

    useEffect(() => {
        if (room.id === get(currentPost, "id", currentPost._id)) {
            const storageKey = `room:${currentPost.id}`;
            sessionStorage.setItem(storageKey, 0);
        }
    }, [currentPost]);

    useEffect(() => {
        if (room.unreadCount > 0) {
            setCounter(counter + 1);
        } else {
            setCounter(1);
        }
    }, [room.unreadCount]);

    /**
     * Set current room on redux
     *
     */
    const handleClick = () => {
        dispatch(showMobileChat());
        if (room.id === get(currentPost, "id", currentPost._id)) {
            return;
        } else {
            dispatch(setIsLoadingPost(true));
            getPostMessages(room.id);
            dispatch(setCurrentPost(room));
        }
    };

    const type = get(room, "bot.type", null);
    const replyPreview = first(get(room, "replyPreview", []));

    const text = get(replyPreview, "bubble.text", "");
    const mediaUrl = has(replyPreview, "bubble.mediaUrl") ? get(replyPreview, "bubble.mediaUrl") : false;

    const roomType = toUpper(get(replyPreview, "bubble.type", "TEXT"));
    const avatar = get(room, "profilePicture", get(room, "avatar", get(room, "avatarUrl")));
    const name = isEmpty(room.name) ? "Desconocido" : get(room, "name");
    const botName = get(room, "bot.name", "");

    return (
        <div className={`flex flex-col ${isCurrent ? conversationActive : conversationStyle}`} onClick={handleClick} ref={ref}>
            <div className="flex h-full w-full flex-col">
                <div className="relative flex h-full items-center">
                    <RoomAvatar src={avatar} type={type} name={name} showIcon />

                    <div className="flex flex-1 flex-col">
                        <div className="flex justify-between text-gray-400">
                            <div className="flex flex-1 justify-between pr-4 text-sm font-bold text-gray-400 sm:text-base">{name}</div>
                        </div>
                        {mediaUrl ? (
                            <div className="mt-1 flex items-center">
                                {roomType === "VIDEO" ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="mr-1 h-5 w-5 opacity-35"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                        />
                                    </svg>
                                ) : (
                                    <img src={mediaUrl} className="mr-2 h-8 w-8 rounded-md object-cover" alt="" />
                                )}
                                <Clamp lines={2}>
                                    <span className="w-full max-w-90 text-11 font-medium text-gray-450 sm:text-13">{text}</span>
                                </Clamp>
                            </div>
                        ) : (
                            <Clamp lines={1}>
                                <span className="w-full max-w-90 text-11 font-medium text-gray-450 sm:text-13">{text}</span>
                            </Clamp>
                        )}
                        <span className="w-full max-w-90 text-11 font-medium text-gray-450 sm:text-13">{botName}</span>
                    </div>
                    {room.unreadCount > 0 && !isCurrent && (
                        <div className="shadow-solid mr-2 flex h-6 w-6 rounded-full bg-secondary-200 text-white">
                            <div
                                className="text-14 flex h-full w-full items-center justify-center truncate font-semibold"
                                style={{
                                    transform: `${String(room.unreadCount).replace(".", "").length > 1 ? "scale(0.65)" : "scale(0.8)"}`,
                                }}>
                                {room.unreadCount}
                            </div>
                        </div>
                    )}
                </div>
                <div className="absolute bottom-0 right-0 mb-2 mr-4 text-10 font-light text-gray-400">{date}</div>
            </div>
        </div>
    );
});

export default PostRoom;
