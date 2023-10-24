import { Modal } from "@apps/shared/common";
import { CloseIcon, PlusIcon, ScheduleIcon, SearchIcon } from "@apps/shared/icons";
import { DashboardServer } from "@apps/shared/modules";
import Tippy from "@tippyjs/react";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import pick from "lodash/pick";
import React, { useEffect, useRef, useState } from "react";
import { DebounceInput } from "react-debounce-input";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { BeatLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import timezones from "timezones-list";
import { v4 as uuid } from "uuid";

import { Transition } from "@headlessui/react";
import ActionsModal from "./Common/ActionsModal";
import InfoModal from "./Common/InfoModal";
import ScheduleDetail from "./components/ScheduleDetail";
import ScheduleItem from "./components/ScheduleItem";

import { addMoreSchedules, deleteScheduleFromList, setSchedulesList } from "@apps/redux/store";

export function SettingsSchedules(props) {
    const { permissionsList } = props;
    const { t } = useTranslation();
    const [teams, setTeams] = useState([]);
    const [bots, setBots] = useState([]);
    const [operators, setOperators] = useState([]);
    const [currentSchedule, setCurrentSchedule] = useState([]);
    const [scheduleBody, setScheduleBody] = useState({});
    const [showScheduleSettings, setShowScheduleSettings] = useState(false);
    const [editModeOption, setEditModeOption] = useState("");
    const [subTypeValue, setSubTypeValue] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [scheduleToDelete, setScheduleToDelete] = useState(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [isShowing, setIsShowing] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [firstScheduleSet, setFirstScheduleSet] = useState(false);
    const [type, setType] = useState("team");
    const [noResults, setNoResults] = useState(false);
    const [timeZoneList, setTimeZoneList] = useState([]);

    const canCreateSchedule = permissionsList.some((permission) => permission === "schedules:create_schedule");
    const canViewSchedule = permissionsList.some((permission) => permission === "schedules:view_schedule");
    const canUpdateSchedule = permissionsList.some((permission) => permission === "schedules:update_schedule");
    const canDeleteSchedule = permissionsList.some((permission) => permission === "schedules:delete_schedule");

    const dispatch = useDispatch();

    const schedules = useSelector((state) => state.schedules);

    const loadSchedules = async () => {
        if (!editMode) {
            setIsLoading(true);
        }
        try {
            const { data } = await DashboardServer.get(`/schedulers`, {
                params: {
                    page: 1,
                    sortBy: "createdAt",
                },
            });
            setTotalPages(get(data, "data.pagination.totalPages", ""));
            const results = get(data, "data.results", []);
            dispatch(setSchedulesList(results));
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
        setIsLoading(false);
    };

    const handleSearchSchedule = async ({ target }) => {
        setIsLoading(true);
        const { value } = target;
        setSearchValue(value);
        setPageNumber(1);
        try {
            const { data } = await DashboardServer.get(`/schedulers`, {
                params: {
                    search: value,
                    sortBy: "createdAt",
                },
            });
            setFirstScheduleSet(false);
            setTotalPages(get(data, "data.pagination.totalPages", ""));

            const results = get(data, "data.results", []);
            dispatch(setSchedulesList(results));
        } catch (error) {
            console.log(error);
        }

        scrollToUp.current.scrollTo(0, 0);
        hiddenScroll.current.scrollTo(0, 0);

        setIsLoading(false);
    };

    const handleCleanSearch = () => {
        setSearchValue("");
        loadSchedules();
    };

    const loadMoreSchedules = async () => {
        try {
            setIsLoadingMore(true);
            const { data } = await DashboardServer.get(`/schedulers`, {
                params: {
                    page: pageNumber + 1,
                    sortBy: "createdAt",
                },
            });
            const results = get(data, "data.results", []);
            dispatch(addMoreSchedules(results));
            setIsLoadingMore(false);
            setPageNumber(pageNumber + 1);
        } catch (error) {
            setIsLoadingMore(false);
            console.log(error);
        }
    };

    useEffect(() => {
        setScheduleBody({
            schedulerableId: "",
            schedulerable: "team",
            name: "",
            details: [
                {
                    rowId: uuid(),
                    timezone: "America/Guayaquil",
                    initHour: "",
                    endHour: "",
                    monday: false,
                    tuesday: false,
                    wednesday: false,
                    thursday: false,
                    friday: false,
                    saturday: false,
                    sunday: false,
                },
            ],
        });
    }, [currentSchedule]);

    const loadBots = async () => {
        try {
            const { data } = await DashboardServer.get(`/schedulers/schedulerable_options/bot`);
            const botsList = get(data, "data", []);
            let array = [];
            botsList.forEach((bot) => {
                array.push({
                    id: bot.id.toString(),
                    value: bot.id.toString(),
                    name: bot.name,
                });
            });
            setBots([...array]);
        } catch (error) {
            console.log(error);
        }
    };

    const loadOperators = async () => {
        try {
            const { data } = await DashboardServer.get(`/schedulers/schedulerable_options/operator`);
            let array = [];
            const operators = get(data, "data", "");
            operators.forEach((operator) => {
                array.push({
                    id: operator.id.toString(),
                    value: operator.id.toString(),
                    name: operator.names,
                });
            });
            setOperators([...array]);
        } catch (error) {
            console.log(error);
        }
    };

    const loadTeams = async () => {
        try {
            const { data } = await DashboardServer.get(`/schedulers/schedulerable_options/team`);

            const teamsList = get(data, "data", []);
            let array = [];

            teamsList.forEach((team) => {
                array.push({
                    id: team.id.toString(),
                    value: team.id.toString(),
                    name: team.name,
                });
            });
            setTeams([...array]);
        } catch (error) {
            console.log(error);
        }
    };

    const getSettedDays = (obj) => {
        const settedDaysClean = pick(obj, ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]);
        const settedDays = Object.keys(settedDaysClean).filter((day) => settedDaysClean[day]);

        const stringDays = settedDays.map((el, i, arr) => {
            if (i + 1 === arr.length) {
                return t(`daysOfTheWeek.${el}`);
            } else {
                return t(`daysOfTheWeek.${el}`) + ", ";
            }
        });

        return stringDays;
    };

    useEffect(() => {
        loadSchedules();
        loadOperators();
        loadTeams();
        loadBots();
        getTimeZoneList();
    }, []);

    const handleAddElement = () => {
        loadOperators();
        loadTeams();
        loadBots();
        setEditMode(false);
        setSubTypeValue("");
        setEditModeOption("");
        setShowScheduleSettings(true);
        setCurrentSchedule({ ...scheduleBody });
    };
    const deleteSchedule = async () => {
        const { schedulerable } = currentSchedule;
        setLoadingDelete(true);
        try {
            await DashboardServer.delete(`/schedulers/${scheduleToDelete}`);
            dispatch(deleteScheduleFromList(scheduleToDelete));
            notify(t("schedule.deletedMessage"));
            setShowScheduleSettings(false);
            if (schedulerable === "team") {
                loadTeams();
            }
            if (schedulerable === "operator") {
                loadOperators();
            }
            if (schedulerable === "bot") {
                loadBots();
            }
        } catch (error) {
            setLoadingDelete(false);
            setOpenDeleteModal(false);
            console.log(error);
        }

        setLoadingDelete(false);
        setOpenDeleteModal(false);
    };

    const scrollToUp = useRef(null);
    const hiddenScroll = useRef(null);

    useEffect(() => {
        if (schedules.length === 0 && !isEmpty(searchValue)) {
            setNoResults(true);
        } else {
            setNoResults(false);
        }
    }, [schedules, searchValue]);

    const notify = (msg) => {
        toast.success(msg, {
            position: toast.POSITION.BOTTOM_RIGHT,
        });
    };

    const getTimeZoneList = () => {
        let objList = [];
        timezones.forEach((tz) => {
            objList.push({ value: tz.tzCode, name: tz.tzCode });
        });
        objList = objList.sort((a, b) => {
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            return 0;
        });
        setTimeZoneList(objList);
    };

    return (
        <>
            <div ref={hiddenScroll} className="no-scrollbar h-full w-2/4 overflow-scroll rounded-l-1 border-r-[1.5px] border-[#A6B4D0] border-opacity-[0.25] bg-white">
                <div className=" top-0 z-10 rounded-tl-20 border-b-0.5 border-[#A6B4D0] border-opacity-[0.25] bg-white px-8 py-4">
                    <div className="text-lg font-bold text-primary-200">{t("schedule.title")}</div>
                    <div className="mb-4 flex items-center space-x-3 pt-4">
                        <div className="relative flex flex-1 items-center bg-white">
                            <div className="absolute left-2">
                                <SearchIcon width="15" height="15" />
                            </div>
                            <DebounceInput
                                autoFocus={true}
                                className="outline-none focus:ring-[#a6b4d0]"
                                style={{
                                    border: "1px solid rgba(166, 180, 208, 0.5)",
                                    borderRadius: "1.5em",
                                    resize: "none",
                                    flex: "1",
                                    height: "2.313rem",
                                    padding: "1rem 0.75rem 1rem 3rem",
                                    fontSize: "0.875rem",
                                }}
                                minLength={2}
                                value={searchValue}
                                debounceTimeout={500}
                                placeholder={`${t("selectMessage.search")}`}
                                onChange={handleSearchSchedule}
                            />
                            {!isEmpty(searchValue) && (
                                <button className="absolute right-2" onClick={() => handleCleanSearch()}>
                                    <CloseIcon className="cursor-pointer fill-current text-[#727C94] opacity-50" width="12" height="12" />
                                </button>
                            )}
                        </div>
                        {canCreateSchedule && (
                            <Tippy content={t("schedule.add")} arrow={false} theme="jelou" placement={"right"}>
                                <button
                                    className="px-100 [8px] h-[1.8rem] w-[1.8rem] cursor-pointer items-center rounded-full bg-primary-200 bg-opacity-100 text-center font-semibold text-white hover:bg-opacity-50"
                                    onClick={() => handleAddElement()}
                                >
                                    <PlusIcon className="text-white" width=".9rem" height=".9rem" fill="currentColor" />
                                </button>
                            </Tippy>
                        )}
                    </div>
                </div>
                <div className="h-full overflow-y-auto" ref={scrollToUp}>
                    {noResults && (
                        <div className="items-cente flex w-full justify-center pt-8">
                            <p className="text-gray-400 text-opacity-75">{t("schedule.noResults")}</p>
                        </div>
                    )}

                    {isLoading ? (
                        <div className="flex h-full items-center justify-center">
                            <div className={"-translate-y-20 transform"}>
                                <BeatLoader color={"#00B3C7"} size={"0.625rem"} />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="relative flex flex-col">
                                {schedules.map((schedule, index) => (
                                    <ScheduleItem
                                        canUpdateSchedule={canUpdateSchedule}
                                        canCreateSchedule={canCreateSchedule}
                                        canDeleteSchedule={canDeleteSchedule}
                                        loadOperators={loadOperators}
                                        loadTeams={loadTeams}
                                        loadBots={loadBots}
                                        setType={setType}
                                        setOpenInfoModal={setIsShowing}
                                        setScheduleToDelete={setScheduleToDelete}
                                        setOpenDeleteModal={setOpenDeleteModal}
                                        setEditMode={setEditMode}
                                        scheduleBody={scheduleBody}
                                        key={index}
                                        setSubTypeValue={setSubTypeValue}
                                        setEditModeOption={setEditModeOption}
                                        setShowScheduleSettings={setShowScheduleSettings}
                                        setCurrentSchedule={setCurrentSchedule}
                                        currentSchedule={currentSchedule}
                                        schedule={schedule}
                                        getSettedDays={getSettedDays}
                                    />
                                ))}

                                {pageNumber < totalPages && (
                                    <div className="flex w-full justify-center pb-10 pt-5">
                                        <button type="button" className="button-primary w-32" onClick={() => loadMoreSchedules()}>
                                            {isLoadingMore ? <BeatLoader color={"white"} size={"0.625rem"} /> : `${t("clients.loadMore")}`}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="z-10 flex h-full w-full space-y-3 overflow-y-scroll rounded-r-1 bg-white py-9 pb-7">
                {openDeleteModal && (
                    <Modal>
                        <ActionsModal isLoading={loadingDelete} setOpen={setOpenDeleteModal} onConfirm={deleteSchedule} action={"delete"} />
                    </Modal>
                )}
                {showScheduleSettings ? (
                    <div className="relative mb-9 flex w-full flex-col items-center pt-6">
                        <ScheduleDetail
                            canViewSchedule={canViewSchedule}
                            canUpdateSchedule={canUpdateSchedule}
                            canCreateSchedule={canCreateSchedule}
                            canDeleteSchedule={canDeleteSchedule}
                            setSearchValue={setSearchValue}
                            type={type}
                            setType={setType}
                            setEditModeOption={setEditModeOption}
                            setFirstScheduleSet={setFirstScheduleSet}
                            firstScheduleSet={firstScheduleSet}
                            schedulesList={schedules}
                            setEditMode={setEditMode}
                            setPageNumber={setPageNumber}
                            hiddenScroll={hiddenScroll}
                            scrollToUp={scrollToUp}
                            setShowScheduleSettings={setShowScheduleSettings}
                            editMode={editMode}
                            loadSchedules={loadSchedules}
                            subTypeValue={subTypeValue}
                            setSubTypeValue={setSubTypeValue}
                            editModeOption={editModeOption}
                            setScheduleBody={setScheduleBody}
                            scheduleBody={scheduleBody}
                            getSettedDays={getSettedDays}
                            currentSchedule={currentSchedule}
                            setCurrentSchedule={setCurrentSchedule}
                            teams={teams}
                            bots={bots}
                            operators={operators}
                            t={t}
                            timeZoneList={timeZoneList}
                        />
                    </div>
                ) : (
                    <div className="flex w-full items-center justify-center self-center text-center">
                        <div>
                            <ScheduleIcon width="422" height="365" fill="none" className={"transition duration-300 ease-in"} />
                            <div className="text-xl font-bold text-gray-400 text-opacity-75">{t("schedule.setUpSchedule")}</div>
                            <div className="text-lg text-gray-400 text-opacity-75">{t("schedule.chooseMsg")}</div>
                        </div>
                    </div>
                )}
                {
                    <Transition
                        show={isShowing}
                        key={"cardText"}
                        enter="transition-opacity duration-100"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity duration-200 transition ease-in-out"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Modal>
                            <InfoModal setOpen={setIsShowing} />
                        </Modal>
                    </Transition>
                }
            </div>
            <ToastContainer />
        </>
    );
}
export default SettingsSchedules;
