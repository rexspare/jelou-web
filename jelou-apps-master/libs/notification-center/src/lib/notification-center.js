import get from "lodash/get";
import isEmpty from "lodash/isEmpty";

import { PlayIconFilling } from "@builder/Icons";
import { Popover, Transition } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/solid";
import dayjs from "dayjs";
import { Fragment, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setCampaignNotSeen } from "@apps/redux/store";
import { useOnClickOutside } from "@apps/shared/hooks";

import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export function NotificationCenter(props) {
    const { setShowCampaigns, campaignNotSeen, showCampaigns, notifications, setShowVideoRelease } = props;
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";
    const notificationButton = useRef();

    const dispatch = useDispatch();

    useOnClickOutside(notificationButton, () => setShowCampaigns(false));

    const selectAnnouncement = (notification, index) => {
        setShowVideoRelease(notification);
        notificationButton.current?.click();
        setShowCampaigns(false);
        if (index === 0) {
            localStorage.setItem("campaignNotSeen", false);
            dispatch(setCampaignNotSeen(false));
            localStorage.setItem("campaignId", get(notification, "id", 0));
        }
    };

    return (
        <Popover className="relative inline-block text-left">
            <div>
                <Popover.Button className="focus-visible:ring-2 inline-flex w-full justify-center rounded-md text-sm font-medium text-white focus:outline-none focus-visible:ring-white focus-visible:ring-opacity-75">
                    <div
                        className={`${showCampaigns ? "bg-gray-400/20 hover:bg-gray-400/20" : "hover:bg-gray-300/30"} relative flex w-full items-center space-x-1 rounded-full p-2 text-left`}
                        onClick={() => {
                            setShowCampaigns(!showCampaigns);
                        }}
                    >
                        <span className="relative inline-block">
                            <BellIcon className="text-gray-400 transition duration-150 ease-in-out" width="2rem" height="2rem" fill="currentColor" />
                            {campaignNotSeen.toString() === "true" && (
                                <span className="absolute right-[0.125rem] top-0 flex h-3 w-3">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
                                </span>
                            )}
                        </span>
                    </div>
                </Popover.Button>
            </div>
            <Transition
                show={showCampaigns}
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Popover.Panel
                    style={{
                        minWidth: "31.5rem",
                    }}
                    className="absolute right-0 z-50 mr-2 mt-1 h-[29.3125rem] w-full scale-100 transform divide-y-1 divide-gray-400/10 overflow-y-auto rounded-[0.375rem] bg-white opacity-100 shadow-menu"
                    ref={notificationButton}
                >
                    {!isEmpty(notifications) ? (
                        notifications.map((notification, index) => (
                            <button
                                key={index}
                                className={`${
                                    campaignNotSeen.toString() === "true" && index === 0 ? "hover:bg-[#E5F7F9 bg-[#E5F7F9]" : "hover:bg-[#E5F7F9]"
                                } flex h-24 w-full items-center space-x-4 px-5 py-2 text-left`}
                                onClick={() => {
                                    selectAnnouncement(notification, index);
                                }}
                            >
                                <div className="flex h-[39px] w-[39px] items-center justify-center rounded-full border-gray-400/10 bg-[#F2FBFC] text-primary-200">
                                    <PlayIconFilling />
                                </div>
                                <div key={index} className="flex flex-1  flex-col leading-[1.3]">
                                    <div className="font-medium">{notification.name}</div>
                                    <div className="text-15">{get(notification, "description", "")}</div>
                                    <div className="mt-2 text-xs text-gray-400">
                                        {dayjs()
                                            .locale(lang || "es")
                                            .to(dayjs(notification.createdAt))}
                                    </div>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center">
                            <div className="flex flex-col items-center justify-center">No existen notificaciones</div>
                        </div>
                    )}
                </Popover.Panel>
            </Transition>
        </Popover>
    );
}
export default NotificationCenter;
