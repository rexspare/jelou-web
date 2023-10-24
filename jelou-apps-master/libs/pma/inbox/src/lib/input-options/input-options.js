import * as Sentry from "@sentry/react";
import dayjs from "dayjs";
import Fuse from "fuse.js";
import get from "lodash/get";
import has from "lodash/has";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { Mention, MentionsInput } from "react-mentions";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import uniqid from "uniqid";
import ReplyMessage from "../reply-message/reply-message";
import defaultStyle from "../style/defaultStyle";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import isEmpty from "lodash/isEmpty";
import isObject from "lodash/isObject";
import omit from "lodash/omit";
import toLower from "lodash/toLower";
import toUpper from "lodash/toUpper";
import trim from "lodash/trim";

import { addMessage, removeReplyId, setInputMessage, setPlayingAudio } from "@apps/redux/store";
import { MAX_SIZE, USER_TYPES } from "@apps/shared/constants";
import { JelouApiV1 } from "@apps/shared/modules";

import { AudioCloseIcon, CheckIcon, EmojiIcon, MicIcon, MoreIcon1, SendIcon } from "@apps/shared/icons";
// import { Picker } from "emoji-mart";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import DocumentInput from "../input-types/document-input";
import ImageInput from "../input-types/image-input";
import MentionItem from "../mention-item/mention-item";

import Tippy from "@tippyjs/react";

import { useOnClickOutside, usePrevious } from "@apps/shared/hooks";
import { filterByKey } from "@apps/shared/utils";
import { ReactMic } from "@cleandersonlobo/react-mic";
import { Popover, Transition } from "@headlessui/react";

const InputOptions = (props) => {
    const {
        imageUpload,
        documentUpload,
        fileSizeExcessed,
        toUpload,
        uploading,
        Ferror,
        bot,
        setMicPermission,
        setOpenMicModal,
        micPermission,
        messages,
        replyId,
        currentRoom,
    } = props;
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [text, setText] = useState("");
    const [NotificationMessage, setNotificationMessage] = useState("");
    const [openMenu, setOpenMenu] = useState(false);
    const [sendingImage, setSendingImage] = useState(false);
    const [sendingDoc, setSendingDoc] = useState(false);
    const [image, setImage] = useState({
        type: "",
        imgUrl: "",
        file: "",
        path: "",
    });
    const [audio, setAudio] = useState({ type: "", audioUrl: "", file: "", path: "" });
    const [_document, setDocument] = useState({
        mediaUrl: "",
        type: "",
        mimeType: "",
        mediaName: "",
        file: "",
        path: "",
    });
    const [audioTime, setAudioTime] = useState(0);
    const [openOptions, setOpenOptions] = useState(false);
    const [showEmojis, setShowEmojis] = useState(false);
    const [record, setRecord] = useState(false);
    const [sendingAudio, setSendingAudio] = useState(false);
    const [sendingMessage, setSendingMessage] = useState(false);
    const [cancelRecord, setCancelRecord] = useState(false);
    const inputRef = useRef(null);
    const wrapperRef = useRef(null);
    const optionsRef = useRef(null);

    const conversation = useSelector((state) => state.rooms.conversation);
    const inputMessages = useSelector((state) => state.rooms.inputMessages);
    const userSession = useSelector((state) => state.userSession);
    const prevCurrentRoom = usePrevious(currentRoom);

    const hasText = !isEmpty(trim(text));
    const sendAudio = toUpper(get(bot, "name", false)) === "JELOU GROUPS";
    const isMobileApp = {
        AndroidApp: function () {
            return navigator.userAgent.match(/\bAndroid\W+(?:\w+\W+){0,10}?Build\b/g);
        },
        iOSApp: function () {
            return navigator.userAgent.match(/\biPhone|iPad|iPod\W+(?:\w+\W+){0,10}?Build\b/g);
        },
    };

    //componentDidMount
    useEffect(() => {
        checkMic();
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    //componentDidUpdate
    useEffect(() => {
        if (currentRoom?.id !== prevCurrentRoom?.id) {
            const input_message = filterByKey(inputMessages, "roomId", currentRoom.id);
            if (input_message.length > 0) {
                setText(input_message[0].text);
            } else {
                setText("");
            }
        }
    }, [currentRoom]);

    useEffect(() => {
        if (replyId) {
            inputRef.current.focus();
        }
    }, [replyId]);

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
                    };
                });
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleKeyDown = (event) => {
        if (!event.shiftKey && event.key === "Enter") {
            event.preventDefault();
            if (!sendingAudio) {
                createMessage();
            }
        }
    };

    // TODO: This needs a refactor
    const createMessage = async () => {
        if (sendingMessage) {
            return;
        }
        if (isEmpty(trim(text)) && !sendingImage && !sendingDoc && !sendingAudio) {
            return;
        }
        if (Ferror) {
            return;
        }
        setOpenMenu(false);
        setSendingMessage(true);
        let message;

        if (sendingImage) {
            const imgUrl = await prepareFile(image.file, image.path);
            message = {
                type: "IMAGE",
                mediaUrl: imgUrl,
                preview: "imagen",
                caption: btoa(text),
                mimeType: image.type,
            };
        } else if (sendingDoc) {
            const docUrl = await prepareFile(_document.file, _document.path);
            message = {
                type: "DOCUMENT",
                mediaUrl: docUrl,
                mimeType: _document.mimeType,
                caption: _document.mediaName,
            };
        } else if (sendingAudio) {
            const audioUrl = audio.audioUrl;
            message = {
                type: "AUDIO",
                mediaUrl: audioUrl,
            };
        } else {
            message = {
                type: "TEXT",
                text: text,
                ...(replyId ? { quotedMessageId: replyId } : {}),
            };
        }

        setNotificationMessage(text);

        const { appId, source, senderId } = currentRoom;
        const by = USER_TYPES.OPERATOR;

        let messageData;
        const roomId = currentRoom.id;
        switch (toUpper(message.type)) {
            case "TEXT":
                messageData = {
                    appId,
                    senderId,
                    by,
                    source: source,
                    roomId,
                    message: {
                        type: "TEXT",
                        text: text,
                        ...(replyId ? { quotedMessageId: replyId } : {}),
                    },
                    createdAt: dayjs().valueOf(),
                };
                break;
            case "IMAGE":
                messageData = {
                    appId,
                    senderId,
                    by,
                    source: source,
                    roomId,
                    message: {
                        type: "IMAGE",
                        mediaUrl: message.mediaUrl,
                        caption: text,
                        mimeType: image.type,
                    },
                    createdAt: dayjs().valueOf(),
                };
                break;
            case "DOCUMENT":
                messageData = {
                    appId,
                    senderId,
                    sid: senderId,
                    by,
                    source: source,
                    roomId,
                    message: {
                        type: "DOCUMENT",
                        mediaUrl: message.mediaUrl,
                        mimeType: _document.mimeType,
                        caption: _document.mediaName,
                    },
                    createdAt: dayjs().valueOf(),
                };
                break;
            case "AUDIO":
                messageData = {
                    appId,
                    senderId,
                    by,
                    source: source,
                    roomId,
                    message: {
                        type: "AUDIO",
                        mediaUrl: message.mediaUrl,
                    },
                    createdAt: dayjs().valueOf(),
                };
                break;
            default:
                break;
        }

        // Send message to provider
        let replyTo = null;

        if (replyId) {
            replyTo = messages.find((message) => message.id === replyId);
        }

        //SEND MESSAGE
        const formMessage = {
            ...messageData,
            botId: appId,
            userId: senderId,
            bubble: { ...message, ...(replyTo ? { replyTo } : {}) },
            id: uuidv4(),
        };
        console.log("sera?", formMessage);
        // Add message to Redux
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

            Sentry.captureException(new Error(`( Room: Inbox ) Send Message Failed With: ${error.message}`));
        });
        setSendingMessage(false);
        cleaner();
        dispatch(setInputMessage({ roomId: currentRoom?.id, text: "" }));
        dispatch(removeReplyId());
    };

    useOnClickOutside(wrapperRef, () => setShowEmojis(false));

    useOnClickOutside(optionsRef, () => setOpenOptions(false));

    const handleClickOutside = (evt) => {
        setOpenOptions(false);
    };

    const addEmoji = (emoji) => {
        if ("native" in emoji) {
            setText((text) => text + emoji.native);
            dispatch(setInputMessage({ roomId: currentRoom?.id, text: text + emoji.native }));
        }
    };

    const handleChange = (event, text) => {
        setText(text);
        setOpenMenu(false);
        dispatch(setInputMessage({ roomId: currentRoom?.id, text }));
    };

    const getOperators = async (query, callback) => {
        try {
            const { data } = await JelouApiV1.get("/operators", { params: { active: 1 } });
            const operators = data.map((operator) => {
                return {
                    ...operator,
                    display: operator.names,
                };
            });
            if (!query) {
                return callback(operators);
            }
            const fuse = new Fuse(operators, {
                keys: ["names"],
            });
            const results = fuse.search(query);

            return callback(results.map((result) => result.item));
        } catch (error) {
            console.log(error);
        }
    };
    const handleAdd = async (operatorId) => {
        try {
            const { id, appId: botId } = currentRoom;
            await JelouApiV1.post(`/bots/${botId}/rooms/${id}/operator/add`, {
                operatorId,
            });
        } catch (error) {
            console.log(error);
        }
    };

    const getReplyMessage = () => {
        if (!replyId) {
            setReplyMessage(null);
        }
        const message = messages?.find((message) => message?.messageId === replyId || message?.id === replyId);
        setReplyMessage(message);
    };

    const closeReply = () => {
        if (!replyId) {
            setHasCloseReply(false);
        }
        setHasCloseReply(true);
    };

    // to-do fix source not defined
    const getSource = () => {
        try {
            const { info } = conversation;
            const { appId } = info;
            const { source } = source.find((src) => {
                return src.id === appId;
            });
            return source;
        } catch {
            return "Undefined";
        }
    };

    // gives the input's acceptance by source.
    const imageAcceptance = () => {
        const source = getSource();
        switch (toUpper(source)) {
            case "FACEBOOK":
                return "image/*";
            case "WAVY":
                return "image/jpg, image/jpeg, image/png";
            case "TWILIO":
                return "image/jpg, image/png";
            default:
                return "image/jpg, image/jpeg, image/png";
        }
    };

    const documentAcceptance = () => {
        const source = getSource();
        switch (toUpper(source)) {
            case "FACEBOOK":
                return "application/pdf";
            case "WAVY":
                return "application/pdf";
            case "TWILIO":
                return "application/pdf";
            default:
                return ".xls,xlsx,.doc,.docx,.ppt,.pptx,.pdf,.vnd.ms-excel,application/.vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/.vnd.openxmlformats-officedocument.wordprocessingml.document";
        }
    };

    const handleImage = async (evt) => {
        try {
            setOpenOptions(false);
            setOpenMenu(false);
            cleaner();

            const { target } = evt;
            const file = target.files[0];
            var reader = new FileReader();
            const fileType = file.type.split("/").pop();
            let fileName = file.name.replace(/ /g, "_");
            const cleanFileName = fileName;
            fileName = uniqid() + `-${fileName}`;
            fileName = toLower(`${fileName}`);
            const path = `images/${fileName}`;
            const kbSize = file.size / 1000;

            evt.target.value = null;

            imageUpload("");

            // Verify that the file is supported.
            const acceptance = imageAcceptance().split(",");
            const isFileType = !!acceptance.find((acp) => fileType === acp.replace("image/", "").replace(/\s+/, ""));

            if (!isFileType) {
                toast.error(`${t("pma.Formato de imagen no soportado")}`, {
                    autoClose: true,
                    position: toast.POSITION.BOTTOM_CENTER,
                });
                return;
            }

            reader.onloadend = async () => {
                imageUpload(reader.result);
                setSendingImage(true);
                setImage({
                    ...image,
                    file,
                    path,
                    type: fileType,
                });
                // setUploading(true);
                if (kbSize > MAX_SIZE) {
                    fileSizeExcessed(kbSize, cleanFileName);
                    return;
                }
                createMessage(); // Send image message
            };

            if (file) {
                reader.readAsDataURL(file);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const prepareFile = async (file, path) => {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("path", path);
        const url = await uploadFile(formData);
        return url;
    };

    const handleDocument = async (evt) => {
        try {
            setOpenOptions(false);
            setOpenMenu(false);
            cleaner();
            const { target } = evt;
            const file = target.files[0];
            var reader = new FileReader();
            const fileType = file.name.split(".").pop();
            let fileName = file.name.replace(/ /g, "_");
            const cleanFileName = fileName;
            fileName = uniqid() + `-${fileName}`;
            fileName = toLower(`${fileName}`);
            const path = `document/${fileName}`;
            const kbSize = file.size / 1000;

            evt.target.value = null;
            // Verify that the file is supported.
            const acceptance = documentAcceptance().split(",");
            const isFileType = !!acceptance.find((acp) => {
                return `.${fileType}` === acp.replace("application/", "").replace(/\s+/, "");
            });
            if (!isFileType) {
                toast.error(`${t("pma.Formato de documento no soportado")}`, {
                    autoClose: true,
                    position: toast.POSITION.BOTTOM_CENTER,
                });
                return;
            }
            reader.onloadend = async () => {
                documentUpload(cleanFileName);
                setSendingDoc(true);
                setDocument({
                    ..._document,
                    type: "document",
                    mimeType: fileType,
                    mediaName: cleanFileName,
                    file,
                    path,
                });
                // setUploading(true);

                if (kbSize > MAX_SIZE) {
                    fileSizeExcessed(kbSize, cleanFileName);
                    return;
                }

                createMessage(); // Send document
            };
            if (file) {
                reader.readAsDataURL(file);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const uploadFile = (formData) => {
        const { appId } = currentRoom;
        const { Company } = userSession;
        const { clientId, clientSecret } = Company;

        toUpload();

        const auth = {
            username: clientId,
            password: clientSecret,
        };

        const config = {
            headers: {
                "content-type": "multipart/form-data",
            },
            auth,
        };

        return JelouApiV1.post(`/bots/${appId}/images/upload`, formData, config)
            .then(({ data }) => {
                return data;
            })
            .catch(({ error }) => {
                if (has(error, "response.data")) {
                    Sentry.setExtra("error", get(error, "response.data"));
                } else {
                    Sentry.setExtra("error", error);
                }

                Sentry.captureException(new Error("Error uploading file."));
                return error;
            });
    };

    const blobToFile = (blob, fileName) => {
        const config = { responseType: "blob" };
        const { blobURL } = blob;
        const path = `audio/${fileName}.mp3`;
        const contentType = `audio/mpeg`;

        return window.axios.get(blobURL, config).then((response) => {
            const wavFile = new File([response.data], fileName);
            var formdata = new FormData();
            formdata.append("image", wavFile);
            formdata.append("path", path);
            formdata.append("contentType", contentType);
            return formdata;
        });
    };

    const startRecording = () => {
        dispatch(setPlayingAudio(""));
        setRecord(true);
    };
    const askMicPermission = () => {
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then(() => {
                dispatch(setPlayingAudio(""));
                setRecord(true);
            })
            .catch(() => {
                Notification.requestPermission((result) => {
                    if (result === "denied") {
                        // console.log("Permission wasn't granted. Allow a retry.");
                        setMicPermission(false);
                        setOpenMicModal(true);
                        return;
                    } else if (result === "default") {
                        // console.log("The permission request was dismissed.");
                        setMicPermission(false);
                        return;
                    } else if (result === "granted") {
                        // console.log("The permission request was dismissed.");
                        setMicPermission(false);
                        setOpenMicModal(true);
                        return;
                    }
                });
            });
    };

    const stopRecording = () => {
        setRecord(false);
        setAudioTime(0);
    };

    const cancelRecording = () => {
        setRecord(false);
        setAudioTime(0);
        setCancelRecord(true);
    };

    const onStop = async (recordedBlob) => {
        if (cancelRecord) {
            setCancelRecord(false);
            return;
        }

        // setUploading(true);

        const fileName = Date.now();
        const audioFile = await blobToFile(recordedBlob, fileName);
        const path = `audio/${fileName}.mp3`;
        setSendingAudio(true);

        const urlFile = await uploadFile(audioFile, path);
        setAudio({ ...audio, audioUrl: urlFile, path, file: audioFile });

        createMessage();
    };

    const secondsToHms = (d) => {
        d = Number(d);
        var m = Math.floor((d % 3600) / 60);
        var s = Math.floor((d % 3600) % 60);

        if (m < 10) {
            m = "0" + m;
        }
        if (s < 10) {
            s = "0" + s;
        }
        return `${m}:${s}`;
    };

    const handleAudio = (t) => {
        let intervalId;
        if (record) {
            if (audioTime <= 0) {
                const id = setInterval(() => {
                    setAudioTime((audioTime) => audioTime + 1);
                }, 1000);
                intervalId = id;
            }
            // Sending audio after 5 minutes
            if (audioTime >= 300) {
                const sendButton = document.getElementById("sendButton");
                sendButton.click();
            }

            return (
                <div className="flex w-48 flex-row justify-around outline-none">
                    <Tippy content={t("pma.Cancelar")} touch={false}>
                        <button
                            className={`dilate flex h-full w-10 items-center justify-center focus:outline-none`}
                            onClick={(evt) => {
                                clearInterval(intervalId);
                                cancelRecording(evt);
                            }}>
                            <AudioCloseIcon className="z-60 fill-current text-gray-100 hover:text-primary-200" width="1.563rem" height="1.563rem" />
                        </button>
                    </Tippy>
                    <div className="flex flex-row rounded-lg bg-blue-50 px-4">
                        <div className="recDot my-auto mr-2"></div>
                        <div className="my-auto select-none font-semibold text-primary-200" style={{ color: "#707C97" }}>
                            {secondsToHms(audioTime)}
                        </div>
                    </div>
                    <Tippy content={t("pma.Enviar")} touch={false}>
                        <button
                            className={`flex h-8 w-8 items-center justify-center rounded-full bg-primary-200 focus:outline-none`}
                            id={"sendButton"}
                            onClick={(evt) => {
                                if (audioTime >= 1) {
                                    clearInterval(intervalId);
                                    stopRecording(evt);
                                }
                            }}>
                            <CheckIcon className="fill-current " width="0.938rem" height="0.75rem" />
                        </button>
                    </Tippy>
                </div>
            );
        }
        return micPermission ? (
            <Tippy content={t("pma.Grabar")} touch={false}>
                <button
                    className={`flex h-8 w-8 items-center justify-center rounded-full bg-secondary-425 focus:outline-none`}
                    onClick={() => startRecording}>
                    <MicIcon className="fill-current text-white" fill="#ffffff" width="0.875rem" height="1.25rem" />
                </button>
            </Tippy>
        ) : (
            <Tippy content={t("pma.Audio Deshabilitado")} touch={false}>
                <button className={`flex h-8 w-8 items-center justify-center focus:outline-none`} onClick={() => askMicPermission}>
                    <MicIcon className="fill-current text-white" fill="#ffffff" width="0.875rem" height="1.25rem" />
                </button>
            </Tippy>
        );
    };

    const cleaner = () => {
        setText("");
        setImage({
            imgUrl: "",
            file: "",
            path: "",
        });
        setDocument({
            mediaUrl: "",
            type: "",
            mimeType: "",
            mediaName: "",
        });
        setAudio({
            audioUrl: "",
            file: "",
            path: "",
        });
        setSendingImage(false);
        setSendingDoc(false);
        // setSendingText(false);
        // setSendingAudio(false);
        // setUploading(false);
    };

    const [replyMessage, setReplyMessage] = useState(null);
    const [hasCloseReply, setHasCloseReply] = useState(false);

    useEffect(() => {
        getReplyMessage();
        closeReply();
    });

    return (
        <div className={`fixed inset-x-0 bottom-0 left-0 mx-auto mb-3 w-auto rounded-md bg-gray-10 py-2 md:mx-3 md:rounded-xl mid:absolute`}>
            {replyMessage && hasCloseReply && <ReplyMessage message={replyMessage} />}

            <div className="flex flex-row items-center justify-center px-3 sm:px-8 mid:space-x-3">
                <Tippy content={t("pma.Adjuntar")} touch={false}>
                    <div
                        className="mr-2 flex h-8 w-8 cursor-pointer select-none items-center rounded-full bg-secondary-425 hover:bg-secondary-400"
                        onClick={() => setOpenOptions(!openOptions)}>
                        <MoreIcon1 className="m-2 fill-current text-white" width="1.125rem" height="1.125rem" />
                    </div>
                </Tippy>
                {openOptions && (
                    <div className="absolute bottom-0 left-0 z-30 mb-18 ml-3 flex flex-col items-center justify-center sm:!ml-8" ref={optionsRef}>
                        <ImageInput getAcceptance={imageAcceptance} handleChange={handleImage} />
                        <DocumentInput getAcceptance={documentAcceptance} handleChange={handleDocument} />
                    </div>
                )}
                <div className="relative ml-2 w-full md:ml-3">
                    <MentionsInput
                        value={text}
                        onChange={handleChange}
                        style={defaultStyle}
                        allowSuggestionsAboveCursor={true}
                        placeholder={t("pma.Escribe un mensaje")}
                        ignoreAccents={true}
                        onKeyDown={handleKeyDown}
                        autoFocus={true}
                        inputRef={inputRef}
                        className="inbox"
                        a11ySuggestionsListLabel={"Suggested mentions"}>
                        <Mention
                            data={getOperators}
                            renderSuggestion={(entry, search, highlightedDisplay, index, focused) => (
                                <MentionItem entry={entry} search={search} highlightedDisplay={highlightedDisplay} index={index} focused={focused} />
                            )}
                            onAdd={handleAdd}
                            markup="*@__display__*" // The space at the end is intended, there is currently and issue with the library that force us to add that space
                            appendSpaceOnAdd={true}
                            displayTransform={(id, label) => `@${label}`}
                            style={defaultMentionStyle}
                        />
                    </MentionsInput>
                </div>
                <div className="hidden h-10 w-10 items-center justify-center outline-none mid:flex" onClick={() => setShowEmojis(!showEmojis)}>
                    <p style={styles.getEmojiButton}>
                        <svg width="1.375rem" height="1.375rem" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M18.7 3.28998C16.62 1.21998 13.91 0.0800171 11.05 0.0800171C11.04 0.0800171 11.02 0.0800171 11.01 0.0800171C5.00002 0.100017 0.109983 4.99999 0.0999834 10.99C0.0899834 13.96 1.17004 16.55 3.28004 18.7C5.31004 20.76 7.91002 21.84 11.01 21.92C11.07 21.92 11.13 21.92 11.19 21.92C13.95 21.92 16.58 20.82 18.62 18.82C20.73 16.74 21.95 13.9 21.95 11.02C21.95 8.18002 20.77 5.35998 18.7 3.28998ZM20.79 10.99C20.76 16.49 16.45 20.79 10.97 20.79C10.96 20.79 10.95 20.79 10.95 20.79C8.39002 20.78 5.87004 19.7 4.03004 17.82C2.20004 15.95 1.21002 13.52 1.26002 10.99C1.22002 8.44999 2.22002 6.01996 4.07002 4.14996C5.92002 2.27996 8.45003 1.21002 11.02 1.21002C11.04 1.21002 11.06 1.21002 11.08 1.21002C16.47 1.25002 20.82 5.63999 20.79 10.99Z"
                                fill="#7F7F9D"
                            />
                            <path
                                d="M11.26 16.8C9.59 16.74 8.33997 16.29 7.34997 15.22C6.96997 14.81 6.95999 14.38 7.30999 14.04C7.60999 13.74 8.13001 13.75 8.46001 14.13C9.73001 15.61 12.35 15.51 13.6 14.14C13.93 13.77 14.4 13.75 14.7 14.02C15.06 14.34 15.09 14.76 14.74 15.17C14.2 15.81 13.51 16.25 12.72 16.49C12.17 16.66 11.59 16.73 11.26 16.8Z"
                                fill="#7F7F9D"
                            />
                            <path
                                d="M16.92 8.96995C16.91 9.82995 16.14 10.5899 15.28 10.5899C14.43 10.5799 13.67 9.79998 13.68 8.93998C13.69 8.06998 14.45 7.32994 15.32 7.33994C16.2 7.34994 16.93 8.08995 16.92 8.96995Z"
                                fill="#7F7F9D"
                            />
                            <path
                                d="M8.32999 8.96995C8.41999 9.85995 7.46995 10.6 6.71995 10.58C5.85995 10.56 5.09996 9.78997 5.10996 8.92997C5.11996 8.05997 5.87998 7.32 6.74998 7.33C7.64998 7.34 8.33999 8.05995 8.32999 8.96995Z"
                                fill="#7F7F9D"
                            />
                        </svg>
                    </p>
                </div>
                {showEmojis && (
                    <span ref={wrapperRef} style={styles.emojiPicker}>
                        <Popover className={"relative"}>
                            <Tippy content={"Emoji"} placement={"top"} touch={false}>
                                <Popover.Button className={" flex h-10 w-10 items-center"} onClick={() => setShowEmoji(!showEmoji)}>
                                    <EmojiIcon className="fill-current text-gray-400" width="1.375rem" height="1.375rem" />
                                </Popover.Button>
                            </Tippy>
                            <Transition
                                as={Fragment}
                                show={showEmojis}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                                style={styles.emojiPicker}>
                                <Popover.Panel className="absolute bottom-[2.5rem] right-[1rem] z-120 ">
                                    <Picker
                                        theme={"light"}
                                        locale={"es"}
                                        emojiButtonSize={"28"}
                                        emojiSize={"18"}
                                        maxFrequentRows={"2"}
                                        data={data}
                                        previewPosition={"none"}
                                        onEmojiSelect={addEmoji}
                                        onClickOutside={() => setShowEmojis(false)}
                                    />
                                </Popover.Panel>
                            </Transition>
                        </Popover>
                    </span>
                )}
                {uploading ? (
                    <div className="bg-primary flex h-10 w-10 cursor-pointer items-center justify-center rounded-full p-2">
                        <ClipLoader size={"0.9rem"} color={"#ffff"} />
                    </div>
                ) : (
                    <div>
                        {hasText || !sendAudio || isMobileApp.AndroidApp() || isMobileApp.iOSApp() ? (
                            <Tippy content={t("pma.Enviar")} touch={false}>
                                <div className="flex h-8 w-8 cursor-pointer justify-center rounded-full border-transparent bg-secondary-425 hover:bg-secondary-400 focus:outline-none">
                                    <button
                                        disabled={!hasText && !sendingImage && !sendingDoc && !sendingAudio}
                                        className={`flex h-8 w-8 items-center justify-center border-transparent focus:outline-none`}
                                        onClick={() => createMessage()}>
                                        <SendIcon className="-ml-px fill-current text-white" width="0.938rem" height="0.938rem" />
                                    </button>
                                </div>
                            </Tippy>
                        ) : (
                            <div
                                className={`relative flex rounded-full ${
                                    record ? "RecTransition w-48 bg-primary-100" : `w-8 ${micPermission ? "bg-secondary-425" : "bg-secondary-400 "}`
                                } h-8 justify-end`}>
                                {handleAudio(t)}
                            </div>
                        )}
                        <ReactMic
                            record={record}
                            className="hidden w-4"
                            onStop={(evt) => onStop(evt)}
                            strokeColor="#000000"
                            backgroundColor="#FF4081"
                            mimeType="audio/mp3"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default InputOptions;

const defaultMentionStyle = {
    background: "#E7F6F8",
};

const styles = {
    container: {
        padding: "1.25rem",
        borderTop: "0.063rem #4C758F solid",
        marginBottom: "1.25rem",
    },
    form: {
        display: "flex",
    },
    input: {
        color: "inherit",
        background: "none",
        outline: "none",
        border: "none",
        flex: 1,
        fontSize: "1rem",
    },
    getEmojiButton: {
        cssFloat: "right",
        border: "none",
        margin: 0,
        cursor: "pointer",
    },
    emojiPicker: {
        position: "absolute",
        bottom: 0,
        right: 0,
        cssFloat: "right",
        marginLeft: "12.5rem",
    },
};
