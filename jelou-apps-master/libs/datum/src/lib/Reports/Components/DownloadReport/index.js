import merge from "lodash/merge";
import sortBy from "lodash/sortBy";
import get from "lodash/get";
import reverse from "lodash/reverse";
import isEmpty from "lodash/isEmpty";
import { useTranslation } from "react-i18next";
import BeatLoader from "react-spinners/BeatLoader";
import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import { ChatManagerContext } from "@apps/pma/context";

import { DashboardServer } from "@apps/shared/modules";
/* Components */
import DownloadItem from "./DownloadItem";

const Downloads = () => {
    const [history, setHistory] = useState([]);
    const [clearing, setClearing] = useState(false);
    const { t } = useTranslation();
    const userSession = useSelector((state) => state.userSession);
    const abortController = new AbortController();
    const { id: userId, companyId, providerId } = userSession;
    const isOperator = get(userSession, "isOperator", false);
    const { pusherGlobalInstance } = useContext(ChatManagerContext);
    let pusher = null;
    useEffect(() => {
        if (providerId) {
            if (pusherGlobalInstance) {
                pusher = pusherGlobalInstance;
                pusher.subscribe(`socket-${userSession.providerId}`);
            }

            if (pusher) {
                pusher.bind("download-updated", function (data) {
                    setHistory((downloads) => {
                        const parsedDownloads = downloads.map((download) => {
                            if (download.id === data.id) {
                                return merge(download, data);
                            }

                            return download;
                        });
                        return parsedDownloads;
                    });
                });

                pusher.bind("download-created", function (data) {
                    setHistory((downloads) => [...downloads, data]);
                });
            }
            return () => {
                if (pusher && !isOperator) {
                    pusher.unsubscribe(`socket-${userSession.providerId}`);
                }
            };
        }
    }, [providerId, pusherGlobalInstance]);

    const getHistory = async () => {
        try {
            const { data } = await DashboardServer.get(`companies/${companyId}/reports/history/${userId}`, {
                signal: abortController.signal,
                params: {
                    display: true,
                },
            });

            setHistory(data.reports);
            Promise.resolve(true);
        } catch (error) {
            Promise.resolve(false);
        }
    };

    useEffect(() => {
        getHistory();
        return () => abortController.abort(); // Cleanup function that cancel API calll when this component is dismounted.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const clearAll = async () => {
        try {
            setClearing(true);
            const requests = history.filter((download) => download.status !== "IN_PROGRESS").map((download) => download.id);

            if (isEmpty(requests)) {
                setClearing(false);
                return;
            }

            await DashboardServer.post(`/companies/${companyId}/reports/history/bulk-update`, {
                requests,
            });

            await getHistory();
        } finally {
            setClearing(false);
        }
    };

    return (
        <Menu as="div" className="relative flex h-full items-center justify-center">
            <Menu.Button className="button-gradient-xl flex h-full w-44 items-center justify-center whitespace-nowrap pl-3 text-base font-normal text-white">
                <svg className="mr-1 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                </svg>
                {`${history?.length} ${history?.length === 1 ? (
                    t("common.singularDownload")
                    ) : (
                        t("common.downloads")
                    )}`
                }
                <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </Menu.Button>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95">
                <Menu.Items className="absolute right-0 top-0 z-20 mt-14 flex max-h-xl w-78 scale-100 transform flex-col rounded-1 bg-white pt-6 opacity-100 shadow-dropdown focus:outline-none">
                    <div className="h-full overflow-y-auto">
                        {reverse(sortBy(history, "createdAt")).map((download, i) => (
                            <DownloadItem download={download} key={i} />
                        ))}
                    </div>

                    <div className="flex justify-end px-6 py-4">
                        {clearing ? (
                            <button className="flex items-center rounded-full bg-primary-200 px-4 py-1 text-base font-bold text-white">
                                <BeatLoader color="white" size={10} />
                            </button>
                        ) : (
                            <button
                                onClick={clearAll}
                                className="flex items-center rounded-full bg-primary-200 px-4 py-1 text-base font-bold text-white">
                                {t("common.cleanAll")}
                            </button>
                        )}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
};

export default Downloads;
