import dayjs from "dayjs";
import get from "lodash/get";
import trim from "lodash/trim";
import omit from "lodash/omit";
import Tippy from "@tippyjs/react";
import { v4 as uuidv4 } from "uuid";
import * as Sentry from "@sentry/react";
import { Transition } from "@headlessui/react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import TextareaAutosize from "react-autosize-textarea";
import React, { useState, useRef, useEffect, useCallback } from "react";

import isEmpty from "lodash/isEmpty";
import toUpper from "lodash/toUpper";
import isObject from "lodash/isObject";

import EventsModal from "./events-modal/events-modal";
import SendOptions from "./send-options/send-options";
import Attachments from "./attachments/attachments";
import { JelouApiV1 } from "@apps/shared/modules";
import { filterByKey } from "@apps/shared/utils";
import EmojiPicker from "./emoji-picker/emoji-picker";
import { QuickReplyIcon } from "@apps/shared/icons";
import TemplateShortCut from "./hsm-shortcut/hsm-shortcut";
import { QuickReplyModal, FileZone, PreviewFacebookImage as Preview } from "@apps/pma/ui-shared";
import { setInputMessage, addMessage, updateMessage, updateRoomById, updateCurrentRoom } from "@apps/redux/store";
import { USER_TYPES, FACEBOOK_MAX_LENGTH, INSTAGRAM_MAX_LENGTH, DOCUMENT_MESSAGE_TYPES, MESSAGE_TYPES } from "@apps/shared/constants";
import { renderMessage } from "@apps/shared/common";
import { usePrevious, useUploadFile } from "@apps/shared/hooks";
import { usePaymentsPlans } from "./payment/hooks/plans";
import { CustomPayment, RecurringPayment } from "./payment";

const InputOptions = (props) => {
    const {
        bot,
        clearDocumentList,
        documentList,
        handleDeleteImage,
        handleAddFiles,
        handleSelectFiles,
        micPermission,
        setMicPermission,
        uploadingDropZone,
        setDocumentList,
    } = props;
    const { t } = useTranslation();
    const [cancelRecord, setCancelRecord] = useState(false);
    const [customEvents, setCustomEvents] = useState([]);
    const [intervalId, setIntervalId] = useState(false);
    const [openOptions, setOpenOptions] = useState(false);
    const [phone, setPhone] = useState("");
    const [record, setRecord] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [sendingAudio, setSendingAudio] = useState(false);
    const [sendingEvent, setSendingEvent] = useState(false);
    const [showEmoji, setShowEmoji] = useState(false);
    const [showEventModal, setShowEventModal] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [showShortCut, setShowShorCut] = useState(false);
    const [showTemplates, setShowTemplates] = useState(false);
    const [text, setText] = useState("");
    const [uploading, setUploading] = useState(false);
    const [showCustomPaymentModal, setShowCustomPaymentModal] = useState(false);
    const [showRecurringPaymentModal, setShowRecurringPaymentModal] = useState(false);

    const company = useSelector((state) => state.company);
    const currentRoom = useSelector((state) => state.currentRoom);
    const inputMessages = useSelector((state) => state.inputMessages);
    const userSession = useSelector((state) => state.userSession);

    const prevCurrentRoom = usePrevious(currentRoom);

    const { uploadFile } = useUploadFile();

    const dispatch = useDispatch();

    const hasText = !isEmpty(trim(text));
    const isMobileApp = {
        AndroidApp: function () {
            return navigator.userAgent.match(/\bAndroid\W+(?:\w+\W+){0,10}?Build\b/g);
        },
        iOSApp: function () {
            return navigator.userAgent.match(/\biPhone|iPad|iPod\W+(?:\w+\W+){0,10}?Build\b/g);
        },
    };

    const canPasteFiles = get(company, "properties.canPasteImages", true);
    const isFacebookChat = toUpper(get(currentRoom, "source", "WEB")) === "FACEBOOK";
    const isFacebookFeed = toUpper(get(currentRoom, "source", "WEB")) === "FACEBOOK_FEED";
    const isTwitterChat = toUpper(get(currentRoom, "source", "WEB")) === "TWITTER";
    const isInstagramChat = toUpper(get(currentRoom, "source", "WEB")) === "INSTAGRAM";
    const isWhatsAppChat = toUpper(get(currentRoom, "channel")) === "WHATSAPP";
    const isWidget = toUpper(get(currentRoom, "channel")) === "WIDGET";
    const isAudioChannel = isFacebookChat || isWhatsAppChat || isWidget;

    const sendAudio = get(bot, "properties.sendAudio", true) && isAudioChannel;
    const showFileZone = Boolean(documentList.length > 0);

    let inputElement = useRef(null);

    let refText = useRef(text);
    refText.current = text;

    let textMaxLength = Infinity;

    if (isFacebookChat) {
        textMaxLength = FACEBOOK_MAX_LENGTH;
    }

    if (isInstagramChat) {
        textMaxLength = INSTAGRAM_MAX_LENGTH;
    }

    const handleKeyDownShortCut = (event) => {
        if (event.key === "/" && refText.current === "") {
            if (inputElement.current) {
                inputElement.current.blur();
            }
            setShowEmoji(false);
            setShowShorCut(true);
        }
    };

    const handlePasteFiles = async (event) => {
        setShowEmoji(false);
        const files = (event.clipboardData || event.originalEvent.clipboardData).files;
        const hasFiles = files && files.length > 0;

        if (hasFiles) {
            event.preventDefault();
            handleAddFiles({ files, documentList });
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDownShortCut);
        if (canPasteFiles) {
            document.addEventListener("paste", handlePasteFiles);
        }
        return () => {
            // console.log("remove event");
            document.removeEventListener("keydown", handleKeyDownShortCut);
            document.removeEventListener("paste", handlePasteFiles);
        };
    }, [document]);

    useEffect(() => {
        if (!isEmpty(currentRoom)) {
            setCurrentRoomPhone();
            const input_message = filterByKey(inputMessages, "roomId", currentRoom.id);
            if (input_message.length > 0) {
                setText(input_message[0].text);
            }
            if (prevCurrentRoom !== currentRoom) {
                dispatch(setInputMessage({ roomId: currentRoom.id, text: "" }));
            }
        }
    }, [currentRoom]);

    useEffect(() => {
        checkMic();
        getCustomEvents();
    }, []);

    /**
     * Currently firefox does not support permission API
     * Also Safari does not have any support on navigator.permissions
     */
    const checkMic = () => {
        const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
        if (navigator.permissions && !isFirefox) {
            try {
                navigator.permissions.query({ name: "microphone" }).then((permissionStatus) => {
                    setMicPermission(permissionStatus.state === "granted");
                    permissionStatus.onchange = () => {
                        setMicPermission(permissionStatus.state === "granted");
                        setMicPermission(permissionStatus.state === "granted");
                    };
                });
            } catch (error) {
                console.log(error, "error with mic permission API");
            }
        }
    };

    const setCurrentRoomPhone = async () => {
        try {
            const { senderId } = await currentRoom;
            const phone = senderId.replace("@c.us", "");
            setPhone(phone);
        } catch (error) {
            console.log(error);
        }
    };

    const getCustomEvents = async () => {
        try {
            const companyId = get(userSession, "companyId", null);

            if (!companyId) {
                return;
            }

            const { data } = await JelouApiV1.get(`/company/${companyId}/custom_events`, {
                params: {
                    shouldPaginate: false,
                },
            });

            setCustomEvents(get(data, "results", []));
        } catch (error) {
            console.log(error, "error on custom events");
        }
    };

    const sendMessage = async () => {
        const loadingsValues = Object.values(uploadingDropZone);
        const hasSomeLoading = loadingsValues.some((value) => value === true);

        if (!sendingAudio && hasText && documentList.length === 1 && !hasSomeLoading) {
            const doc = documentList[0];
            const { mediaUrl, type } = doc;
            const [typeFile] = type.split("/");
            const messageType = DOCUMENT_MESSAGE_TYPES[typeFile] ?? null;

            if (messageType) {
                const message = { mediaUrl, type: messageType, mimeType: type, caption: trim(text), width: 2 };
                console.log({ message });

                await createMessage(message, true);
                clearDocumentList();

                return;
            }
        }

        if (!hasSomeLoading && showFileZone) {
            for (let i = 0; i < documentList.length; i++) {
                const doc = documentList[i];
                const { mediaUrl, type } = doc;
                const [typeFile] = type.split("/");
                const messageType = DOCUMENT_MESSAGE_TYPES[typeFile] || DOCUMENT_MESSAGE_TYPES.document;

                const message = { mediaUrl, type: messageType, mimeType: type, width: 2 };
                await createMessage(message, true);
            }
            clearDocumentList();
        }

        if (!sendingAudio && hasText) {
            const sendMessageText = () => {
                const message = { type: "TEXT", text };
                createMessage(message);
            };

            showFileZone ? setTimeout(() => sendMessageText(), 500) : sendMessageText();
        }
    };

    const handleKeyDown = (event) => {
        if (!event.shiftKey && event.key === "Enter") {
            event.preventDefault();
            if (!sendingAudio) {
                sendMessage();
            }
        }
    };

    const handleChange = (event) => {
        const text = event.target.value;
        if (text === "/") {
            return;
        }
        setText(text);
        dispatch(setInputMessage({ roomId: currentRoom.id, text }));
    };

    const sendTemplate = async (message) => {
        const by = USER_TYPES.OPERATOR;
        const { appId, source } = currentRoom;
        let { senderId } = currentRoom;

        const roomId = currentRoom.id;

        const removePlus = source === "gupshup" || source === "wavy";
        if (removePlus) {
            senderId = senderId.replace("+", "");
        }

        //SEND MESSAGE
        const formMessage = {
            by,
            source,
            roomId,
            botId: appId,
            userId: senderId,
            bubble: message,
            operatorId: userSession.providerId,
            id: uuidv4(),
            createdAt: dayjs().valueOf(),
        };

        // Add message to Redux
        changeRepliedRoom();
        dispatch(addMessage(formMessage));

        // Send message to server
        JelouApiV1.post(`/operators/message`, omit(formMessage, ["source"])).catch((error) => {
            console.error("Error on send message", error.response);

            Sentry.configureScope((scope) => {
                const data = isObject(error.response) ? JSON.stringify(error.response, null, 2) : error.response;
                scope.setExtra("formMessage", formMessage);
                scope.setExtra("userSession", userSession);
                scope.setExtra("errorResponse", data);
            });

            Sentry.captureException(new Error(`( Room ) Send Message Hsm Failed With: ${error.message}`));
        });
    };

    const changeRepliedRoom = () => {
        const wasReplied = get(currentRoom, "conversation.wasReplied", false) === false;

        if (wasReplied) {
            const updatedRoom = {
                ...currentRoom,
                conversation: {
                    ...currentRoom.conversation,
                    wasReplied: true,
                },
            };

            dispatch(updateRoomById(updatedRoom)); // it updates the room in the left sidebar (inbox)
            dispatch(updateCurrentRoom(updatedRoom)); // it updates the curretn room (redux)
        }
    };

    // TODO: This needs a refactor
    const createMessage = async (message, ignoreText = false) => {
        const isFacebookChat = toUpper(get(currentRoom, "source", "WEB")) === "FACEBOOK";
        const isInstagramChat = toUpper(get(currentRoom, "source", "WEB")) === "INSTAGRAM";
        const textMaxLength = isFacebookChat ? FACEBOOK_MAX_LENGTH : INSTAGRAM_MAX_LENGTH;

        if ((isFacebookChat || isInstagramChat) && text.length > textMaxLength) {
            renderMessage(`El mensaje es mayor a ${textMaxLength} caracteres`, MESSAGE_TYPES.ERROR);
            return;
        }

        if (isEmpty(trim(text)) && !sendingAudio && !ignoreText) {
            return;
        }

        const { appId, source } = currentRoom;
        let { senderId } = currentRoom;
        const by = USER_TYPES.OPERATOR;

        const removePlus = source === "gupshup" || source === "wavy";
        if (removePlus) {
            senderId = senderId.replace("+", "");
        }

        const roomId = currentRoom.id;

        //SEND MESSAGE
        const formMessage = {
            appId,
            botId: appId,
            bubble: message,
            by,
            createdAt: dayjs().valueOf(),
            id: uuidv4(),
            roomId,
            senderId,
            source,
            userId: senderId,
        };

        // Add message to Redux
        changeRepliedRoom();
        dispatch(addMessage(formMessage));

        // Send message to server
        JelouApiV1.post(`/operators/message`, omit(formMessage, ["source"]))
            .then((res) => {
                const { data } = res;
                console.log(`Message sent:`, JSON.stringify(message, null, 2), get(data, "data.messageId", ""));
            })
            .catch((error) => {
                dispatch(
                    updateMessage({
                        ...formMessage,
                        status: "FAILED",
                    })
                );

                Sentry.configureScope((scope) => {
                    const data = isObject(error.response) ? JSON.stringify(error.response, null, 2) : error.response;
                    scope.setExtra("formMessage", formMessage);
                    scope.setExtra("userSession", userSession);
                    scope.setExtra("errorResponse", data);
                });

                Sentry.captureException(new Error(`( Room ) Send Message Failed With: ${error.message}`));
            });

        cleaner();
        dispatch(setInputMessage({ roomId, text: "" }));
    };

    const cleaner = () => {
        // setMessage({});
        setText("");
        setSendingAudio(false);
        setUploading(false);
        clearInterval(intervalId);
    };

    const openPreviewModal = () => {
        setShowPreview(true);
        // setUploadingFile(true);
        setShowEmoji(false);
    };

    const closePreviewModal = () => {
        cleaner();
        setShowPreview(false);
        setSelectedFile(null);
    };

    const handleSeletedFileToPreview = (file) => {
        setSelectedFile(file);
        openPreviewModal();
    };

    const addEmoji = (e) => {
        setShowEmoji(false);
        let sym = e.unified.split("-");
        let codesArray = [];
        sym.forEach((el) => codesArray.push("0x" + el));
        let emoji = String.fromCodePoint(...codesArray);

        setText(text + " " + emoji + " ");

        if (inputElement.current) {
            inputElement.current.focus();
        }

        dispatch(setInputMessage({ roomId: currentRoom.id, text: text + " " + emoji + " " }));
    };

    const closeTemplates = () => {
        setShowTemplates(false);
        setShowShorCut(false);
    };

    const copyToClipBoard = (text) => {
        setText(text);
        dispatch(setInputMessage({ roomId: currentRoom.id, text }));
        closeTemplates();
    };

    const handleSendEvent = async (event) => {
        try {
            setSendingEvent(true);

            const { senderId: userId, appId: botId } = currentRoom;
            await JelouApiV1.post("/operators/event", {
                botId,
                userId,
                bubble: {
                    type: "EVENT_CUSTOM",
                    slug: event.slug,
                    description: event.name,
                },
            });
        } catch (error) {
            console.log("Error on send event", error);
        } finally {
            setSendingEvent(false);
            setShowEventModal(false);
        }
    };

    const [isShortCutToShowPreview, setIsShortCutToShowPreview] = useState(false);

    const onCloseCustomPayment = useCallback(() => setShowCustomPaymentModal(false), []);
    const handleOpenCustomPayment = useCallback(() => setShowCustomPaymentModal(true), []);

    const onCloseRecurringPayment = useCallback(() => setShowRecurringPaymentModal(false), []);
    const handleOpenRecurringPayment = useCallback(() => setShowRecurringPaymentModal(true), []);

    const { plans } = usePaymentsPlans();
    const showRecurringPaymentButton = plans.length > 0;

    return (
        <div className="mx-2 mb-2 mt-1 rounded-xl bg-gray-10">
            {showFileZone && (
                <FileZone
                    documentList={documentList}
                    handleDeleteImage={handleDeleteImage}
                    handleSelectFiles={handleSelectFiles}
                    setSelectedFile={handleSeletedFileToPreview}
                    uploadingDropZone={uploadingDropZone}
                    currentRoom={currentRoom}
                    isShortCutToShowPreview={isShortCutToShowPreview}
                    setDocumentList={setDocumentList}
                />
            )}
            <div className="px-2 py-2 sm:px-5">
                <div className="flex flex-row items-center justify-center  transition-all">
                    <Attachments
                        handleOpenRecurringPayment={handleOpenRecurringPayment}
                        showRecurringPaymentButton={showRecurringPaymentButton}
                        customEvents={customEvents}
                        documentList={documentList}
                        handleFile={handleSelectFiles}
                        isFacebookChat={isFacebookChat}
                        isFacebookFeed={isFacebookFeed}
                        isInstagramChat={isInstagramChat}
                        isTwitterChat={isTwitterChat}
                        isWhatsAppChat={isWhatsAppChat}
                        isWidget={isWidget}
                        openOptions={openOptions}
                        setOpenOptions={setOpenOptions}
                        setShowEmoji={setShowEmoji}
                        setShowEventModal={setShowEventModal}
                        handleOpenCustomPayment={handleOpenCustomPayment}
                    />
                    <Tippy content={t("pma.Mensajes Rápidos")} touch={false}>
                        <div className="m-auto ml-2 flex h-8 w-8 cursor-pointer items-center rounded-full bg-primary-200 hover:bg-primary-100">
                            <label
                                className="custom-file-upload flex cursor-pointer items-center"
                                onClick={() => {
                                    setShowTemplates(true);
                                    setShowEmoji(false);
                                }}>
                                <QuickReplyIcon className="m-2 fill-current text-white" width="1.063rem" height="1.313rem" />
                            </label>
                        </div>
                    </Tippy>
                    {showPreview && <Preview isOpen={showPreview} onClose={closePreviewModal} selectedFile={selectedFile} />}
                    {showTemplates && (
                        <QuickReplyModal
                            copyToClipBoard={copyToClipBoard}
                            onClose={closeTemplates}
                            phone={`+${phone}`}
                            quickReply={true}
                            sendCustomText={sendTemplate}
                            setMessage={(da) => console.log("este es el setMessage de QuickReplyModal", da)}
                            setShowPreview={setShowPreview}
                        />
                    )}
                    <div className="relative my-auto ml-2 flex w-full flex-row items-center md:ml-3">
                        <TextareaAutosize
                            autoFocus
                            className="w-full resize-none overflow-y-auto border-transparent bg-transparent align-middle text-base font-medium leading-normal text-gray-400 outline-none placeholder:text-gray-400 placeholder:text-opacity-65 focus:border-transparent focus:ring-transparent md:text-15"
                            maxRows={5}
                            placeholder={"Escribe un mensaje"}
                            onChange={handleChange}
                            disabled={record || sendingAudio}
                            value={text}
                            onKeyDown={(evt) => handleKeyDown(evt)}
                            ref={inputElement}
                        />
                        {(isFacebookChat || isInstagramChat) && (
                            <div
                                className={`pointer-events-none mr-2 mt-1 select-none text-sm font-semibold ${
                                    text.length > textMaxLength ? "text-red-675 opacity-75" : "text-gray-600 opacity-50"
                                }`}>
                                {text.length}/{textMaxLength}
                            </div>
                        )}
                    </div>
                    <EmojiPicker addEmoji={addEmoji} showEmoji={showEmoji} setShowEmoji={setShowEmoji} />
                    <SendOptions
                        cancelRecord={cancelRecord}
                        createMessage={createMessage}
                        currentRoom={currentRoom}
                        hasText={hasText}
                        intervalId={intervalId}
                        isMobileApp={isMobileApp}
                        micPermission={micPermission}
                        record={record}
                        sendAudio={sendAudio}
                        sendingAudio={sendingAudio}
                        sendMessage={sendMessage}
                        setCancelRecord={setCancelRecord}
                        setIntervalId={setIntervalId}
                        setMessage={(da) => console.log("este es el setMessage de SendOptions", da)}
                        setMicPermission={setMicPermission}
                        setRecord={setRecord}
                        setSendingAudio={setSendingAudio}
                        setShowEmoji={setShowEmoji}
                        setUploading={setUploading}
                        showFileZone={showFileZone}
                        uploadFile={uploadFile}
                        uploading={uploading}
                    />
                </div>
                <Transition
                    show={showShortCut}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95">
                    <div className="absolute bottom-0 left-0 z-100 mb-[3.3rem] ml-2 w-72 rounded-12 bg-white shadow-normal">
                        <TemplateShortCut
                            company={company}
                            copyToClipBoard={copyToClipBoard}
                            handleKeyDownShortCut={handleKeyDownShortCut}
                            onClose={closeTemplates}
                            showShortCut={showShortCut}
                            setSelectedFile={setSelectedFile}
                            setDocumentList={setDocumentList}
                            setIsShortCutToShowPreview={setIsShortCutToShowPreview}
                        />
                    </div>
                </Transition>
                {showEventModal && (
                    <EventsModal
                        closeEventsModal={() => setShowEventModal(false)}
                        customEvents={customEvents}
                        handleSendEvent={handleSendEvent}
                        sendingEvent={sendingEvent}
                        showEventModal={showEventModal}
                    />
                )}

                <CustomPayment
                    createMessage={createMessage}
                    onCloseCustomPayment={onCloseCustomPayment}
                    showCustomPaymentModal={showCustomPaymentModal}
                />

                <RecurringPayment
                    plans={plans}
                    createMessage={createMessage}
                    onCloseRecurringPayment={onCloseRecurringPayment}
                    showRecurringPaymentModal={showRecurringPaymentModal}
                />
            </div>
        </div>
    );
};

export default InputOptions;
