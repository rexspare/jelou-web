import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import get from "lodash/get";
import orderBy from "lodash/orderBy";
import isEmpty from "lodash/isEmpty";
import toLower from "lodash/toLower";

import Stats from "./stats/stats";
import PostTab from "./post-tab/post-tab";
import { mergeById } from "@apps/shared/utils";
import PostTable from "./post-table/post-table";
import { Emitter, JelouApiV1 } from "@apps/shared/modules";
import { MonitoringMassArchivePost2 } from "@apps/monitoring/mass-archive-post2";
import { usePostTable, usePostTotals } from "@apps/shared/hooks";

const LivePosts = (props) => {
    const { teamOptions, teamSelected } = props;
    const { t } = useTranslation();
    const company = useSelector((state) => state.company);
    const queryClient = useQueryClient();

    const [teams, setTeams] = useState({ teams: "" });
    const [postParams, setPostParams] = useState({ page: 1, limit: 10 });
    const [totalsByTeam, setTotalsByTeam] = useState([]);
    const [timesByTeam, setTimesByTeam] = useState([]);
    const [waitTimeByTeam, setWaitTimeByTeam] = useState(0);
    const [inQueueByTeams, setInQueueByTeams] = useState([]);
    const [totalReplies, setTotalReplies] = useState(0);
    const [queueReplies, setQueueReplies] = useState(0);
    const [assignedReplies, setAssignedReplies] = useState(0);
    const [attendedReplies, setAttendedReplies] = useState(0);
    const [facebookFeedReplies, setFacebookFeedReplies] = useState(0);
    const [twitterReplies, setTwitterReplies] = useState(0);
    const [avgFirstReply, setAvgFirstReply] = useState(0);
    const [avgSolutionTime, setAvgSolutionTime] = useState(0);
    const [avgWaitingTime, setAvgWaitingTime] = useState(0);

    const postParamsRef = useRef(postParams);
    postParamsRef.current = postParams;

    const input = useRef(null);

    const { isLoading: isLoadingPostTable, isFetching: isFetchingPostTable, data: postData = [] } = usePostTable(company?.id, postParams);
    const { isLoading: isLoadingPostTotals, isFetching: isFetchingPostTotals, data: postTotals = [] } = usePostTotals(company?.id, teams);

    const [rows, setRows] = useState(10);
    const [maxPage, setMaxPage] = useState(1);
    const [page, setPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);

    const permissions = useSelector((state) => state.permissions);
    const permissionArchivePost = permissions.includes("monitoring:archive_posts");

    const [showModalPosts, setShowModalPosts] = useState(false);

    useEffect(() => {
        if (!isEmpty(postData?.pagination)) {
            setMaxPage(postData?.pagination?.totalPages || 1);
            setTotalResults(postData?.pagination?.total || 0);
        }
    }, [postData]);

    useEffect(() => {
        if (!isEmpty(postTotals)) {
            setTotalsByTeam(postTotals?.repliesTotals?.totalsByTeam);
            setTimesByTeam(postTotals?.repliesAverages?.statsByTeam);
            setWaitTimeByTeam(postTotals?.repliesAverages?.waitTimeByTeam);
            setInQueueByTeams(postTotals?.repliesTotals?.inQueueByTeams);
        }
    }, [postTotals]);

    useEffect(() => {
        if (!isEmpty(totalsByTeam)) {
            let totalsTotals = [];
            let totalsAttended = [];
            let totalsAssigned = [];
            let totalsFacebookFeed = [];
            let totalsTwitterReplies = [];

            let totals, attendeds, assigneds, facebook_feeds, twitter_repliesA;

            totalsByTeam.forEach((object) => {
                let { count, attended, assigned, facebook_feed, twitter_replies } = object;

                totalsTotals.push(count);
                totalsAttended.push(attended);
                totalsAssigned.push(assigned);
                totalsFacebookFeed.push(facebook_feed);
                totalsTwitterReplies.push(twitter_replies);

                totals = totalsTotals.reduce((a, b) => a + b, 0);
                attendeds = totalsAttended.reduce((a, b) => a + b, 0);
                assigneds = totalsAssigned.reduce((a, b) => a + b, 0);
                facebook_feeds = totalsFacebookFeed.reduce((a, b) => a + b, 0);
                twitter_repliesA = totalsTwitterReplies.reduce((a, b) => a + b, 0);
            });
            setTotalReplies(totals);
            setAttendedReplies(attendeds);
            setAssignedReplies(assigneds);
            setFacebookFeedReplies(facebook_feeds);
            setTwitterReplies(twitter_repliesA);
        } else {
            setTotalReplies(0);
            setAttendedReplies(0);
            setAssignedReplies(0);
            setFacebookFeedReplies(0);
            setTwitterReplies(0);
        }
    }, [totalsByTeam]);

    useEffect(() => {
        if (!isEmpty(timesByTeam)) {
            let avgFirstReplyTotals = [];
            let avgSolutionTimeTotal = [];

            let firstReplyAvg, solutionAvg;

            timesByTeam.forEach((object) => {
                let { firstReply, solution } = object;

                avgFirstReplyTotals.push(firstReply);
                avgSolutionTimeTotal.push(solution);

                firstReplyAvg = avgFirstReplyTotals.reduce((a, b) => a + b, 0);
                solutionAvg = avgSolutionTimeTotal.reduce((a, b) => a + b, 0);
            });
            setAvgFirstReply(firstReplyAvg);
            setAvgSolutionTime(solutionAvg);
        } else {
            setAvgFirstReply(0);
            setAvgSolutionTime(0);
        }
    }, [timesByTeam]);

    useEffect(() => {
        if (!isEmpty(waitTimeByTeam)) {
            let avgFirstReplyTotals = [];

            let waitingAvg;

            waitTimeByTeam.forEach((object) => {
                let { waiting } = object;

                avgFirstReplyTotals.push(waiting);

                waitingAvg = avgFirstReplyTotals.reduce((a, b) => a + b, 0);
            });
            setAvgWaitingTime(waitingAvg);
        } else {
            setAvgWaitingTime(0);
        }
    }, [waitTimeByTeam]);

    useEffect(() => {
        if (!isEmpty(inQueueByTeams)) {
            let inQueue = [];

            let inQueueTotal;

            inQueueByTeams.forEach((object) => {
                let { total } = object;

                inQueue.push(total);

                inQueueTotal = inQueue.reduce((a, b) => a + b, 0);
            });
            setQueueReplies(inQueueTotal);
        } else {
            setQueueReplies(0);
        }
    }, [inQueueByTeams]);

    useEffect(() => {
        const teamId = get(teamSelected, "id", "");
        console.log(teamSelected);
        setTeams({ teams: teamId });
        setPostParams({ ...postParams, teams: teamId });
    }, [teamSelected]);

    useEffect(() => {
        setPostParams({ ...postParams, page });
    }, [page]);

    useEffect(() => {
        setPage(1);
        setPostParams({ ...postParams, limit: rows, page: 1 });
    }, [rows]);

    useEffect(() => {
        if (input.current) {
            input.current.state.value = "";
        }
    }, []);

    useEffect(() => {
        Emitter.on("replies-totals-stats", (payload) => {
            console.log("replies-totals-stats", payload);
            updateReplyCards(payload);
        });

        Emitter.on("new_ticket", (payload) => {
            console.log("new_ticket", payload);
            newTicket(payload);
        });

        Emitter.on("update_ticket", (payload) => {
            console.log("update_ticket", payload);
            updateTicket(payload);
        });

        // Emitter.on("reply-new", (payload) => {
        //     console.log("reply-new", payload);
        //     newPost(payload);
        // });

        Emitter.on("reply-update", (payload) => {
            console.log("reply-update", payload);
            updatePost(payload);
        });
        return () => {
            Emitter.off("replies-totals-stats");
            Emitter.off("new_ticket");
            Emitter.off("update_ticket");
            Emitter.off("reply-new");
            Emitter.off("reply-update");
        };
    }, []);

    const updateReplyCards = (payload) => {
        const { repliesAverages, repliesTotals } = payload;
        try {
            queryClient.setQueriesData(["getPostsTotals"], (oldPostTotals) => {
                return { ...oldPostTotals, repliesTotals, repliesAverages };
            });
        } catch (err) {
            console.log("err", err);
        }
    };

    const newTicket = (payload) => {
        const eventId = get(payload, "_id", "");
        const inQueueTab = get(postParamsRef, "current.status", "") === "in_queue";
        if (!inQueueTab) return;
        try {
            JelouApiV1.get(`real-time-events/${eventId}`).then(({ data }) => {
                const newTicket = get(data, "data.payload", {});
                const ticketType = get(newTicket, "type", "");
                if (ticketType !== "reply") return;
                if (!isEmpty(teamSelected)) {
                    const teamId = get(teamSelected, "id", "");
                    if (teamId !== get(newTicket, "team.id", "")) return;
                }
                queryClient.setQueriesData(["getPostTable"], (oldPosts) => {
                    const mergeResults = mergeById(oldPosts.results, newTicket, "_id");
                    return {
                        ...oldPosts,
                        pagination: { ...oldPosts.pagination, total: oldPosts.pagination.total + 1 },
                        results: mergeResults,
                    };
                });
            });
        } catch (error) {
            console.log("error", error);
        }
    };

    const updateTicket = (payload) => {
        const eventId = get(payload, "_id", "");
        const inQueueTab = get(postParamsRef, "current.status", "") === "in_queue";
        if (!inQueueTab) return;
        try {
            JelouApiV1.get(`real-time-events/${eventId}`).then(({ data }) => {
                const updateTicket = get(data, "data.payload", {});
                const ticketState = toLower(get(updateTicket, "state", ""));
                const status = toLower(get(postParamsRef, "current.status", ""));

                if (!isEmpty(teamSelected)) {
                    const teamId = get(teamSelected, "id", "");
                    if (teamId !== get(updateTicket, "team.id", "")) return;
                }
                if (ticketState !== status) {
                    queryClient.setQueriesData(["getPostTable"], (oldPosts) => {
                        const results = get(oldPosts, "results", []);
                        const _results = results.filter((post) => get(post, "_id") !== get(updateTicket, "_id"));
                        return { ...oldPosts, pagination: { ...oldPosts.pagination, total: oldPosts.pagination.total + 1 + 1 }, results: _results };
                    });
                } else {
                    queryClient.setQueriesData(["getPostTable"], (oldPosts) => {
                        const results = get(oldPosts, "results", []);
                        const _results = results.filter((post) => get(post, "_id") !== get(updateTicket, "_id"));
                        return {
                            ...oldPosts,
                            pagination: { ...oldPosts.pagination, total: oldPosts.pagination.total + 1 + 1 },
                            results: [..._results, updateTicket],
                        };
                    });
                }
            });
        } catch (error) {
            console.log("error", error);
        }
    };

    // const newPost = (payload) => {
    //     const eventId = get(payload, "_id", "");
    //     const inQueueTab = get(postParamsRef, "current.status", "") === "in_queue";
    //     if (inQueueTab) return;
    //     try {
    //         JelouApiV1.get(`real-time-events/${eventId}`).then(({ data }) => {
    //             console.log(data, "data");
    //             const newPost = get(data, "data.payload", {});
    //             const replyState = toLower(get(newPost, "state", get(newPost, "status", "")));
    //             const botType = toLower(get(newPost, "bot.type", ""));
    //             const {
    //                 current: { channel, status },
    //             } = postParamsRef;

    //             if (!isEmpty(teamSelected)) {
    //                 const teamId = get(teamSelected, "id", "");
    //                 if (teamId !== get(newPost, "team.id", "")) return;
    //             }

    //             if (isEmpty(channel) && isEmpty(status)) {
    //                 queryClient.setQueriesData(["getPostTable"], (oldPosts) => {
    //                     const _results = [newPost, ...oldPosts.results];

    //                     return { ...oldPosts, pagination: { ...oldPosts.pagination, total: oldPosts.pagination.total + 1 }, results: _results };
    //                 });
    //             }

    //             if (toLower(botType) === toLower(channel)) {
    //                 queryClient.setQueriesData(["getPostTable"], (oldPosts) => {
    //                     const _results = [newPost, ...oldPosts.results];
    //                     return {
    //                         ...oldPosts,
    //                         pagination: { ...oldPosts.pagination, total: oldPosts.pagination.total + 1 },
    //                         results: _results,
    //                     };
    //                 });
    //             }

    //             if (replyState === status) {
    //                 queryClient.setQueriesData(["getPostTable"], (oldPosts) => {
    //                     const _results = [newPost, ...oldPosts.results];
    //                     return {
    //                         ...oldPosts,
    //                         pagination: { ...oldPosts.pagination, total: oldPosts.pagination.total + 1 },
    //                         results: _results,
    //                     };
    //                 });
    //             }
    //         });
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    const updatePost = (payload) => {
        const eventId = get(payload, "_id", "");
        const inQueueTab = get(postParamsRef, "current.status", "") === "in_queue";
        if (inQueueTab) return;
        try {
            JelouApiV1.get(`real-time-events/${eventId}`).then(({ data }) => {
                const updateReply = get(data, "data.payload", {});
                const replyState = toLower(get(updateReply, "status", ""));
                // const botType = toLower(get(updateTicket, "bot.type", ""));
                // const channel = toLower(get(postParamsRef, "current.channel", ""));

                if (!isEmpty(teamSelected)) {
                    const teamId = get(teamSelected, "id", "");
                    if (teamId !== get(updateReply, "team.id", "")) return;
                }

                // if (replyState === "created") return;

                if (replyState !== "in_queue") {
                    queryClient.setQueriesData(["getPostTable"], (oldPosts) => {
                        const mergeResults = mergeById(oldPosts.results, updateReply, "_id");
                        return {
                            ...oldPosts,
                            pagination: { ...oldPosts.pagination, total: oldPosts.pagination.total + 1 },
                            results: mergeResults,
                        };
                    });
                }

                // if (isEmpty(channel)) {
                //     queryClient.setQueriesData(["getPostTable"], (oldPosts) => {
                //         const results = get(oldPosts, "results", []);
                //         const update = (post) => {
                //             return get(post, "_id") === get(updateTicket, "_id") ? { ...post, ...updateTicket } : post;
                //         };
                //         const _results = results.map(update);
                //         return { ...oldPosts, pagination: { ...oldPosts.pagination, total: oldPosts.pagination.total + 1 }, results: _results };
                //     });
                //     return;
                // }

                // if (toLower(botType) === toLower(channel)) {
                //     queryClient.setQueriesData(["getPostTable"], (oldPosts) => {
                //         const results = get(oldPosts, "results", []);
                //         const update = (post) => {
                //             return get(post, "_id") === get(updateTicket, "_id") ? { ...post, ...updateTicket } : post;
                //         };
                //         const _results = results.map(update);
                //         return { ...oldPosts, pagination: { ...oldPosts.pagination, total: oldPosts.pagination.total + 1 }, results: _results };
                //     });
                //     return;
                // }

                // else {
                //     queryClient.setQueriesData(["getPostTable"], (oldPosts) => {
                //         const results = get(oldPosts, "results", []);

                //         // if updateTicket is not inside oldPosts
                //         const updateTicketInOldPost = results.some((post) => get(post, "_id") === get(updateTicket, "_id"));
                //         if (!updateTicketInOldPost) {
                //             const mergeResults = [updateTicket, ...oldPosts.results];
                //             return {
                //                 ...oldPosts,
                //                 pagination: { ...oldPosts.pagination, total: oldPosts.pagination.total + 1 },
                //                 results: mergeResults,
                //             };
                //         }

                //         const _results = updateById(results, updateTicket, "roomdId");
                //         return { ...oldPosts, pagination: { ...oldPosts.pagination, total: oldPosts.pagination.total + 1 }, results: _results };
                //     });
                // }
            });
        } catch (error) {
            console.log(error);
        }
    };

    const modalArchivePost = () => {
        setShowModalPosts(true);
    };

    return (
        <div className="flex flex-col">
            <Stats
                loading={isLoadingPostTotals || isFetchingPostTotals}
                postTotals={postTotals}
                teamSelected={teamSelected}
                totalReplies={totalReplies}
                assignedReplies={assignedReplies}
                attendedReplies={attendedReplies}
                avgFirstReply={avgFirstReply}
                avgSolutionTime={avgSolutionTime}
                avgWaitingTime={avgWaitingTime}
            />
            <div className="mb-4 w-full overflow-hidden rounded-1 bg-white shadow-card">
                <div className="flex items-center justify-between px-6 py-4">
                    <p className="text-xl font-bold text-gray-400">{t("monitoring.Comentarios")}</p>
                </div>
                <PostTab
                    totalReplies={totalReplies}
                    facebookFeedReplies={facebookFeedReplies}
                    twitterReplies={twitterReplies}
                    setPostParams={setPostParams}
                    postParams={postParams}
                    teamSelected={teamSelected}
                    queueReplies={queueReplies}
                    permissionArchivePost={permissionArchivePost}
                    modalArchivePost={modalArchivePost}
                />
                {/* {toLower(postParams?.status) === "in_queue" && (
                    <div className="flex space-x-2 pl-5">
                        <div className="relative flex h-full w-70 rounded-[0.8125rem] border-[0.0938rem] border-transparent">
                            <div className="absolute bottom-0 left-0 top-0 ml-4 flex items-center">
                                <SearchIcon className="fill-current" width="1rem" height="1rem" />
                            </div>
                            <DebounceInput
                                type="search"
                                ref={input}
                                value={postParams?.id}
                                className="w-full rounded-[0.8125rem] border-[0.0938rem] border-gray-100/50 py-1 pl-10 text-sm text-gray-500 focus:border-gray-100 focus:ring-transparent"
                                placeholder={t("plugins.Buscar")}
                                minLength={2}
                                debounceTimeout={500}
                                onChange={handleSearchId}
                                autoFocus
                            />
                        </div>

                        <div className="relative flex w-60">
                            <ComboboxSelect
                                options={publicBots}
                                value={postParams?.bot}
                                label={t("sideBar.bots")}
                                handleChange={handleBot}
                                icon={<BotIcon width="1.3125rem" fillOpacity="0.75" height="1rem" />}
                                name={"razon"}
                                clearFilter={() => handleBot([])}
                            />
                        </div>
                    </div>
                )} */}
                <PostTable
                    data={orderBy(postData?.results, ["createdAt"], ["desc"])}
                    pagination={postData?.pagination}
                    isLoadingPostTable={isLoadingPostTable || isFetchingPostTable}
                    page={page}
                    setPage={setPage}
                    totalResults={totalResults}
                    rows={rows}
                    setRows={setRows}
                    maxPage={maxPage}
                    teamOptions={teamOptions}
                    postParams={postParams}
                />
            </div>
            <MonitoringMassArchivePost2 showModalPosts={showModalPosts} setShowModalPosts={setShowModalPosts} />
        </div>
    );
};

export default LivePosts;
