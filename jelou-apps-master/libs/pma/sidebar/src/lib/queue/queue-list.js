import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { useTranslation } from "react-i18next";
import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";

import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import includes from "lodash/includes";

const Queue = ({ queue, setQueue, takeQueue, rooms, queueThreshold, isOpenMenu, taking, teams, queues, hasQueuesByTeam, section, handleClick }) => {
    const { t } = useTranslation();
    const [currentQueueTickets, setCurrentQueueTickets] = useState([]);
    const storageKey = `${section}:last_queue_name`;

    const _queues = ["General", ...teams.map((team) => team.name)];

    const company = useSelector((state) => state.company);

    const avoidManualQueueTakeChats = get(company, "properties.operatorView.chats.avoidManualQueueTake", false);
    const avoidManualQueueTakeReplies = get(company, "properties.operatorView.posts.avoidManualQueueTake", false);

    useEffect(() => {
        const isImpersonate = !isEmpty(localStorage.getItem("jwt-master"));
        let lastQueueName = null;
        if (!isImpersonate) {
            lastQueueName = sessionStorage.getItem(storageKey);
        }
        if (lastQueueName !== null) {
            setQueue(lastQueueName);
        } else {
            setQueue("General");
        }
    }, []);

    useEffect(() => {
        if (teams.length > 0) {
            const lastQueueName = sessionStorage.getItem(storageKey);
            if (!includes(_queues, lastQueueName)) {
                sessionStorage.removeItem(storageKey);
            }
        }
    }, [teams]);

    useEffect(() => {
        if (queue) {
            sessionStorage.setItem(storageKey, queue);
        }
    }, [queue]);

    useEffect(() => {
        const name = queue === "General" ? "default" : queue;
        setCurrentQueueTickets(queues.filter((queue) => queue.queue === name));
    }, [queue, queues]);

    function getTotal(name) {
        const total = queues.filter((queue) => queue.queue === name);
        return total.length;
    }

    function renderOnChats() {
        return section === "chats" && !avoidManualQueueTakeChats;
    }

    function renderOnPosts() {
        return section === "posts" && !avoidManualQueueTakeReplies;
    }

    return (
        <Menu as="div" className="w-full">
            {({ open }) => (
                <>
                    <div className="flex w-full items-center justify-between">
                        <Menu.Button onClick={handleClick} className={"flex flex-row items-start space-x-2 md:flex-col mid:space-x-0"} disabled={!hasQueuesByTeam}>
                            <div className="mb-px flex items-center">
                                {hasQueuesByTeam && (
                                    <svg viewBox="0 0 8 6" className={`mr-2 h-3 w-3 text-primary-200 transition-all ${!isOpenMenu ? "-rotate-90" : ""} `}>
                                        <path
                                            d="M1.15138 1.90341C1.9784 2.92128 2.79835 3.93208 3.62537 4.94995C3.79501 5.15494 4.20499 5.15494 4.37463 4.94995C5.20165 3.93208 6.0216 2.92128 6.84862 1.90341C7.0324 1.68429 7.06774 1.37327 6.84862 1.15415C6.66484 0.970368 6.28314 0.927957 6.09936 1.15415C5.27234 2.17202 4.45239 3.18282 3.62537 4.20069C3.87277 4.20069 4.12723 4.20069 4.37463 4.20069C3.54761 3.18282 2.72059 2.17202 1.90064 1.15415C1.71686 0.935025 1.33516 0.963299 1.15138 1.15415C0.932255 1.37327 0.967598 1.68429 1.15138 1.90341Z"
                                            fill="#00B3C7"
                                            stroke="#00B3C7"
                                            strokeWidth="0.5"
                                        />
                                    </svg>
                                )}

                                <span className="block text-left text-sm font-medium text-primary-200">{queue}</span>
                            </div>
                            <div className={`flex items-center font-bold leading-none text-[#007380] ${hasQueuesByTeam && "pl-4"}`}>
                                <span className="mr-1 text-2xl">{currentQueueTickets.length}</span>
                                <span className="text-sm font-medium leading-5 sm:text-base">{t("pma.esperando")}</span>
                            </div>
                        </Menu.Button>
                        <div>
                            {currentQueueTickets.length > 0 && rooms.length < queueThreshold && (renderOnChats() || renderOnPosts()) && (
                                <button
                                    disabled={taking}
                                    onClick={() => takeQueue(queue !== "General" ? queue : null)}
                                    className="flex h-8 items-center justify-center rounded-full border-transparent bg-primary-200 px-3 text-sm font-medium text-white outline-none hover:bg-primary-100 focus:outline-none sm:text-base"
                                >
                                    {taking ? <ClipLoader size={"1rem"} color="#ffffff" /> : <span className="text-">{t("pma.Atender")}</span>}
                                </button>
                            )}
                        </div>
                    </div>
                    <Transition
                        as={Fragment}
                        show={isOpenMenu}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items static className="absolute left-0 z-60 mt-2 max-h-s w-full origin-top-right overflow-y-auto rounded-b-xl bg-white shadow-sm focus:outline-none">
                            {_queues.map((queueName, index) => (
                                <Menu.Item key={index}>
                                    <button
                                        onClick={() => {
                                            setQueue(queueName);
                                            handleClick();
                                        }}
                                        className={`w-full justify-between ${
                                            queueName !== queue ? "text-[#959daf]" : "text-primary-200"
                                        }  flex items-center border-b-[0.0625rem] border-[#e8ecf3] py-4 px-4 text-lg font-medium hover:bg-primary-600`}
                                    >
                                        {queueName}
                                        <span className="text-primary-200">{getTotal(queueName === "General" ? "default" : queueName)}</span>
                                    </button>
                                </Menu.Item>
                            ))}
                        </Menu.Items>
                    </Transition>
                </>
            )}
        </Menu>
    );
};

export default Queue;
