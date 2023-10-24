import Tippy from "@tippyjs/react";
import { useDispatch } from "react-redux";
import { ClipLoader } from "react-spinners";
import { useTranslation } from "react-i18next";
import React, { useState, useEffect, useRef } from "react";
import { ReactMic } from "@cleandersonlobo/react-mic";
import axios from "axios";
import { MicIcon, SendIcon, CheckIcon, AudioCloseIcon } from "@apps/shared/icons";
import { usePrevious } from "@apps/shared/hooks";
import { setPlayingAudio } from "@apps/redux/store";

const SendOptions = (props) => {
    const {
        cancelRecord,
        createMessage,
        currentRoom,
        hasText,
        intervalId,
        isMobileApp,
        micPermission,
        record,
        sendAudio,
        sendingAudio,
        sendMessage,
        setCancelRecord,
        setIntervalId,
        setMessage,
        setMicPermission,
        setRecord,
        setSendingAudio,
        setShowEmoji,
        setUploading,
        showFileZone,
        uploadFile,
        uploading,
    } = props;

    const { t } = useTranslation();
    const [audioTime, setAudioTime] = useState(0);

    const cancelRecordRef = useRef();

    const dispatch = useDispatch();

    useEffect(() => {
        cancelRecordRef.current = true;

        // if (prevCurrentRoom !== currentRoom && record) {
        //     setRecord(false);
        //     cancelRecording();
        // }
        return () => {
            setRecord(false);
            setAudioTime(0);
            clearInterval(intervalId);
        };
    }, []);

    useEffect(() => {
        if (record) {
            if (audioTime <= 0) {
                const id = setInterval(() => {
                    setAudioTime((prevState) => prevState + 1);
                }, 1000);
                setIntervalId(id);
            }
            if (audioTime >= 301) {
                const sendButton = document.getElementById("sendButton");
                sendButton.click();
            }
        } else {
            clearInterval(intervalId);
            setCancelRecord(false);
            setAudioTime(0);
        }
    }, [record]);

    const cancelRecording = () => {
        cancelRecordRef.current = true;
        setCancelRecord(true);
    };

    const askMicPermission = () => {
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then(() => {
                setRecord(true);
            })
            .catch(() => {
                Notification.requestPermission((result) => {
                    if (result === "denied") {
                        // console.log("Permission wasn't granted. Allow a retry.");
                        setMicPermission(false);
                        return;
                    } else if (result === "default") {
                        // console.log("The permission request was dismissed.");
                        setMicPermission(false);
                        return;
                    } else if (result === "granted") {
                        // console.log("The permission request was dismissed.");
                        setMicPermission(false);
                        return;
                    }
                });
            });
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

    const startRecording = () => {
        setAudioTime(0);
        setRecord(true);
        cancelRecordRef.current = false;

        dispatch(setPlayingAudio(""));

        if (intervalId) {
            clearInterval(intervalId);
        }
    };

    const stopRecording = () => {
        setRecord(false);
        setAudioTime(0);
    };

    useEffect(() => {
        if (cancelRecord) {
            setRecord(false);
        }
    }, [cancelRecord]);

    const onStop = async (recordedBlob) => {
        if (cancelRecordRef.current) {
            setCancelRecord(false);
            cancelRecordRef.current = false;
            return;
        }
        try {
            setUploading(true);
            const fileName = Date.now();
            const audioFile = await blobToFile(recordedBlob, fileName);
            const path = `audio/${fileName}.mp3`;

            setSendingAudio(true);

            const urlFile = await uploadFile(audioFile, path);

            let message = { mediaUrl: urlFile, type: "AUDIO" };
            setMessage({ mediaUrl: urlFile, type: "AUDIO" });

            createMessage(message, true);
        } catch (err) {
            console.log(err);
        }
    };

    const blobToFile = (blob, fileName) => {
        const config = { responseType: "blob" };
        const { blobURL } = blob;
        const path = `audio/${fileName}.mp3`;
        const contentType = `audio/mpeg`;

        return axios.get(blobURL, config).then((response) => {
            const wavFile = new File([response.data], fileName);
            var formdata = new FormData();
            formdata.append("image", wavFile);
            formdata.append("path", path);
            formdata.append("contentType", contentType);
            return formdata;
        });
    };

    if (uploading) {
        return (
            <div className="flex cursor-pointer items-center justify-center rounded-full bg-secondary-425 p-2">
                <ClipLoader size={16} color={"#ffff"} />
            </div>
        );
    }

    const isDisabledButton = () => {
        if (!sendingAudio) {
            return false;
        }

        if (hasText) {
            return false;
        }

        if (showFileZone) {
            return false;
        }

        return true;
    };
    const isDisabled = isDisabledButton();
    return (
        <div>
            {showFileZone || hasText || !sendAudio || isMobileApp.AndroidApp() || isMobileApp.iOSApp() ? (
                <Tippy content={t("pma.Enviar")} touch={false}>
                    <div className="flex h-8 w-8 cursor-pointer justify-center rounded-full border-transparent bg-secondary-425 hover:bg-secondary-400 focus:outline-none">
                        <button
                            disabled={isDisabled}
                            className={`flex h-8 w-8 items-center justify-center border-transparent focus:outline-none`}
                            onClick={sendMessage}>
                            <SendIcon className="-ml-px fill-current text-white" width="0.938rem" height="0.938rem" />
                        </button>
                    </div>
                </Tippy>
            ) : (
                <div
                    className={`relative flex rounded-full ${
                        record ? "RecTransition w-48 bg-primary-600" : `w-8 ${micPermission ? "bg-secondary-425" : "bg-secondary-400 "}`
                    } h-8 justify-end`}>
                    {record ? (
                        <div className="flex w-48 flex-row justify-around outline-none">
                            <Tippy content={t("pma.Cancelar")} touch={false}>
                                <button
                                    className={`dilate flex h-full w-10 items-center justify-center focus:outline-none`}
                                    onClick={() => {
                                        cancelRecording();
                                        clearInterval(intervalId);
                                    }}>
                                    <AudioCloseIcon
                                        className="z-60 fill-current text-gray-100 hover:text-primary-200"
                                        width="1.563rem"
                                        height="1.563rem"
                                    />
                                </button>
                            </Tippy>
                            <div className={`flex flex-row rounded-lg px-4 ${record ? "bg-transparent" : "bg-blue-50"} `}>
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
                    ) : micPermission ? (
                        <Tippy content={t("pma.Grabar")} touch={false}>
                            <button
                                className={`flex h-8 w-8 items-center justify-center border-transparent focus:outline-none`}
                                onClick={() => {
                                    setShowEmoji(false);
                                    startRecording();
                                }}>
                                <MicIcon className="fill-current text-white" fill="#ffffff" width="0.875rem" height="1.25rem" />
                            </button>
                        </Tippy>
                    ) : (
                        <Tippy content={t("pma.Audio Deshabilitado")} touch={false}>
                            <button
                                className={`flex h-8 w-8 items-center justify-center border-transparent focus:outline-none`}
                                onClick={() => askMicPermission()}>
                                <MicIcon className="fill-current text-white" fill="#ffffff" width="0.875rem" height="1.25rem" />
                            </button>
                        </Tippy>
                    )}
                </div>
            )}
            <ReactMic
                record={record}
                className="hidden w-4"
                onStop={(evt) => onStop(evt)}
                strokeColor="#000000"
                backgroundColor="#209F8B"
                mimeType="audio/mp3"
            />
        </div>
    );
};

export default SendOptions;
