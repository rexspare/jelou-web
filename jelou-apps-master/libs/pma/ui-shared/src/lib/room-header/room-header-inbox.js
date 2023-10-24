import get from "lodash/get";
import Avatar from "react-avatar";
import isEmpty from "lodash/isEmpty";
import toUpper from "lodash/toUpper";
import emojiStrip from "emoji-strip";
import { withTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import React, { useEffect, useRef, useState } from "react";

import { showMobileChat } from "@apps/redux/store";

import { ArrowIcon, MoreOptionsIcon } from "@apps/shared/icons";
import { SocialIcon } from "@apps/shared/common";

const RoomHeader = (props) => {
    const { mobileMenu, setMobileMenu, openInfo, t } = props;
    const currentRoom = useSelector((state) => state.currentRoom);
    const dispatch = useDispatch();

    const isMountedRef = useRef(null);
    const [roomAvatar, setRoomAvatar] = useState("");

    useEffect(() => {
        isMountedRef.current = true;
        return () => (isMountedRef.current = false);
    }, []);

    const getName = () => {
        let name = get(currentRoom, "user.names", currentRoom.names);
        if (isEmpty(name)) {
            name = t("pma.Desconocido");
        }
        return name;
    };

    useEffect(() => {
        let src = get(currentRoom, "metadata.profilePicture");

        if (isEmpty(src)) {
            src = get(currentRoom, "avatarUrl");
        }

        if (isEmpty(src)) {
            src = "https://s3.us-west-2.amazonaws.com/cdn.devlabs.tech/default_avatar.jpeg";
        }
        setRoomAvatar(src);
    }, [currentRoom]);

    const getLegalId = () => {
        let legalId = get(currentRoom, "legalId", "");
        return legalId;
    };

    const { senderId, source } = currentRoom;
    const names = getName();
    const legalId = getLegalId();
    const showSender = toUpper(source) === "SMOOCH" || "WAVY";
    let roomIdGroup = get(currentRoom, "id", "").slice(-4);
    const isGroup = toUpper(roomIdGroup.replace(".us", "")) === "G";

    return (
        <>
            <div className="border-btm fixed top-0 z-10 flex w-full flex-row items-center bg-white px-4 py-3 sm:relative sm:z-0">
                <div className={`flex ${source && "sm:mr-1 sm:pr-3"}`}>
                    <div
                        className="flex items-center"
                        onClick={() => {
                            dispatch(showMobileChat());
                            setMobileMenu(false);
                        }}>
                        <ArrowIcon className="mr-4 flex fill-current mid:hidden" width="1.25rem" height="0.938rem" />
                        <div className="hidden md:flex">
                            <div className="relative">
                                <Avatar
                                    src={roomAvatar}
                                    name={emojiStrip(names)}
                                    className="mr-3 font-semibold"
                                    size="2.438rem"
                                    round={true}
                                    color="#2A8BF2"
                                    textSizeRatio={2}
                                />
                                <div className="absolute bottom-0 right-0 mr-1 -mb-1 overflow-hidden rounded-full border-2 border-transparent">
                                    <SocialIcon type={source} />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span
                                className={`leading-normal ${
                                    names.length > 35 ? "w-64 truncate xxl:w-88" : ""
                                } text-13 font-bold text-gray-400 sm:text-sm 2xl:text-15`}>
                                {names}
                            </span>
                            {legalId && <span className="flex font-medium text-gray-400 sm:text-xs 2xl:text-13">C.I. {legalId}</span>}
                        </div>
                    </div>
                </div>
                {source && (
                    <div className="hidden md:flex">
                        {toUpper(source) === "VENOM" && isGroup && (
                            <div className="hidden md:flex">
                                <span className="inline-flex items-center rounded-md bg-purple-200 px-2.5 py-0.5 text-sm font-medium text-purple-800">
                                    {t("pma.Grupo Público")}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* mobile */}
                <div className="flex flex-1 justify-end mid:hidden">
                    <span className={`mr-2 flex cursor-pointer items-center`} onClick={() => openInfo()}>
                        <MoreOptionsIcon
                            className={`mx-auto ${mobileMenu ? "text-white" : "text-gray-400"}`}
                            width="1.125rem"
                            height="1.125rem"
                            strokeWidth="1.5"
                            fill="currentColor"
                            stroke="currentColor"
                        />
                    </span>
                </div>
            </div>

            {mobileMenu && (
                <div className="mt-16 flex items-center justify-between border-t-default border-gray-10 px-5 py-4 shadow-lg sm:mt-0 mid:hidden">
                    {source && (
                        <div className="flex mid:hidden">
                            <div className="flex items-center justify-center text-base font-medium text-gray-450">
                                <SocialIcon type={source} />
                                {showSender && !isGroup && <span className="pl-2 text-13 font-medium">{`${senderId.replace("@c.us", "")}`}</span>}
                            </div>
                            {toUpper(source) === "VENOM" && isGroup && (
                                <div className="ml-3 flex mid:hidden">
                                    <span className="inline-flex items-center rounded-md bg-purple-200 px-2.5 py-0.5 text-sm font-medium text-purple-800">
                                        {t("pma.Grupo Público")}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default withTranslation()(RoomHeader);
