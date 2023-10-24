import {
    faPhoneAlt,
    faPhoneSlash,
    faUser,
    faMicrophone,
    faMicrophoneSlash,
    faVideo,
    faVideoSlash,
    faEllipsisV,
    faImages,
} from "@fortawesome/free-solid-svg-icons";
import has from "lodash/has";
import Sound from "react-sound";
import Tippy from "@tippyjs/react";
import isEmpty from "lodash/isEmpty";
import Draggable from "react-draggable";
import { ClipLoader } from "react-spinners";
import { Popover } from "@headlessui/react";
import { useStopwatch } from "react-timer-hook";
import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { SpinnerIcon, ExpandIcon, MinimizeIcon } from "@apps/shared/icons";

import ParticipantRoom from "./participant-room";
import { URL_PHONE_RING } from "@apps/shared/constants";
import get from "lodash/get";
import isNull from "lodash/isNull";

const OperatorCallModal = (props) => {
    const {
        handleCloseCall,
        room,
        activeAudio,
        activeVideo,
        muteAudio,
        unmuteAudio,
        stopVideo,
        startVideo,
        currentRoom,
        isVideo = false,
        clientAudio,
        company,
    } = props;
    window.soundManager.setup({ debugMode: false });
    const { seconds, minutes, hours, start } = useStopwatch({ autoStart: false });
    const [onCall, setOnCall] = useState(false);
    const [processorBg, setProcessorBg] = useState({});
    const [disconnecting] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [clientName, setClientName] = useState("Cliente");
    const [isPlaying] = useState(Sound.status.PLAYING);
    const modalRef = useRef();
    const [isCalling, setCalling] = useState(false);

    useEffect(() => {
        if (!isEmpty(currentRoom)) {
            setClientName(currentRoom.name);
        }
    }, [currentRoom]);

    function takeCall() {
        setCalling(true);
        window.setTimeout(() => {
            if (!isVideo) {
                start();
                unmuteAudio();
            } else {
                startVideo();
                unmuteAudio();
            }
            setCalling(false);
            setOnCall(true);
        }, 1000);
    }

    function disconnectCall() {
        handleCloseCall();
    }

    function pad2(number) {
        return (number < 10 ? "0" : "") + number;
    }

    const hasBackground = has(company, "properties.backgroundSrc");

    function backgroundBlur() {
        const processorLocal = get(room, "localParticipant.videoTracks", {});
        const iterationObj = processorLocal.values();
        const localtrack = iterationObj.next().value; // get first value;
        const extract = get(localtrack, "track.processor", {});
        if (isNull(extract)) {
            localtrack.track.addProcessor(processorBg);
        } else {
            setProcessorBg(extract);
            localtrack.track.removeProcessor(extract);
        }
    }

    return (
        <Draggable bounds="parent">
            <section
                className={`top-1/5 absolute inset-x-1/2 z-60 place-content-center items-center  justify-center overflow-hidden px-6 pb-12 pt-6 shadow-xl ${
                    expanded ? `expanded-modal-container h-video-call w-video-call` : `modal-container`
                }`}
                style={{ background: "#363e47" }}
                ref={modalRef}>
                <div className="absolute inset-x-0 top-0 z-10 flex w-full flex-row-reverse">
                    <button
                        onClick={() => {
                            setExpanded(!expanded);
                        }}
                        className={`${!isVideo && "hidden"} rounded-full bg-gray-darker bg-opacity-25 p-2 focus:outline-none ${
                            expanded ? `translate-y-6 -translate-x-6 transform` : `translate-y-5 -translate-x-5 transform`
                        }`}>
                        {expanded ? (
                            <MinimizeIcon className="fill-current text-white" width="1.25rem" height="1.25rem" />
                        ) : (
                            <ExpandIcon className="fill-current text-white" width="1.25rem" height="1.25rem" />
                        )}
                    </button>
                </div>
                {onCall && isVideo ? (
                    <>
                        <div className="absolute inset-x-0 inset-y-1/2 z-10 flex flex-row justify-center">
                            <FontAwesomeIcon
                                className={`${expanded ? `buttons__ic` : `buttons__ic_small`} text-white ${clientAudio ? `hidden` : ``}`}
                                icon={faMicrophoneSlash}
                            />
                        </div>
                        <ParticipantRoom returnToLobby={handleCloseCall} room={room} expanded={expanded} clientName={clientName} isVideo={isVideo} />
                        <nav className={`absolute inset-x-0 bottom-5 flex w-full flex-row justify-center gap-4`}>
                            <button
                                className={`buttons ${expanded ? `h-14 w-14` : `h-12 w-12`} ${activeVideo ? `btn_active` : `btn_inactive`}`}
                                onClick={() => {
                                    if (activeVideo) stopVideo();
                                    else startVideo();
                                }}>
                                <span>
                                    <FontAwesomeIcon
                                        className={`${expanded ? `buttons__ic` : `buttons__ic_small`} text-white`}
                                        icon={activeVideo ? faVideo : faVideoSlash}
                                    />
                                </span>
                            </button>
                            <button
                                className={`buttons ${expanded ? `h-14 w-14` : `h-12 w-12`} ${activeAudio ? `btn_active` : `btn_inactive`}`}
                                onClick={() => {
                                    if (activeAudio) muteAudio();
                                    else unmuteAudio();
                                }}>
                                <span>
                                    <FontAwesomeIcon
                                        className={`${expanded ? `buttons__ic` : `buttons__ic_small`} text-white`}
                                        icon={activeAudio ? faMicrophone : faMicrophoneSlash}
                                    />
                                </span>
                            </button>
                            <button
                                className={`buttons btn_end ${expanded ? `h-14 w-14` : `h-12 w-12`}`}
                                onClick={() => {
                                    handleCloseCall();
                                }}>
                                <span>
                                    <FontAwesomeIcon className={`${expanded ? `buttons__ic` : `buttons__ic_small`} text-white`} icon={faPhoneSlash} />
                                </span>
                            </button>
                        </nav>
                        {hasBackground && (
                            <div className={`absolute z-10 ${expanded ? `left-10 bottom-5` : `bottom-5 right-5`} `}>
                                <Popover>
                                    <Popover.Button className={`buttons ${expanded ? `h-14 w-14` : `h-12 w-12`} hover:bg-gray-lighter`}>
                                        <span>
                                            <FontAwesomeIcon
                                                className={`${expanded ? `buttons__ic` : `buttons__ic_small`} text-white`}
                                                icon={faEllipsisV}
                                            />
                                        </span>
                                    </Popover.Button>
                                    <Popover.Panel className={`absolute z-10 ${expanded ? `bottom-16` : `bottom-14`}`}>
                                        <Tippy content={"Fondo"} placement={expanded ? "right" : "left"}>
                                            <button
                                                className={`buttons ${expanded ? `h-14 w-14` : `h-12 w-12`} bg-gray-lighter`}
                                                onClick={() => {
                                                    backgroundBlur();
                                                }}>
                                                <span>
                                                    <FontAwesomeIcon
                                                        className={`${expanded ? `buttons__ic` : `buttons__ic_small`} text-white`}
                                                        icon={faImages}
                                                    />
                                                </span>
                                            </button>
                                        </Tippy>
                                    </Popover.Panel>
                                </Popover>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        {!isVideo && onCall && (
                            <ParticipantRoom
                                returnToLobby={handleCloseCall}
                                room={room}
                                expanded={expanded}
                                clientName={clientName}
                                isVideo={isVideo}
                            />
                        )}
                        <Sound
                            url={URL_PHONE_RING}
                            playStatus={!onCall ? isPlaying : Sound.status.STOPPED}
                            playFromPosition={0 /* in milliseconds */}
                            playbackRate={1}
                            loop={true}
                        />
                        <div className="absolute inset-x-0 top-4 z-10 flex flex-row-reverse">
                            <FontAwesomeIcon
                                className={`${expanded ? `buttons__ic` : `buttons__ic_small mr-4`} text-white ${!onCall && "hidden"} ${
                                    clientAudio ? `hidden` : ``
                                }`}
                                icon={faMicrophoneSlash}
                            />
                        </div>
                        <article className={`flex h-full flex-col flex-wrap content-center items-center ${expanded ? `pt-20` : `mt-10`}`}>
                            <figure className={`icAgentContainer mb-8 flex flex-col items-center p-8 ${!onCall && "pulse"}`}>
                                <FontAwesomeIcon className="icAgent" icon={faUser} />
                            </figure>
                            {onCall ? (
                                <h4 className="mb-1 text-center text-4xl text-white">{clientName || "Cliente"}</h4>
                            ) : (
                                <h4 className="mb-6 text-center text-2xl text-white">
                                    {`${isVideo ? `` : ``} Llamada entrante de`} <br /> {clientName || "Cliente"}
                                </h4>
                            )}
                            <div className={`mb-6 text-xl text-white ${!onCall && "hidden"}`}>
                                <span>{pad2(hours)}</span>:<span>{pad2(minutes)}</span>:<span>{pad2(seconds)}</span>
                            </div>
                        </article>
                        <nav className={`absolute inset-x-0 my-3 ${expanded ? `bottom-5` : `bottom-0`} flex w-full flex-row justify-center gap-5`}>
                            <button className={`${onCall && "hidden"} btn_active h-14 w-14 rounded-full`} onClick={takeCall}>
                                {isCalling ? (
                                    <SpinnerIcon />
                                ) : (
                                    <FontAwesomeIcon className={`${expanded ? `buttons__ic` : `buttons__ic_small`} text-white`} icon={faPhoneAlt} />
                                )}
                            </button>

                            <button
                                className={`buttons ${!onCall && "hidden"} h-14 w-14 ${activeAudio ? `btn_active` : `btn_inactive`}`}
                                onClick={() => {
                                    if (activeAudio) {
                                        muteAudio();
                                    } else {
                                        unmuteAudio();
                                    }
                                }}>
                                <span>
                                    <FontAwesomeIcon
                                        className={`${expanded ? `buttons__ic` : `buttons__ic_small`} text-white`}
                                        icon={activeAudio ? faMicrophone : faMicrophoneSlash}
                                    />
                                </span>
                            </button>
                            <button className={`btn_end h-14 w-14 rounded-full`} onClick={disconnectCall}>
                                {disconnecting ? (
                                    <ClipLoader size={"1.875rem"} color="white" />
                                ) : (
                                    <FontAwesomeIcon className={`${expanded ? `buttons__ic` : `buttons__ic_small`} text-white`} icon={faPhoneSlash} />
                                )}
                            </button>
                        </nav>
                    </>
                )}
            </section>
        </Draggable>
    );
};

export default OperatorCallModal;
