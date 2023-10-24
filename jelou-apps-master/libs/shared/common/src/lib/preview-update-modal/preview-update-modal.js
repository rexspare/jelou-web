import { useState, useRef, useEffect } from "react";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { parseGIF, decompressFrames } from "gifuct-js";
import { useOnClickOutside } from "@apps/shared/hooks";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "@apps/shared/icons";

const PreviewUpdateModal = (props) => {
    const { steps = [], width = "590px", maxWidth = "888px", buttonColor = "primary", showSteps = true, setShowVideoRelease } = props;
    const [orderedSteps, setOrderedSteps] = useState([]);
    const [place, setPlace] = useState(0);
    const [start, setStart] = useState(true);
    const [end, setEnd] = useState(false);
    const scrollContainer = useRef(null);

    const containerRef = useRef(null);
    useOnClickOutside(containerRef, () => setShowVideoRelease(null));

    useEffect(() => {
        if (!isEmpty(steps)) {
            const orderedArray = steps.sort((a, b) => {
                if (a.region > b.region) return -1;
                if (a.region < b.region) return 1;
                return 0;
            });

            steps.forEach((step) => {
                if (step.mediaUrl?.endsWith(".gif") && get(step, "duration", 0) === 0) {
                    fetch(step.mediaUrl)
                        .then((resp) => resp.arrayBuffer())
                        .then((buff) => parseGIF(buff))
                        .then((gif) => {
                            var frames = decompressFrames(gif, true);
                            const totalTime = frames.map((frame) => frame.delay).reduce((a, b) => a + b);
                            orderedArray[step.order - 1] = { ...step, duration: totalTime };
                        });
                } else {
                    orderedArray[step.order - 1] = step;
                }
            });
            setOrderedSteps(orderedArray);
        }
    }, [steps]);

    const scrollRight = (displace = 1) => {
        setVideo(document.getElementById(`video-${count + 1}`));
        setCount(count + 1);
        const { current } = scrollContainer;
        if (current) {
            const scrollWidth = current?.scrollWidth - current.offsetWidth;
            const position = current.scrollLeft;
            const movement = parseInt(width.replace("px", "")) * displace;

            if (position + movement + 10 >= scrollWidth) {
                current.scrollLeft = scrollWidth;
                setEnd(true);
                setStart(false);
            } else {
                current.scrollLeft += movement;
                setStart(false);
            }
            setPlace(place + 1);
        }
    };

    const scrollLeft = (displace = 1) => {
        setVideo(document.getElementById(`video-${count - 1}`));
        setCount(count - 1);
        const { current } = scrollContainer;
        if (current) {
            const position = current.scrollLeft;
            const movement = parseInt(width.replace("px", "")) * displace;

            if (position - movement <= 0) {
                current.scrollLeft = 0;
                setStart(true);
                setEnd(false);
            } else {
                current.scrollLeft -= movement;
                setEnd(false);
            }
            setPlace(place - 1);
        }
    };

    function shiftSteps({ target }) {
        let displace = target.value - place;
        if (displace !== 0) {
            if (displace > 0) {
                scrollRight(Math.abs(displace));
            } else {
                scrollLeft(Math.abs(displace));
            }
            setPlace(Number(target.value));
        }
    }

    const [count, setCount] = useState(0);
    let videos = document.querySelectorAll("video");
    const [video, setVideo] = useState(document.getElementById(`video-${count % videos.length}`));

    useEffect(() => {
        if (videos) {
            setVideo(videos[count % videos.length]);
        }
    }, [videos, count]);

    if (video) {
        video.addEventListener("ended", (event) => {
            scrollRight();
            setCount(count + 1);
            setVideo(document.getElementById(`video-${count % videos.length}`));
        });
    }

    return (
        <div className="z-120">
            <div className="fixed inset-x-0 top-0 z-120 sm:inset-0 sm:flex sm:items-center sm:justify-center">
                <div className="fixed inset-0 transition-opacity">
                    <div className="absolute inset-0 z-120 bg-gray-490/75" />
                </div>
                <div className="flex h-full w-full items-center justify-center">
                    <div className="relative flex w-auto rounded-xl bg-transparent" ref={containerRef}>
                        {orderedSteps?.length > 1 && (
                            <div className={`absolute left-0 top-0 flex h-full items-center ${start ? "hidden" : ""}`}>
                                <button
                                    className={`flex h-14 w-14 items-center justify-center hover:bg-${buttonColor} rounded-full text-white`}
                                    style={{ transform: "translate(-64px, 0px)" }}
                                    onClick={() => {
                                        scrollLeft();
                                    }}
                                >
                                    <ChevronLeftIcon width={20} height={30} className="mr-1 fill-current" />
                                </button>
                            </div>
                        )}
                        <button
                            className="absolute top-0 right-[-2rem] p-2 text-white"
                            onClick={() => {
                                setShowVideoRelease(null);
                            }}
                        >
                            <CloseIcon width={14} height={14} className="fill-current" />
                        </button>
                        <div className="inline-flex overflow-hidden rounded-xl" style={{ width, scrollBehavior: "smooth" }} ref={scrollContainer}>
                            {!isEmpty(orderedSteps) &&
                                orderedSteps.map((step, index) => {
                                    return (
                                        <div key={index} className="flex items-center justify-center rounded-xl" style={{ maxWidth: maxWidth, minWidth: width }} controls loop>
                                            {get(step, "mediaUrl", "").endsWith(".mp4") ? (
                                                <video id={`video-${index}`} className="block h-auto w-full rounded-xl bg-contain" src={get(step, "mediaUrl", "")} muted controls autoPlay></video>
                                            ) : (
                                                <img className="block h-auto w-full rounded-xl bg-contain" src={get(step, "mediaUrl", "")} alt="img announcement new" />
                                            )}
                                        </div>
                                    );
                                })}
                        </div>
                        {orderedSteps?.length > 1 && (
                            <div className={`absolute right-0 top-0 flex h-full items-center ${end ? "hidden" : ""}`}>
                                <button
                                    className={`flex h-14 w-14 items-center justify-center hover:bg-${buttonColor} rounded-full text-white`}
                                    style={{ transform: "translate(64px, 0px)" }}
                                    onClick={() => {
                                        scrollRight();
                                    }}
                                >
                                    <ChevronRightIcon width={20} height={30} className="ml-1 fill-current" />
                                </button>
                            </div>
                        )}
                        {showSteps && (
                            <div className={`absolute bottom-0 flex w-full justify-center`} style={{ transform: "translate(0px, 40px)" }}>
                                {orderedSteps.map((step, index) => (
                                    <button
                                        key={`${index}`}
                                        value={index}
                                        onClick={shiftSteps}
                                        className={`border ml-4 h-4 w-4 rounded-full border-white ${`${index}` === `${place}` ? `bg-white` : "bg-white/50"}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreviewUpdateModal;
