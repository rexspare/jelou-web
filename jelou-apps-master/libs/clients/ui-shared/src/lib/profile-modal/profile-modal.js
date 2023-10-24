import React, { Fragment, useContext, useEffect, useState } from "react";
import { CloseIcon2 } from "@apps/shared/icons";
import { RoomAvatar } from "@apps/shared/common";
import { Dialog, Disclosure, Transition } from "@headlessui/react";
import { DownIcon, RightIcon, TeamIcon, MessageIcon, ProfileIcon, LocationIcon } from "@apps/shared/icons";
import { ClipLoader } from "react-spinners";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import toUpper from "lodash/toUpper";
import { useTranslation } from "react-i18next";
import Tag from "../tag/tag";
import { DateContext } from "@apps/context";

const ProfileModal = (props) => {
    const { openProfile, closeProfile, profile = {}, params, loadingProfile } = props;
    const dayjs = useContext(DateContext);
    const currentRoomClients = profile;
    const { t } = useTranslation();
    const { tags } = currentRoomClients;
    const [name, setName] = useState("");
    const [roomAvatar, setRoomAvatar] = useState("");
    const metadata = get(currentRoomClients, "metadata", {});
    const [type, setType] = useState("");
    const [detail, setDetail] = useState("");
    const createdAt = get(currentRoomClients, "createdAt", "");
    const updatedAt = get(currentRoomClients, "updatedAt", "");
    const { storedParams = [], countConversations = 0 } = params;
    const legalId = get(storedParams, "legalId", "") || get(storedParams, "cedula", "");
    const email = get(storedParams, "email", "");
    const location = get(metadata, "location", "");

    const getName = () => {
        let name = [];
        name = isEmpty(get(currentRoomClients, "names", ""))
            ? isEmpty(get(currentRoomClients, "metadata.names", ""))
                ? "Desconocido"
                : get(currentRoomClients, "metadata.names", "")
            : get(currentRoomClients, "names", "");
        setName(name);
    };

    const getRoomAvatar = () => {
        let src = get(metadata, "profilePicture");

        if (isEmpty(src)) {
            src = get(currentRoomClients, "avatarUrl");
        }

        if (isEmpty(src)) {
            src = "https://s3.us-west-2.amazonaws.com/cdn.devlabs.tech/default_avatar.jpeg";
        }
        setRoomAvatar(src);
    };

    const getDetail = (type) => {
        switch (toUpper(type)) {
            case "WHATSAPP": {
                const id = get(currentRoomClients, "referenceId");
                setDetail(id.replace("@c.us", ""));
                break;
            }
            case "EMAIL": {
                const email = get(currentRoomClients, "referenceId");
                setDetail(email);
                break;
            }
            default: {
                let username = get(currentRoomClients, "metadata.username", "");
                if (!isEmpty(username)) {
                    username = `@${username}`;
                }
                setDetail(username);
                break;
            }
        }
    };

    useEffect(() => {
        setType(get(currentRoomClients, "Bot.type", get(currentRoomClients, "botType", "")));
        getName();
        getRoomAvatar();
        getDetail(get(currentRoomClients, "Bot.type", get(currentRoomClients, "botType", "")));
    }, [currentRoomClients]);

    return (
        <Transition appear show={openProfile} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-50" onClose={closeProfile}>
                <div className="relative min-h-screen">
                    <Dialog.Overlay className="fixed inset-0" />
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity duration-100 ease-linear"
                        enterFrom="opacity-0 -left-0"
                        enterTo="opacity-100"
                        leave="transition-opacity duration-150 ease-in"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0">
                        <div className="fixed top-0 bottom-0 right-0 z-100 w-76 overflow-y-auto overflow-x-hidden bg-white shadow-global">
                            <Dialog.Title className="absolute top-0 right-0 mt-6 mr-6 flex flex-row space-x-4">
                                <button onClick={closeProfile}>
                                    <CloseIcon2
                                        fill="rgba(114, 124, 148, 0.25);"
                                        className="fill-curent text-gray-400 text-opacity-25"
                                        width="1.125rem"
                                        height="1.125rem"
                                    />
                                </button>
                            </Dialog.Title>
                            <Dialog.Description as={"div"}>
                                <div className="relative sticky top-0 mt-10 flex flex-col space-y-4 border-b-1 border-gray-400 border-opacity-10 bg-white p-4 px-8 pb-8">
                                    <div className="flex flex-row items-center justify-start space-x-3">
                                        <div>
                                            <RoomAvatar src={roomAvatar} name={name} type={type} size={"4rem"} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="flex flex-col text-base font-bold text-gray-375">{name}</span>
                                            {toUpper(type).startsWith("TWITTER") ? (
                                                <a
                                                    href={`https://twitter.com/${detail}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex items-center text-13 text-gray-400 hover:text-primary-200 hover:underline">
                                                    {detail}
                                                </a>
                                            ) : toUpper(type).startsWith("INSTAGRAM") ? (
                                                <a
                                                    href={`https://instagram.com/${detail}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex items-center text-13 text-gray-400 hover:text-primary-200 hover:underline">
                                                    {detail}
                                                </a>
                                            ) : (
                                                <span className="flex flex-col text-13 text-gray-400">{detail}</span>
                                            )}
                                        </div>
                                    </div>
                                    {toUpper(type) === "TWITTER_REPLIES" && (
                                        <div className="my-1 flex flex-col">
                                            <div className="flex justify-center space-x-4 text-13 text-gray-400">
                                                <div className="inline-flex space-x-2">
                                                    <ProfileIcon width="15" height="15" className="fill-current text-primary-200" />
                                                    <span>{get(metadata, "followers", "-")}</span>
                                                    <span>Seguidores</span>
                                                </div>
                                                <div className="inline-flex space-x-2">
                                                    <ProfileIcon width="15" height="15" className="fill-current text-primary-200" />
                                                    <span>{get(metadata, "following", "-")}</span>
                                                    <span>Siguiendo</span>
                                                </div>
                                            </div>
                                            {!isEmpty(location) && (
                                                <div className="my-2 flex justify-center text-13 font-bold text-gray-400">
                                                    <LocationIcon width="15" height="15" className="mr-2 fill-current text-primary-200" />
                                                    {location}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <div className="flex flex-wrap-reverse justify-center space-x-1 space-y-2">
                                        {!isEmpty(tags, []) &&
                                            tags.map((tag, index) => {
                                                return (
                                                    <p className="h-6 flex-none" key={index}>
                                                        <Tag tag={tag} key={index} />
                                                    </p>
                                                );
                                            })}
                                    </div>
                                </div>
                                <Disclosure defaultOpen>
                                    {({ open }) => (
                                        <>
                                            <Disclosure.Button className="flex w-full justify-between border-b-1 border-gray-100 border-opacity-25 px-6 py-2">
                                                <span className="flex flex-row items-center">
                                                    <TeamIcon width="17" height="12" fillOpacity="0.60" className="mr-1 fill-current" />
                                                    <span className="font-semibold text-gray-400">{t("clients.clientsInfo")}</span>
                                                </span>
                                                <span className="flex justify-end">
                                                    {open ? (
                                                        <DownIcon
                                                            className="select-none fill-current text-gray-400 outline-none"
                                                            width="1.25rem"
                                                            height="1.25rem"
                                                        />
                                                    ) : (
                                                        <RightIcon
                                                            className="select-none fill-current text-gray-400 outline-none"
                                                            width="1.25rem"
                                                            height="1.25rem"
                                                        />
                                                    )}
                                                </span>
                                            </Disclosure.Button>
                                            <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                                                <span className="my-2 ml-5 flex bg-white focus:outline-none">
                                                    {loadingProfile ? (
                                                        <span className="flex w-full justify-center">
                                                            <ClipLoader size={"2rem"} color="#00B3C7" />
                                                        </span>
                                                    ) : (
                                                        <span className="space-y-3 pl-3">
                                                            <span className="flex flex-col">
                                                                <span className="font-semibold text-gray-400">{t("clients.name")}</span>
                                                                <span className="text-gray-400 text-opacity-75">{name}</span>
                                                            </span>
                                                            {!isEmpty(legalId) && (
                                                                <span className="flex flex-col">
                                                                    <span className="font-semibold text-gray-400">{t("clients.legalId")}</span>
                                                                    <span className="text-gray-400 text-opacity-75">{legalId}</span>
                                                                </span>
                                                            )}
                                                            {!isEmpty(email) && (
                                                                <span className="flex flex-col">
                                                                    <span className="font-semibold text-gray-400">{t("clients.mail")}</span>
                                                                    <span className="text-gray-400 text-opacity-75">{email}</span>
                                                                </span>
                                                            )}
                                                            {toUpper(type) === "WHATSAPP" && !isEmpty(detail) && (
                                                                <span className="flex flex-col">
                                                                    <span className="font-semibold text-gray-400">
                                                                        {toUpper(type) === "WHATSAPP" ? t("clients.phone") : t("clients.user")}
                                                                    </span>
                                                                    <span className="text-gray-400 text-opacity-75">
                                                                        {toUpper(type) === "WHATSAPP" ? "+" : "@"}
                                                                        {detail}
                                                                    </span>
                                                                </span>
                                                            )}
                                                        </span>
                                                    )}
                                                </span>
                                            </Disclosure.Panel>
                                        </>
                                    )}
                                </Disclosure>
                                <Disclosure defaultOpen>
                                    {({ open }) => (
                                        <>
                                            <Disclosure.Button className="mt-2 flex w-full justify-between border-b-1 border-t-1 border-gray-100 border-opacity-25 py-2 px-6">
                                                <div className="flex flex-row items-center">
                                                    <MessageIcon width="17" height="14" className="mr-1 fill-current text-gray-400 text-opacity-50" />
                                                    <div className="font-semibold text-gray-400">{t("clients.conversationInfo")}</div>
                                                </div>
                                                {open ? (
                                                    <DownIcon
                                                        className="select-none fill-current text-gray-400 outline-none"
                                                        width="1.25rem"
                                                        height="1.25rem"
                                                    />
                                                ) : (
                                                    <RightIcon
                                                        className="select-none fill-current text-gray-400 outline-none"
                                                        width="1.25rem"
                                                        height="1.25rem"
                                                    />
                                                )}
                                            </Disclosure.Button>
                                            <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-400">
                                                <div className="my-2 ml-5 flex bg-white pb-10 focus:outline-none">
                                                    {loadingProfile ? (
                                                        <div className="flex w-full justify-center">
                                                            <ClipLoader size={"2rem"} color="#00B3C7" />
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-3 pl-3">
                                                            <div className="flex flex-col">
                                                                <span className="font-semibold text-gray-400">{t("clients.channel")}</span>
                                                                <span className="text-gray-400 text-opacity-75">{type}</span>
                                                            </div>
                                                            {createdAt && (
                                                                <div className="flex flex-col">
                                                                    <span className="font-semibold text-gray-400">
                                                                        {t("clients.initConversation")}
                                                                    </span>
                                                                    <span className="text-gray-400 text-opacity-75">
                                                                        {dayjs(createdAt).format("DD/MM/YYYY - HH:mm:ss")}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            {updatedAt && (
                                                                <div className="flex flex-col">
                                                                    <span className="font-semibold text-gray-400">
                                                                        {t("clients.updateConversation")}
                                                                    </span>
                                                                    <span className="text-gray-400 text-opacity-75">
                                                                        {dayjs(updatedAt).format("DD/MM/YYYY - HH:mm:ss")}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            <div className="flex flex-col">
                                                                <span className="font-semibold text-gray-400">{t("clients.totalConversation")}</span>
                                                                <span className="text-gray-400 text-opacity-75">{countConversations}</span>
                                                            </div>
                                                            {Object.keys(storedParams).map((key, idx) => {
                                                                return (
                                                                    !isEmpty(storedParams[key]) && (
                                                                        <div className="flex flex-col" key={idx}>
                                                                            <span className="font-semibold capitalize text-gray-400">{key}</span>
                                                                            <span className="text-gray-400 text-opacity-75">{storedParams[key]}</span>
                                                                        </div>
                                                                    )
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            </Disclosure.Panel>
                                        </>
                                    )}
                                </Disclosure>
                            </Dialog.Description>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};
export default ProfileModal;
