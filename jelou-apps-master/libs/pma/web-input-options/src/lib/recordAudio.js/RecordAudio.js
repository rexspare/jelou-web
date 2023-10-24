import { setPlayingAudio } from "@apps/redux/store";
import { AudioCloseIcon, CheckIcon, ModernMicIcon } from "@apps/shared/icons";
import { Popover, Transition } from "@headlessui/react";
import Tippy from "@tippyjs/react";
import axios from "axios";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { usePopper } from "react-popper";
import { useDispatch } from "react-redux";
import { ClipLoader } from "react-spinners";
import AudioReactRecorder, { RecordState } from "audio-react-recorder";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import get from "lodash/get";
const RecordAudio = (props) => {
    const {
        t,
        audioRef,
        cancelRecord,
        disableButton,
        setAudioBlobs,
        audioBlobs,
        intervalId,
        micPermission,
        record,
        setCancelRecord,
        setIntervalId,
        setMicPermission,
        setRecord,
        setSendingAudio,
        setShowEmoji,
        setUploading,

        uploading,
    } = props;
    const [popperElement, setPopperElement] = useState();

    const { styles, attributes } = usePopper(audioRef, popperElement);
    const [audioTime, setAudioTime] = useState(0);
    const [send, setSend] = useState(false);
    const [audioState, setAudioState] = useState(RecordState.NONE);
    const [showAudioBg, setShowAudioBg] = useState(false);
    const cancelRecordRef = useRef();
    const [micIsAvailable, setMicIsAvailable] = useState(false);
    const dispatch = useDispatch();
    const userSession = useSelector((state) => state.userSession);
    const companyId = get(userSession, "companyId", "");
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
            let time = 0;
            if (time <= 0) {
                const id = setInterval(() => {
                    setAudioTime((prevState) => prevState + 1);
                    time += 1;
                    if (time >= 180) {
                        const stopButton = document.getElementById("playStopButton");
                        time = 0;
                        stopButton.click();
                    }
                }, 1000);
                setIntervalId(id);
            }
        } else {
            clearInterval(intervalId);
            setCancelRecord(false);
            setAudioTime(0);
        }
    }, [record]);

    const cancelRecording = () => {
        setAudioState(RecordState.STOP);
        setRecord(false);
        cancelRecordRef.current = true;
        setCancelRecord(true);
        setShowAudioBg(false);
    };

    useEffect(() => {
        if (send) {
            setRecord(false);
            setAudioTime(0);
            setAudioState(RecordState.STOP);
            setSend(false);
        }
    }, [send]);

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
    const maxAudiosReached = audioBlobs.length === 3;
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
            const fileName = Date.now();
            const audioFile = await blobToFile(recordedBlob, fileName);
            const path = `audio/${fileName}.mp3`;
            const audioFileData = {
                name: fileName,
                type: "AUDIO",
                path: path,
                audioFile,
                id: uuidv4(),
            };
            setSendingAudio(true);

            setAudioBlobs([...audioBlobs, audioFileData]);

            setShowAudioBg(false);
        } catch (err) {
            setUploading(false);
            setShowAudioBg(false);
            console.log("error", err);
            if (err?.message === "maxSize") {
                toast.error("Tamaño del archivo excedido");
            }
        }
    };
    useEffect(() => {
        if (micIsAvailable) {
            return;
        }
        cancelRecording();
    }, [micIsAvailable]);
    navigator.mediaDevices
        .enumerateDevices()
        .then(function (devices) {
            var microphoneConnected = devices.some(function (device) {
                return device.kind === "audioinput";
            });

            if (microphoneConnected) {
                setMicIsAvailable(true);
            } else {
                setMicIsAvailable(false);
            }
        })
        .catch(function (error) {
            console.log("Error enumerating devices:", error);
        });

    const blobToFile = async (blobAudio, fileName) => {
        const size = blobAudio?.blob?.size;
        if (size >= 67100000) {
            throw new Error("maxSize");
        }
        const blob = { blobURL: blobAudio.url };
        const config = { responseType: "blob" };
        const { blobURL } = blob;
        const UUID = uuidv4();
        const path = `dropzone-${companyId}/audio/${UUID}-${fileName}.mp3`;
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
            <div className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-secondary-425 p-[2px]">
                <ClipLoader size={14} color={"#ffff"} />
            </div>
        );
    }

    return (
        <>
            <Popover as={"div"}>
                {record ? (
                    <div className="relative z-120 flex items-center justify-around outline-none">
                        <Tippy content={t("pma.Detener grabación")} touch={false}>
                            <button
                                className={`z-120 flex h-6 w-6 items-center justify-center rounded-full bg-primary-200 focus:outline-none`}
                                id={"playStopButton"}
                                onClick={() => {
                                    if (audioTime >= 2) {
                                        clearInterval(intervalId);
                                        setSend(true);
                                        stopRecording();
                                    }
                                }}
                            >
                                <CheckIcon className="fill-current " width="0.938rem" height="0.75rem" />
                            </button>
                        </Tippy>
                        <div className={`z-120 flex w-24 flex-row rounded-lg px-4 ${record && "bg-blue-50"} `}>
                            <div className="recDot my-auto mr-2"></div>
                            <div className="my-auto select-none font-semibold text-primary-200" style={{ color: "#707C97" }}>
                                {secondsToHms(audioTime)}
                            </div>
                        </div>

                        <Tippy content={t("pma.Cancelar")} touch={false}>
                            <button
                                className={`group z-120 flex h-full items-center justify-center pl-1 focus:outline-none`}
                                onClick={() => {
                                    cancelRecording();
                                    clearInterval(intervalId);
                                }}
                            >
                                <AudioCloseIcon className=" z-120 fill-current text-gray-100 hover:text-primary-200" width="1.25rem" height="1.25rem" />
                            </button>
                        </Tippy>
                    </div>
                ) : (
                    <Tippy content={maxAudiosReached ? t("pma.Máximo alcanzado") : micPermission ? t("pma.Grabar audio") : t("pma.Audio Deshabilitado")} touch={false}>
                        <button
                            // disabled={disableButton}
                            className={`relative flex h-5 w-5 items-center rounded-full border-transparent p-[2px] hover:cursor-pointer hover:bg-primary-350 focus:outline-none disabled:hover:bg-transparent`}
                            onClick={() => {
                                if (disableButton) return;
                                if (!micPermission) {
                                    askMicPermission();
                                    return;
                                }
                                if (!micIsAvailable) {
                                    toast.error(t("No se ha detectado un micrófono conectado"));
                                    return;
                                }
                                setShowAudioBg(true);
                                setShowEmoji(false);
                                setAudioState(RecordState.START);
                                startRecording();
                            }}
                        >
                            <ModernMicIcon
                                className={`${disableButton && "!text-gray-300 hover:cursor-not-allowed hover:bg-none"} ${micPermission ? "text-gray-400 hover:text-primary-200 " : "text-gray-300"} `}
                                width="100%"
                                height="100%"
                            />
                        </button>
                    </Tippy>
                )}

                <Transition
                    show={showAudioBg || uploading}
                    as={Fragment}
                    enter="transition duration-150 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                >
                    <Popover.Panel static ref={setPopperElement} style={{ ...styles.popper }} className={"w-full rounded-xl shadow-boxCentered"} {...attributes.popper}>
                        <div style={{ background: "linear-gradient(360deg, #fff 16%, rgba(217, 217, 217, 0.00) 100%)" }} className="absolute bottom-0 z-120 h-[16rem] w-full"></div>
                    </Popover.Panel>
                </Transition>
            </Popover>

            <AudioReactRecorder canvasWidth={0} canvasHeight={0} state={audioState} onStop={onStop} />
            {record && <div className="fixed top-0 left-0 z-100 h-screen w-screen"></div>}
        </>
    );
};

export default RecordAudio;
