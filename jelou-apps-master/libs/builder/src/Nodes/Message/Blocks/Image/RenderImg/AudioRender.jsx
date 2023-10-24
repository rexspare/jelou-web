import { useEffect, useRef, useState } from "react";

import { PlayIconFilling, PuseIcon, RotateArrow, SingleMP3Icon } from "@builder/Icons";
import { Counter } from "@builder/libs/Audio/counter";

const counter = new Counter();
/**
 * @param {{ link: string, showPlayer: boolean}} props
 */
export const AudioRender = ({ link, showPlayer = true }) => {
    /** @type {React.MutableRefObject<HTMLAudioElement>} */
    const audioRef = useRef(null);

    /** @type {React.MutableRefObject<HTMLInputElement>} */
    const rangeInputRef = useRef(null);

    /** @type {React.MutableRefObject<NodeJS.Timer>} */
    const intervalId = useRef();

    const [isPlay, setIsPlay] = useState(false);
    const [durationTrack, setDurationTrack] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            const duration = audioRef.current?.duration ?? 0;
            if (rangeInputRef.current) {
                rangeInputRef.current.max = String(duration);
                rangeInputRef.current.value = String(audioRef.current?.currentTime ?? 0);
            }
            setDurationTrack(duration);

            if (audioRef.current) {
                audioRef.current.addEventListener("ended", () => {
                    setIsPlay(false);
                    clearInterval(intervalId.current);
                });
            }
        }, 1000);
    }, []);

    const play = () => {
        audioRef.current.play();
        setIsPlay(true);
        intervalId.current = setInterval(() => {
            const currentTime = audioRef.current.currentTime;
            rangeInputRef.current.max = String(audioRef.current.duration);
            rangeInputRef.current.value = String(currentTime);
            setCurrentTime(currentTime + 1);
        }, 1000);
    };

    const pause = () => {
        audioRef.current.pause();
        setIsPlay(false);
        clearInterval(intervalId.current);
    };

    const reInit = () => {
        audioRef.current.currentTime = 0;
        rangeInputRef.current.value = "0";
        setCurrentTime(0);
    };

    /** @type {(evt: React.ChangeEvent<HTMLInputElement>) => void} */
    const handleRangeChange = (evt) => {
        const newTime = Number(evt.target.value);
        audioRef.current.currentTime = newTime;
    };

    const durationLabel = counter.millisecondsToTime(durationTrack * 1000);
    const currentTimeLabel = counter.millisecondsToTime(currentTime * 1000);

    return (
        <div className="flex flex-col items-center justify-center gap-6">
            <SingleMP3Icon />
            <audio controls ref={audioRef} src={link} className="hidden" />

            {showPlayer && (
                <div>
                    <div className="flex items-center gap-4 rounded-xs bg-[#F2FBFC] px-3 py-2 text-primary-200">
                        {isPlay ? (
                            <button onClick={pause}>
                                <PuseIcon />
                            </button>
                        ) : (
                            <button onClick={play}>
                                <PlayIconFilling />
                            </button>
                        )}

                        <div className="h-6 border-r-1 border-[#D1DBE0]" />

                        <input type="range" ref={rangeInputRef} max={100} onChange={handleRangeChange} className="range-sm h-1 w-full cursor-pointer appearance-none rounded-lg bg-gray-200" />
                        <button onClick={reInit}>
                            <RotateArrow />
                        </button>
                    </div>
                    <div className="mt-1 flex justify-between text-10 font-semibold text-gray-400">
                        <p>{currentTimeLabel}</p>
                        <p>{durationLabel}</p>
                    </div>
                </div>
            )}
        </div>
    );
};
