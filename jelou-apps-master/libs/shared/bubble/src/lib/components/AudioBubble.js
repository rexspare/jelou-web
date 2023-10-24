import has from "lodash/has";
import isEmpty from "lodash/isEmpty";
import toUpper from "lodash/toUpper";
import { useEffect, useRef, useState } from "react";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { v4 as uuid } from "uuid";
import WaveSurfer from "wavesurfer.js";

import Tippy from "@tippyjs/react";
import dayjs from "dayjs";

import { StatusTick } from "@apps/shared/common";
import { CloseIcon, PauseIcon1, PlayIcon } from "@apps/shared/icons";
import BubbleContainer from "./BubbleContainer";
import OptionsMenu from "./OptionsMenu";
import "./bubble.scss";
const bubbleStyle = "px-3.5 pb-2 relative flex flex-col justify-between items-center leading-normal text-left font-light min-w-50 h-auto truncate";

const AudioBubble = (props) => {
    const {
        bubbleSide,
        time,
        status,
        by,
        operatorId,
        botId,
        from,
        isSameSenderIdOfPreviousBubble,
        openOptionsMenu,
        handleSelectChange,
        copyToClipboard,
        setOpen,
        open,
        openNewChat,
        handleReply,
        popperStyles,
        messages,
        attributes,
        supportsReplies,
        dropdownRef,
        t,
        inbox = false,
        createdAt,
        showOptionsMenu,
        type,
    } = props;
    const [playing, setPlaying] = useState(false);
    const [error, setError] = useState(false);
    const [notSupported, setNotSupported] = useState(false);
    const [loading, setLoading] = useState(false);
    const [durationTime, setDurationTime] = useState(0);
    const [containerName] = useState(`waveform-${uuid()}`);
    const [waveformInstance, setWaveformInstance] = useState(null);
    const waveformRef = useRef();
    const operators = useSelector((state) => state.operators);
    const bots = useSelector((state) => state.bots);
    const [downloadAudio, setDownloadAudio] = useState(false);
    function secondsToTimestamp(seconds) {
        seconds = Math.floor(seconds);
        let h = Math.floor(seconds / 3600);
        let m = Math.floor((seconds - h * 3600) / 60);
        let s = seconds - h * 3600 - m * 60;

        m = m < 10 ? "0" + m : m;
        s = s < 10 ? "0" + s : s;
        return m + ":" + s;
    }
    useEffect(() => {
        setLoading(true);
        const { message } = props;
        const waveColor = bubbleSide === "left" ? "rgba(113, 123, 148, 0.25)" : "rgba(0, 179, 199, 0.25)";
        const progressColor = bubbleSide === "left" ? "rgba(113, 123, 148, 1)" : "rgba(0, 179, 199, 1)";

        const waveform = WaveSurfer.create({
            container: waveformRef.current,
            waveColor: waveColor,
            progressColor: progressColor,
            backend: "MediaElement",
            height: 30,
            barRadius: 3,
            responsive: true,
            cursorColor: "transparent",
            hideScrollbar: true,
            barWidth: 3,
            normalize: true,
            cursorWidth: 1,
            barMinHeight: 5,
            barGap: 1,
            barHeight: 1,
            minPxPerSec: 50,
            autoCenter: true,
        });
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

        // Safari does not support .oga
        // Maybe we can make a serverless function to transform audio into mp3
        // And use the load blob function on wavesurfer
        if (isSafari && message.mediaUrl.includes(".oga")) {
            setNotSupported(true);
        }

        setWaveformInstance(waveform);

        if (!isEmpty(message.mediaUrl)) {
            waveform.load(message.mediaUrl);
            waveform.on("error", () => {
                setLoading(false);
                setError(true);
                setDownloadAudio(true);
            });

            waveform.on("ready", () => {
                setLoading(false);
                onReady(waveform);
            });
            waveform.on("finish", stopPlaying);
            waveform.on("seek", stopPlaying);
        }
        return () => {
            waveform.destroy();
        };
    }, []);

    function onReady(waveform) {
        let durationTime = waveform.getDuration();
        durationTime = secondsToTimestamp(durationTime);
        setDurationTime(durationTime);
    }

    function stopPlaying() {
        setPlaying(false);
    }

    function handlePlay() {
        setPlaying(!playing);
        waveformInstance.playPause();
    }

    let names = null;
    if (operatorId) {
        const operator = operators.find((operator) => operator.providerId === operatorId);
        names = operator?.names;
    }

    if (has(from, "name")) {
        names = from.name;
    }

    if (botId) {
        const bot = bots.find((bot) => bot.id === botId);
        names = bot?.name;
    }

    return (
        <BubbleContainer {...props}>
            <div
                className={`relative ${
                    props.bubbleSide === "right"
                        ? bubbleStyle + " rounded-t-lg rounded-bl-lg bg-primary-600 text-gray-400"
                        : bubbleStyle + " rounded-left-bubble rounded-t-lg rounded-br-lg bg-gray-10 text-gray-400"
                }`}
                ref={dropdownRef}
                onMouseOver={props.setHover}
                onMouseLeave={props.setHoverFalse}
            >
                {notSupported ? (
                    <div className="py-3 text-13 text-gray-400 opacity-75 sm:px-2">Audio no soportado.</div>
                ) : (
                    <div className="" onMouseOver={props.setHover} onMouseLeave={props.setHoverFalse}>
                        {!inbox && !isSameSenderIdOfPreviousBubble && !isEmpty(names) && <small className="my-1 mt-2 h-4 text-left text-13 font-bold text-primary-200">{names}</small>}
                        {inbox && !isEmpty(names) && <small className="mb-2 h-4 text-left text-13 font-bold text-primary-200">{names}</small>}

                        {showOptionsMenu && (
                            <OptionsMenu
                                openOptionsMenu={openOptionsMenu}
                                handleSelectChange={handleSelectChange}
                                copyToClipboard={copyToClipboard}
                                open={open}
                                setOpen={setOpen}
                                openNewChat={openNewChat}
                                setOpenOptions={setOpen}
                                openOptions={open}
                                handleReply={handleReply}
                                popperStyles={popperStyles}
                                messages={messages}
                                attributes={attributes}
                                supportsReplies={supportsReplies}
                                by={by}
                                dropdownRef={dropdownRef}
                                bubbleSide={bubbleSide}
                                onHover={props.onHover}
                                type={type}
                            />
                        )}
                        <div className="mobileJustify sm:min-w-2000 relative flex h-16 flex-row items-center mid:min-w-350">
                            {loading ? (
                                <div>
                                    <ClipLoader size={"1.875rem"} color="#00B3C7" />
                                </div>
                            ) : downloadAudio ? (
                                <div className="m-2">
                                    <CloseIcon className={`fill-current ${props.bubbleSide === "left" ? "text-gray-400 " : "text-primary-200"}`} width="1.5625rem" height="1.5625rem" />
                                </div>
                            ) : (
                                <button onClick={handlePlay} className={`playButton relative  flex select-none items-center border-transparent align-middle`}>
                                    {!playing ? (
                                        <PlayIcon className={`fill-current ${props.bubbleSide === "left" ? "text-gray-400 " : "text-primary-200"}`} width="2.625rem" height="2.625rem" />
                                    ) : (
                                        <PauseIcon1 className={`fill-current ${props.bubbleSide === "left" ? "text-gray-400 " : "text-primary-200"}`} width="2.625rem" height="2.625rem" />
                                    )}
                                </button>
                            )}
                            {downloadAudio ? (
                                <div className="m-2 flex w-full max-w-xs flex-col pb-2">
                                    <span className={`text-13 font-semibold ${props.bubbleSide === "left" ? "text-gray-400 " : "text-primary-200"}`}>{t("pma.Descargar audio")}:</span>
                                    <a
                                        className={`truncate text-13 italic underline  ${props.bubbleSide === "left" ? "text-gray-400 " : "text-primary-200"} `}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href={props.message.mediaUrl}
                                    >
                                        {props.message.mediaUrl}
                                    </a>
                                </div>
                            ) : (
                                <div ref={waveformRef} className={`${containerName} wave-surfer mt-5 h-16 w-full flex-1 justify-center pl-2.5`}></div>
                            )}
                        </div>
                        <div className="flex h-1 flex-row items-center justify-between pb-3">
                            {!loading && !error && (
                                <div className={`flex pl-12 text-left text-10 font-medium ${props.bubbleSide === "left" ? "text-gray-400 " : "text-primary-200"}`}>
                                    {!isEmpty(durationTime) ? durationTime : "0:00"}
                                </div>
                            )}
                            <div className="flex h-4 items-center justify-end">
                                <Tippy content={dayjs(createdAt).format(`HH:mm`)} placement={"bottom"} theme="jelou">
                                    <div className={"flex pl-12 text-left text-10 font-medium text-gray-400"}>{time}</div>
                                </Tippy>
                                {toUpper(by) !== "USER" && (
                                    <div className="flex items-center justify-center pl-1">
                                        <StatusTick status={status} color={"text-gray-400"} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </BubbleContainer>
    );
};

export default withTranslation()(AudioBubble);
