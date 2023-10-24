/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { useTranslation, withTranslation } from "react-i18next";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import toUpper from "lodash/toUpper";
import { RoomAvatar } from "@apps/shared/common";
import { ProfileIcon, CloseIcon2, LocationIcon } from "@apps/shared/icons";
import { ClipLoader } from "react-spinners";
import { useSelector } from "react-redux";
import { DateContext } from "@apps/context";

const CardModal = (props) => {
    const { card, loadingProfile, closeProfile } = props;
    const dayjs = useContext(DateContext);
    const [name, setName] = useState("");
    const { t } = useTranslation();
    const [roomAvatar, setRoomAvatar] = useState("");
    const metadata = get(card, "metadata", {});
    const [type, setType] = useState("");
    const [detail, setDetail] = useState("");
    const { countConversations = 0 } = useSelector((state) => state.storedParams);
    const storedParams = get(card, "storedParams", {});
    const createdAt = !isEmpty(card.createdAt) ? dayjs(get(card, "createdAt")).format("DD/MM/YYYY - hh:mm:ss") : "";
    const legalId = get(storedParams, "legalId", "") || get(storedParams, "cedula", "");
    const email = get(storedParams, "email", "");
    const location = get(metadata, "location", "");

    const getName = () => {
        let name = [];
        name = isEmpty(get(card, "names", ""))
            ? isEmpty(get(card, "metadata.names", ""))
                ? "Desconocido"
                : get(card, "metadata.names", "")
            : get(card, "names", "");
        setName(name);
    };

    const getRoomAvatar = () => {
        let src = get(metadata, "profilePicture");

        if (isEmpty(src)) {
            src = get(card, "avatarUrl");
        }

        if (isEmpty(src)) {
            src = "https://s3.us-west-2.amazonaws.com/cdn.devlabs.tech/default_avatar.jpeg";
        }
        setRoomAvatar(src);
    };

    const getDetail = () => {
        switch (toUpper(type)) {
            case "WHATSAPP":
                const id = get(card, "id");
                setDetail(id.replace("@c.us", ""));
                break;
            case "EMAIL":
                const mail = get(card, "id");
                setDetail(mail);
                break;
            default:
                let username = get(card, "metadata.username", "");
                if (!isEmpty(username)) {
                    username = `@${username}`;
                }
                setDetail(username);
                break;
        }
    };

    useEffect(() => {
        setType(get(card, "botType", ""));
        getName();
        getRoomAvatar();
        getDetail();
    }, [card]);

    const handler = (e) => {
        if (e.keyCode === 27) {
            props.onClose();
        }
    };

    useEffect(() => {
        document.addEventListener("keyup", handler);
        return () => {
            document.removeEventListener("keyup", handler);
        };
    }, []);

    return (
        <div className="relative z-50 h-[30rem] transform overflow-y-auto rounded-xl bg-white shadow-modal transition-all md:min-w-[50rem]">
            <button className="absolute right-0 top-0 z-10 mr-6 mt-5" onClick={closeProfile}>
                <CloseIcon2
                    fill="rgba(114, 124, 148, 0.25);"
                    className="fill-curent text-gray-400 text-opacity-25"
                    width="1.125rem"
                    height="1.125rem"
                />
            </button>
            <div className="sticky top-0 mb-3 flex flex-col items-center border-b-1 border-gray-400 border-opacity-25 bg-white py-4 sm:mx-10 sm:mb-0 sm:py-4 sm:pt-10">
                <div className="relative flex justify-center">
                    <RoomAvatar src={roomAvatar} name={name} type={type} size={"6rem"} />
                </div>
                <h1 className="flex items-center justify-between py-2 pt-5 font-sans text-xl font-bold text-gray-400">
                    <span>{name}</span>
                </h1>
                {!isEmpty(legalId) && <span className="text-15 text-gray-400">{legalId}</span>}
                {toUpper(type).startsWith("TWITTER") ? (
                    <a
                        href={`https://twitter.com/${detail}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center text-15 text-gray-400 hover:text-primary-200 hover:underline">
                        {detail}
                    </a>
                ) : toUpper(type).startsWith("INSTAGRAM") ? (
                    <a
                        href={`https://instagram.com/${detail}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center text-15 text-gray-400 hover:text-primary-200 hover:underline">
                        {detail}
                    </a>
                ) : (
                    <span className="flex flex-col text-15 text-gray-400">{detail}</span>
                )}
                {!isEmpty(email) && <span className="text-15 text-gray-400">{email}</span>}
                {toUpper(type) === "TWITTER_REPLIES" && (
                    <div className="my-1">
                        <div className="flex space-x-4 text-gray-400">
                            <div className="inline-flex space-x-2">
                                <ProfileIcon width="17" height="17" className="mt-1 fill-current text-primary-200" />
                                <span>{get(metadata, "followers", "-")}</span>
                                <span>Seguidores</span>
                            </div>
                            <div className="inline-flex space-x-2">
                                <ProfileIcon width="17" height="17" className="mt-1 fill-current text-primary-200" />
                                <span>{get(metadata, "following", "-")}</span>
                                <span>Siguiendo</span>
                            </div>
                        </div>
                        {!isEmpty(location) && (
                            <div className="my-2 flex justify-center text-13 font-bold text-gray-400">
                                <LocationIcon width="17" height="17" className="mr-2 fill-current text-primary-200" />
                                {location}
                            </div>
                        )}
                    </div>
                )}
                {!isEmpty(createdAt) && <span className="text-15 text-gray-400">{createdAt}</span>}
            </div>
            {loadingProfile ? (
                <div className="flex w-full justify-center">
                    <ClipLoader size={"3rem"} color="#00B3C7" />
                </div>
            ) : (
                <div className="mx-auto grid w-full grid-cols-2 overflow-y-auto overflow-x-hidden px-10 pt-8 pb-12">
                    <div className="my-1 grid grid-cols-2 space-x-1">
                        <span className="font-semibold capitalize text-gray-400">{t("clients.totalConversation")}:</span>
                        <span className="text-gray-400 text-opacity-75">{countConversations}</span>
                    </div>
                    {Object.keys(storedParams).map((key, i) => {
                        return (
                            !isEmpty(storedParams[key]) && (
                                <div key={i} className="my-1 grid grid-cols-2 space-x-1 pr-2">
                                    <span className="font-semibold capitalize text-gray-400">{key}:</span>
                                    <span className="text-gray-400 text-opacity-75">{storedParams[key]}</span>
                                </div>
                            )
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default withTranslation()(CardModal);
