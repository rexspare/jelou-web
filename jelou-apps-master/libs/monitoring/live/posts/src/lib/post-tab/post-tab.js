import { useTranslation } from "react-i18next";
import { Tab } from "@headlessui/react";

const PostTab = (props) => {
    const { setPostParams, postParams, totalReplies, facebookFeedReplies, twitterReplies, queueReplies, permissionArchivePost, modalArchivePost } =
        props;
    const { t } = useTranslation();
    const isActiveClassName = " w-fit items-center flex h-[2.5rem] rounded-[0.5rem] px-4 text-15 xxl:text-lg bg-[#EDF7F9] text-primary-200";
    const isNotActiveClassName = "w-fit items-center text-15 flex rounded-[0.5rem] px-4 py-1 text-gray-400";
    const isActiveClassNameInQueue =
        "text-secondary-150 w-fit items-center flex h-[2.5rem] rounded-[0.5rem] px-4 text-15 xxl:text-lg bg-[#FFE185] bg-opacity-25 text-primary-200";

    return (
        <div className="flex items-center justify-between px-6 pb-4">
            <div className="flex items-center space-x-2">
                <Tab.Group>
                    <Tab.List className={"flex items-center"}>
                        <span
                            onClick={() => {
                                setPostParams({ ...postParams, channel: "", status: "", bot: "", id: "" });
                            }}>
                            <Tab className={({ selected }) => (selected ? isActiveClassName : isNotActiveClassName)}>
                                <p className=" pr-2 font-bold">{totalReplies}</p>
                                <p>{t("monitoring.Todos")}</p>
                            </Tab>
                        </span>
                        <span
                            onClick={() => {
                                setPostParams({ ...postParams, status: "", channel: "Facebook_Feed", bot: "", id: "" });
                            }}>
                            <Tab className={({ selected }) => (selected ? isActiveClassName : isNotActiveClassName)}>
                                <p className=" pr-2 font-bold">{facebookFeedReplies}</p>
                                <p>Facebook</p>
                            </Tab>
                        </span>
                        <span
                            onClick={() => {
                                setPostParams({ ...postParams, status: "", channel: "Twitter_Replies", bot: "", id: "" });
                            }}>
                            <Tab className={({ selected }) => (selected ? isActiveClassName : isNotActiveClassName)}>
                                <p className=" pr-2 font-bold">{twitterReplies}</p>
                                <p>Twitter</p>
                            </Tab>
                        </span>
                        <span
                            onClick={() => {
                                setPostParams({ ...postParams, channel: "", status: "in_queue", bot: "", id: "" });
                            }}>
                            <Tab className={({ selected }) => (selected ? isActiveClassNameInQueue : isNotActiveClassName)}>
                                <p className="pr-2 font-bold text-secondary-150">{queueReplies}</p>
                                <p>{t("monitoring.En cola")}</p>
                            </Tab>
                        </span>
                        {/*<span
                        onClick={() => {
                            setPostParams({ ...postParams, channel: "", status: "ASSIGNED" });
                        }}>
                        <Tab className={({ selected }) => (selected ? isActiveClassName : isNotActiveClassName)}>
                            <p className=" pr-2 font-bold text-gray-400">{assignedPosts}</p>
                            <p>{t("monitoring.asignados")}</p>
                        </Tab>
                    </span>
                    <span
                        onClick={() => {
                            setPostParams({ ...postParams, channel: "", status: "CLOSED_BY_OPERATOR" });
                        }}>
                        <Tab className={({ selected }) => (selected ? isActiveClassName : isNotActiveClassName)}>
                            <p className=" pr-2 font-bold text-gray-400">{attendedPosts}</p>
                            <p>{t("monitoring.Atendidos")}</p>
                        </Tab>
                    </span> */}
                    </Tab.List>
                </Tab.Group>
            </div>
            {permissionArchivePost && (
                <button className="button-gradient-xl disabled:cursor-not-allowed disabled:bg-opacity-60" onClick={() => modalArchivePost()}>
                    <p className="px-2 text-white">{t("MassAchivePost.menuTiltle")}</p>
                </button>
            )}
        </div>
    );
};

export default PostTab;
