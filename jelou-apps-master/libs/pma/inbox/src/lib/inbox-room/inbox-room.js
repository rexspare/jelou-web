import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setStoredParams, setCompany, setCurrentRoom } from "@apps/redux/store";
import dayjs from "dayjs";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import first from "lodash/first";
import { usePrevious } from "@apps/shared/hooks";
import { filterByKey, getTime } from "@apps/shared/utils";
import { useTranslation } from "react-i18next";
import { GreetingIcon } from "@apps/shared/icons";
import { RoomHeaderInbox } from "@apps/pma/ui-shared";
import PmaTimelineChat from "@apps/pma/timeline-chat";
import { GridLoader } from "react-spinners";
import InputOptions from "../input-options/input-options";

const InboxRoom = (props) => {
    const { currentRoom, messages } = props;
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [previewImage, setPreviewImage] = useState({
        upload: false,
        img: "",
    });
    const [previewDoc, setPreviewDoc] = useState({
        upload: false,
        fileName: "",
    });
    const [fileError, setFileError] = useState({
        error: false,
        fileName: "",
        size: "",
    });
    const [uploading, setUploading] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [micPermission, setMicPermission] = useState(false);
    const [openMicModal, setOpenMicModal] = useState(false);
    const [time] = useState(dayjs().locale("es").format("HH:mm"));
    const didMount = useRef(null);
    const dispatch = useDispatch();
    const rooms = useSelector((state) => state.rooms);
    const userSession = useSelector((state) => state.userSession);
    const operators = useSelector((state) => state.operators);
    const company = useSelector((state) => state.company);
    const source = useSelector((state) => state.source);
    const showChat = useSelector((state) => state.showChat);
    const bots = useSelector((state) => state.bots);
    const replyId = useSelector((state) => state.replyId);
    const prevUserSession = usePrevious(userSession);
    const { t } = useTranslation();

    //ComponentDidMount
    useEffect(() => {
        didMount.current = true;
        document.addEventListener("keydown", escFunction, false);
        const filteredRoom = rooms.filter((bot) => bot.type === "COMPANY"); //cambiar a estado
        if (isEmpty(filteredRoom)) {
            dispatch(setCurrentRoom({}));
        } else {
            dispatch(setCurrentRoom(first(filteredRoom)));
        }

        dispatch(setStoredParams({}));
        return () => {
            didMount.current = false;
        };
    }, []);

    useEffect(() => {
        if (userSession !== prevUserSession && isEmpty(operators) && !isEmpty(userSession)) {
            // dispatch(getOperators());
            // const { Company } = userSession;
            // if (isEmpty(company)) {
            //     dispatch(setCompany(Company));
            // }
        }
    }, [userSession, operators, company]);

    const renderChat = replyId ? `mb-40 md:mb-40` : `mb-16 md:mb-20 mid:mb-22`;

    // useEffect(() => {
    //     if (!isEmpty(userSession)) {
    //         const { Company } = userSession;
    //         if (isEmpty(company)) {
    //             dispatch(setCompany(Company));
    //         }
    //     }
    // }, [userSession]);

    // This would prevent escaping when conversation group is on Deleting.
    const escFunction = (event) => {
        if (event.keyCode === 27 && uploading) {
            event.stopImmediatePropagation();
            return;
        }
        if (event.keyCode === 27 && (previewImage.upload || previewDoc.upload)) {
            uploaded();
            return;
        }
    };

    const imageUpload = (img) => {
        setPreviewImage({
            upload: true,
            img,
        });
        setPreviewDoc({
            upload: false,
            fileName: "",
        });
    };

    const documentUpload = (fileName) => {
        setPreviewImage({
            upload: false,
            img: "",
        });
        setPreviewDoc({
            upload: true,
            fileName,
        });
    };

    const uploaded = () => {
        setPreviewImage({
            upload: false,
            img: "",
        });
        setPreviewDoc({
            upload: false,
            fileName: "",
        });
        setFileError({
            error: false,
            fileName: "",
            size: "",
        });
        setUploading(false);
    };

    const fileSizeExcessed = (size, fileName) => {
        setFileError({
            fileError: {
                error: true,
                fileName,
                size,
            },
        });
    };

    const openInfo = () => {
        setMobileMenu(!mobileMenu);
    };

    const id = get(currentRoom, "id", {});
    const conversationMessages = filterByKey(messages, "roomId", id);
    const name = get(userSession, "names", "");
    let firstName = first(name.split(" "));
    const greeting = getTime(time, t);
    const canSeeInbox = get(company, "properties.hasInternalInbox", false);

    if (!canSeeInbox) {
        return (
            <div className={`h-full flex-1 ${showChat ? "flex" : "hidden mid:flex"} relative flex-col`}>
                <div className="flex flex-1 flex-col">
                    <div className="relative flex h-full flex-col items-center justify-center bg-white text-center shadow-md mid:rounded-xl">
                        <div className="mx-auto flex max-w-sm flex-col items-center">
                            <GreetingIcon className="my-10" width="25.8125rem" height="18.625rem" />
                            <div className="flex flex-col sm:flex-row">
                                <div className="mr-1 text-xl font-bold text-gray-400/75">{t(greeting)}</div>
                                <div className="text-xl font-bold text-primary-200">{firstName}</div>
                            </div>
                            <div className="text-15 leading-normal text-gray-400/65">{t("pma.Parece que no tienes acceso a esta sección")}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isEmpty(currentRoom)) {
        return (
            <div className={`flex-1 ${showChat ? "flex" : "hidden mid:flex"} relative flex-col`}>
                <div className="flex flex-1 flex-col">
                    <div className="relative flex h-full flex-col items-center justify-center bg-white text-center mid:rounded-xl">
                        <div className="mx-auto flex max-w-sm flex-col items-center">
                            <GreetingIcon className="my-10" width="25.8125rem" height="18.625rem" />
                            <div className="flex flex-col sm:flex-row">
                                <div className="mr-1 text-xl font-bold text-gray-400/75">{t(greeting)}</div>
                                <div className="text-xl font-bold text-primary-200">{firstName}</div>
                            </div>
                            <div className="text-15 leading-normal text-gray-400/65">{t("pma.Aún no tienes consultas entrantes")}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const bot = bots.find((bot) => bot.id === get(currentRoom, "appId", ""));

    return (
        <div className={`${showChat ? "flex" : "hidden mid:flex"} w-full flex-1 overflow-hidden shadow-md mid:rounded-xl`}>
            <div className="flex w-full flex-col">
                <div className="flex h-screen flex-row overflow-y-hidden mid:flex-1">
                    <div className="relative flex w-full flex-col bg-white mid:rounded-l-xl">
                        <RoomHeaderInbox
                            currentRoom={currentRoom}
                            hasButton={true}
                            setMobileMenu={setMobileMenu}
                            openInfo={openInfo}
                            mobileMenu={mobileMenu}
                        />
                        {loadingMessages && (
                            <div className="absolute z-100 mt-[6.063rem] flex w-full justify-center py-5">
                                <GridLoader size={12} color={"#00b3c7"} />
                            </div>
                        )}

                        <div className="flex flex-1 flex-row overflow-y-auto">
                            <PmaTimelineChat
                                className={`${mobileMenu ? "mt-0" : "mt-16 sm:mt-0"} ${renderChat}`}
                                messages={conversationMessages}
                                setLoadingMessage={setLoadingMessages}
                                inbox={true}
                            />
                            <InputOptions
                                source={source || "facebook"}
                                imageUpload={imageUpload}
                                documentUpload={documentUpload}
                                uploaded={uploaded}
                                fileSizeExcessed={fileSizeExcessed}
                                toUpload={setUploading}
                                uploading={uploading}
                                Ferror={fileError.error}
                                bot={bot}
                                setMicPermission={setMicPermission}
                                setOpenMicModal={setOpenMicModal}
                                micPermission={micPermission}
                                openMicModal={openMicModal}
                                messages={messages}
                                replyId={replyId}
                                currentRoom={currentRoom}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InboxRoom;
