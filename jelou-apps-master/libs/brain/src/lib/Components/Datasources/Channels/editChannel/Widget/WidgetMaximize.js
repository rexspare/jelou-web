import { CloseIcon, FileIcon1, ImageIcon1, LocationIcon, MicIcon, MoreIcon1, SendIconWidget } from "@apps/shared/icons";
import { validateColorChromePicker } from "@apps/shared/utils";
import { Transition } from "@headlessui/react";
import { get } from "lodash";
import { useState } from "react";
import TextareaAutosize from "react-autosize-textarea";

function WidgetMaximize(props) {
    const { widgetProperties } = props;

    const [viewMoreOptions, setViewMoreOptions] = useState(false);

    const { vars } = get(widgetProperties, "theme", {});
    const headerPanel = get(widgetProperties, "headerPanel", {});

    const onClick = () => {
        setViewMoreOptions(!viewMoreOptions);
    };

    return (
        <div className={`z-100 flex h-[60vh] w-[22vw] flex-col overflow-hidden rounded-xl bg-white shadow-lg`}>
            <div
                className={`relative z-10 flex p-3`}
                style={{
                    borderBottomColor: vars?.color.grey[0],
                    color: validateColorChromePicker(headerPanel?.color || ""),
                    background: !headerPanel?.gradient
                    ? validateColorChromePicker(headerPanel?.background || "#00B3C7")
                    : `linear-gradient(291.44deg,${validateColorChromePicker(vars?.color?.primary || "#40c6d5")} 0%, ${validateColorChromePicker(vars?.color?.primary || "#40c6d5")} 35.45%, ${validateColorChromePicker(vars?.color?.secondary || "#00B3C7")})`,
                }}>
                <img
                    alt="widget logo"
                    src={headerPanel?.logo?.url}
                    style={{ backgroundColor: "transparent", borderRadius: 12, width: 100, height: 100 }}
                />
                <div className="flex flex-1 flex-col p-2">
                    <span>{headerPanel?.title?.text}</span>
                    <span
                        className="text-13"
                        style={{
                            color: validateColorChromePicker(headerPanel?.message?.descriptionTextColor || ""),
                        }}>
                        {headerPanel?.message?.description}
                    </span>
                </div>
                <button className="absolute top-2 right-2">
                    <CloseIcon />
                </button>
            </div>
            <div className="relative flex flex-1" style={{ background: validateColorChromePicker(headerPanel?.background || "") }}>
                <div
                    className={`flex flex-1 flex-col gap-y-2 overflow-y-scroll bg-white px-5 pt-7 pb-10 ${
                        widgetProperties?.bodyPanel?.topBorder === "ROUND" && "rounded-t-xl"
                    }`}>
                    {!widgetProperties?.homeMenu?.showHomeMenuOnEmptyRoom && !widgetProperties?.homeMenu?.showHomeMenuOnEmptyMessages && (
                        <>
                            <div className="w-4/5 rounded-10 rounded-tl-none bg-primary-700 p-4 pr-8">
                                <span className="text-sm font-bold" style={{ color: validateColorChromePicker(vars?.color?.grey[2] || "") }}>
                                    {widgetProperties?.homeMenu?.homeMenuTitle}
                                </span>
                            </div>
                            {widgetProperties &&
                                widgetProperties?.homeMenu?.options.map((f, index) => (
                                    <div key={index} className="w-4/5 rounded-10 border-1 border-primary-200 px-4 py-2">
                                        <span className={`text-sm font-bold`} style={{ color: validateColorChromePicker(vars?.color?.grey[3] || "") }}>
                                            {f.title}
                                        </span>
                                    </div>
                                ))}
                            <div
                                className={`self-end rounded-10 rounded-br-none px-4 py-2`}
                                style={{ backgroundColor: validateColorChromePicker(vars?.color?.userBubble || "") }}>
                                <span className={`text-sm font-bold`} style={{ color: validateColorChromePicker(vars?.color?.userText || "") }}>
                                    {widgetProperties?.homeMenu?.options[0]?.title}
                                </span>
                            </div>
                        </>
                    )}
                </div>
                <Transition
                    show={viewMoreOptions}
                    enter="transition ease duration-700 transform"
                    enterFrom="opacity-0 -translate-y-full"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease duration-1000 transform"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 -translate-y-full"
                    className="z-5 absolute top-0 left-0 flex h-full min-w-full flex-1">
                    <div
                        className="z-5 absolute top-0 left-0 flex h-full min-w-full flex-1"
                        style={{ background: validateColorChromePicker(vars?.color?.grey[2] || ""), opacity: 0.5 }}></div>
                </Transition>
                <div className="absolute top-0 left-0 z-10 flex h-full min-w-full flex-1 flex-col justify-end">
                    <Transition
                        show={viewMoreOptions}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95">
                        <div className="flex w-full flex-col rounded-t-xl bg-white">
                            <div className="flex w-full flex-row gap-x-6 px-6 py-3">
                                <ImageIcon1 width="17" height="17" fill={validateColorChromePicker(vars?.color?.grey[2] || "")} />
                                <span className="text-sm font-normal" style={{ color: validateColorChromePicker(vars?.color?.grey[2] || "") }}>
                                    Image or video
                                </span>
                            </div>
                            <div className="flex w-full flex-row gap-x-6 px-6 py-2">
                                <FileIcon1 width="17" height="17" fill={validateColorChromePicker(vars?.color?.grey[2] || "")} />
                                <span className="text-sm font-normal" style={{ color: validateColorChromePicker(vars?.color?.grey[2] || "") }}>
                                    File
                                </span>
                            </div>
                            <div className="flex w-full flex-row gap-x-6 px-6 py-2">
                                <LocationIcon width="17" height="17" fill={validateColorChromePicker(vars?.color?.grey[2] || "")} />
                                <span className="text-sm font-normal" style={{ color: validateColorChromePicker(vars?.color?.grey[2] || "") }}>
                                    Location
                                </span>
                            </div>
                        </div>
                    </Transition>

                    <div
                        className={`flex w-full items-center  border-t-1 border-[${validateColorChromePicker(vars?.color?.grey[3] || "")}] bg-white px-3 py-2`}>
                        <button onClick={onClick}>
                            <MoreIcon1
                                className={`m-2 fill-current text-[${validateColorChromePicker(vars?.color?.primaryDarker || "")}]`}
                                fill={validateColorChromePicker(vars?.color?.primaryDarker || "")}
                                width="1.125rem"
                                height="1.125rem"
                            />
                        </button>
                        <div className="my-auto flex w-full flex-row items-center">
                            <TextareaAutosize
                                style={{
                                    backgroundColor: validateColorChromePicker(vars?.color.grey[0] || ""),
                                    color: validateColorChromePicker(vars?.color.grey[1] || ""),
                                }}
                                className="w-full resize-none overflow-y-auto rounded-12 border-transparent align-middle text-xs font-medium leading-normal text-gray-400 placeholder:text-gray-400 placeholder:text-opacity-65 focus:border-transparent focus:ring-transparent md:text-15"
                                maxRows={5}
                                placeholder={"Escribe un mensaje"}
                            />
                        </div>
                        <MicIcon
                            className={`m-2 fill-current text-[${validateColorChromePicker(vars?.color?.primaryDarker || "")}]`}
                            fill={validateColorChromePicker(vars?.color?.primaryDarker || "")}
                            width="0.875rem"
                            height="1.25rem"
                        />
                        <SendIconWidget className="fill-current text-gray-610" fill="#374361" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WidgetMaximize;
