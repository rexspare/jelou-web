import React, { useContext, useEffect, useState } from "react";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import toUpper from "lodash/toUpper";
import Tippy from "@tippyjs/react";

import { SocialIcon } from "@apps/shared/common";
import Highlighter from "react-highlight-words";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { MessageIcon } from "@apps/shared/icons";
import { DateContext } from "@apps/context";

const ProfileCard = (props) => {
    const { card, index, type, handleModal, query, field } = props;
    const dayjs = useContext(DateContext);
    const [name, setName] = useState("");
    const [roomAvatar, setRoomAvatar] = useState("");
    const metadata = get(card, "metadata", {});
    const { t } = useTranslation();
    const [detail, setDetail] = useState("");
    const createdAt = !isEmpty(card.createdAt) ? dayjs(get(card, "createdAt")).format("DD/MM/YYYY") : "-";
    const storedParams = get(card, "storedParams", {});
    const legalId = get(storedParams, "legalId", "") || get(storedParams, "cedula", "");
    const email = get(storedParams, "email", "");
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
            case "WHATSAPP": {
                const id = get(card, "id");
                setDetail(id.replace("@c.us", ""));
                break;
            }
            case "EMAIL": {
                const mail = get(card, "id");
                setDetail(mail);
                break;
            }
            default: {
                let username = get(card, "metadata.username", "");
                if (!isEmpty(username)) {
                    username = `@${username}`;
                }
                setDetail(username);
                break;
            }
        }
    };

    useEffect(() => {
        getName();
        getRoomAvatar();
        getDetail();
    }, [card]);

    return (
        <div className="container relative col-span-1 h-full pt-10" id={index}>
            <div className="flex h-full max-w-sm flex-col justify-between rounded-xl border-1 border-gray-200 bg-white shadow-md">
                <div className="flex cursor-pointer flex-col p-3 px-6" onClick={() => handleModal(card)}>
                    <div className="absolute top-0 left-0 flex w-full justify-center">
                        <img className="h-18 w-18 items-center rounded-full" src={roomAvatar} alt=""></img>
                        <div className="absolute bottom-0 ml-14">
                            <SocialIcon type={type} />
                        </div>
                    </div>
                    <div className="flex flex-col py-5 text-gray-400">
                        {field[0] === "client" ? (
                            <div className="text-base font-bold">
                                <Highlighter highlightClassName="YourHighlightClass" searchWords={[query]} autoEscape={true} textToHighlight={name} />
                            </div>
                        ) : !isEmpty(name) ? (
                            <span className="text-base font-bold">{name}</span>
                        ) : (
                            <br />
                        )}
                        {field[0] === "client" ? (
                            <div className="text-13 text-gray-400 text-opacity-60">
                                <Highlighter
                                    highlightClassName="YourHighlightClass"
                                    searchWords={[query]}
                                    autoEscape={true}
                                    textToHighlight={detail}
                                />
                            </div>
                        ) : !isEmpty(detail) ? (
                            <span className="text-13 text-gray-400 text-opacity-60">{detail}</span>
                        ) : (
                            <br />
                        )}
                    </div>
                    <div className="flex flex-col text-13 text-gray-400">
                        <span className="text-base font-bold capitalize text-gray-400 text-opacity-60">{type}</span>
                        <span className="text-13 text-secondary-300">
                            {toUpper(type).includes("TWITTER") && (
                                <a href={`https://twitter.com/${get(metadata, "username", "")}`} target="_blank" rel="noreferrer">
                                    {`twitter.com/${get(metadata, "username", "")}`}
                                </a>
                            )}
                            {toUpper(type).includes("INSTAGRAM") && (
                                <a href={`https://instagram.com/${get(metadata, "username", "")}`} target="_blank" rel="noreferrer">
                                    {`instagram.com/${get(metadata, "username", "")}`}
                                </a>
                            )}
                        </span>
                        {!isEmpty(email) && <span className="text-13 text-gray-400 text-opacity-60">{email}</span>}
                        {!isEmpty(legalId) && <span className="text-13 text-gray-400 text-opacity-60">{`CI: ${legalId}`}</span>}
                    </div>
                </div>
                <div className="flex items-center justify-between border-t-1 border-gray-20 px-3 text-13 text-gray-400">
                    <Link to={`/clients/conversation/${card.roomId}`} state={{ room: card }}>
                        <button className="pointer-events-auto text-gray-400 text-opacity-75 hover:text-primary-200">
                            <MessageIcon width="1.25rem" height="1.25rem" fill="currentColor" />
                        </button>
                    </Link>
                    <div className="flex h-10 items-center space-x-4 text-sm">
                        <span className="text-gray-400 text-opacity-60">{t("clients.created")}:</span>
                        <Tippy theme="jelou" content={dayjs(get(card, "createdAt")).format("DD/MM/YYYY - hh:mm:ss")} placement={"bottom"}>
                            <span className="truncate text-13 font-bold text-gray-400 text-opacity-90">{createdAt}</span>
                        </Tippy>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
