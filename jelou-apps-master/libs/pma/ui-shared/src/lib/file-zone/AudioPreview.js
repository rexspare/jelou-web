import { CloseIcon, PauseIcon1, PlayIcon } from "@apps/shared/icons";
import { useEffect, useRef, useState } from "react";
import { ClipLoader } from "react-spinners";
import { useSelector } from "react-redux";
import get from "lodash/get";
import last from "lodash/last";
import { v4 as uuidv4 } from "uuid";
import WaveSurfer from "wavesurfer.js";
import RenderMessage from "../render-message/render-message";
import { MESSAGE_TYPES } from "@apps/shared/constants";
import { useUploadFile } from "@apps/shared/hooks";

const AudioPreview = (props) => {
    const { audio, t, currentRoom, setAudioBlobs, audioBlobs, audiosUrl, setAudiosUrl, setSendingAudio, uploadFile } = props;
    const [loading, setLoading] = useState(true);
    const [playing, setPlaying] = useState(false);
    const [audioUrl, setAudioUrl] = useState("");
    const { audioFile, path } = audio;
    const userSession = useSelector((state) => state.userSession);
    const companyId = get(userSession, "companyId", "");

    const handleUploadAudio = async () => {
        setLoading(true);
        const UUID = uuidv4();
        const fileName = last(path.split("/"));
        const formattedPath = `dropzone-${companyId}/audio/${UUID}-${fileName}`;
        const urlFile = await uploadFile(audioFile, formattedPath);
        setAudioUrl(urlFile);
        setAudiosUrl([...audiosUrl, urlFile]);
    };
    const { deleteFile } = useUploadFile();

    const handleDeleteAudio = ({ mediaUrl = null, link, currentRoom } = {}) => {
        if (!mediaUrl) {
            RenderMessage(t("pma.deleteFile"), MESSAGE_TYPES.ERROR);
            console.log("Error eliminando archivo", { mediaUrl });
            return;
        }

        setLoading(true);

        deleteFile({ mediaUrl, currentRoom })
            .then((messageRes) => {
                deleteAudio(mediaUrl);
                RenderMessage(t("common.Archivo eliminado correctamente"), MESSAGE_TYPES.SUCCESS);
            })
            .catch((err) => {
                console.log("Error eliminando archivo", { err });
                RenderMessage(t("pma.errors.deleteFile"), MESSAGE_TYPES.ERROR);
            })
            .finally(() => setLoading(false));
    };
    const deleteAudio = (mediaUrl) => {
        const filteredAudios = audioBlobs.filter((audioPreview) => audioPreview.id !== audio.id);
        setAudioBlobs(filteredAudios);
        const filteredUrls = audiosUrl.filter((url) => url !== mediaUrl);
        setAudiosUrl(filteredUrls);
    };

    useEffect(() => {
        handleUploadAudio();
    }, []);

    const [waveformInstance, setWaveformInstance] = useState(null);
    const [durationTime, setDurationTime] = useState(0);

    const [containerName] = useState(`waveform-${uuidv4()}`);
    const waveColor = "rgba(0, 179, 199, 0.25)";
    const progressColor = "rgba(0, 179, 199, 1)";
    const waveformRef = useRef();

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
        if (audioUrl) {
            const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

            // Safari does not support .oga
            // Maybe we can make a serverless function to transform audio into mp3
            // And use the load blob function on wavesurfer
            if (isSafari && audioUrl.includes(".oga")) {
                // setNotSupported(true);
            }
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
            setWaveformInstance(waveform);

            waveform.load(audioUrl);
            waveform.on("error", () => {
                setLoading(false);
                // setError(true);
                // setDownloadAudio(true);
            });

            waveform.on("ready", () => {
                setLoading(false);
                onReady(waveform);
            });
            waveform.on("finish", stopPlaying);
            waveform.on("seek", stopPlaying);
            return () => {
                waveform.destroy();
            };
        }
    }, [audioUrl]);
    function handlePlay() {
        setPlaying(!playing);
        waveformInstance.playPause();
    }
    function stopPlaying() {
        setPlaying(false);
    }
    function onReady(waveform) {
        let durationTime = waveform.getDuration();
        durationTime = secondsToTimestamp(durationTime);
        setDurationTime(durationTime);
    }
    return (
        <div className="mobileJustify relative flex h-14 w-[10rem] flex-row items-center  justify-center rounded-md border-0.5 border-teal-200 bg-primary-600 px-2">
            <button
                disabled={loading}
                onClick={() => {
                    handleDeleteAudio({ mediaUrl: audioUrl, currentRoom });
                }}
                className={` group absolute right-[-6px] top-[-6px] z-120 flex items-center  rounded-full ${loading ? "bg-white" : "bg-white hover:bg-primary-200"} p-1 hover:cursor-pointer `}
            >
                {loading ? <ClipLoader className={""} size={10} color={"#999"} /> : <CloseIcon className={`h-2 w-2 fill-current text-primary-200 group-hover:text-white`} width="100%" height="100%" />}
            </button>

            <button
                disabled={loading}
                onClick={handlePlay}
                className={`playButton group relative flex select-none items-center border-transparent align-middle text-primary-200 disabled:text-gray-300`}
            >
                {!playing ? <PlayIcon className={`fill-current text-inherit `} width="2rem" height="2rem" /> : <PauseIcon1 className={`fill-current text-primary-200`} width="2rem" height="2rem" />}
            </button>

            <div ref={waveformRef} className={`${containerName} wave my-auto w-full flex-1 items-center ${loading ? "flex" : ""}  justify-center pl-2.5`}>
                {loading && <img className="" src={"assets/illustrations/Waves-placeholder.svg"} alt={"waveform"} />}
            </div>
            <span className="pl-[2px] text-11 font-semibold text-gray-500">{loading ? "00:00" : durationTime !== 0 && durationTime}</span>
        </div>
    );
};

export default AudioPreview;
