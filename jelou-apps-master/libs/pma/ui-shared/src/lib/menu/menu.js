import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import isNumber from "lodash/isNumber";
import toUpper from "lodash/toUpper";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import { updateOperatorAvgResponseTime } from "@apps/redux/store";
import { currentSectionPma } from "@apps/shared/constants";
import { BroadcastIcon, HamburgerIcon } from "@apps/shared/icons";
import { JelouApiV1 } from "@apps/shared/modules";
import { emailsViewEnable, postsViewEnable } from "@apps/shared/utils";
import HsmModal from "../hsm-modal/hsm-modal";
import OperatorAvgResponseTime from "../operator-avg-response-time/operator-avg-response-time";

const Menu = (props) => {
    const { sendCustomText, setShowSideMenu } = props;
    const { t } = useTranslation();
    const { section = "", subSection = "" } = useParams();

    const userTeams = useSelector((state) => state.userTeams);

    const company = useSelector((state) => state.company);
    const posts = useSelector((state) => state.posts);
    const userSession = useSelector((state) => state.userSession);
    const isLoadingEmails = useSelector((state) => state.isLoadingEmails);

    const [showModal, setShowModal] = useState(false);

    const { properties } = company;
    const hasBroadcast = get(properties, "hasBroadcast", false);
    const hasInternalInbox = get(properties, "hasInternalInbox", false);
    const inboxName = get(properties, "inboxName", "Inbox");

    const companyFirstResponseTime = get(properties, "operatorView.operatorFirstResponseTime", 0);
    const operatorTime = useSelector((state) => state.operatorAvgResponseTime);

    const canViewEmails = emailsViewEnable(userTeams);
    const canViewPosts = postsViewEnable(userTeams);

    const unread = posts.length;
    const dispatch = useDispatch();

    const reload = () => {
        window.location.reload();
    };

    useEffect(() => {
        if (!isEmpty(userSession)) {
            getStats(userSession.operatorId);
        }
    }, [userSession]);

    const getStats = async (id) => {
        try {
            const { data } = await JelouApiV1.get(`/operators/${id}/stats`);
            const avgReplyTime = get(data, "data.avgReplyTime", 0);
            dispatch(updateOperatorAvgResponseTime(avgReplyTime));
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            {isLoadingEmails && (
                <div className="fixed top-0 z-50 flex w-full items-center justify-center py-1">
                    <div className="mx-2 flex h-[2.5rem] w-full max-w-[6rem] items-center justify-between rounded-10 bg-primary-200 px-3 text-sm font-bold text-white sm:mx-0">
                        {t("pma.Cargando...")}
                    </div>
                </div>
            )}
            <div className={`fixed z-30 flex h-11 w-full items-center justify-between bg-white px-2 sm:relative mid:h-60 mid:rounded-xl mid:px-6`}>
                <div className="flex h-full items-center">
                    <button
                        className="m-3 inline-flex items-center justify-center text-gray-400 transition duration-150 ease-in-out focus:outline-none mid:hidden"
                        onClick={() => setShowSideMenu(true)}
                    >
                        <HamburgerIcon width="1.125rem" height="1.063rem" />
                    </button>
                    <div>
                        <h1 className="block justify-start whitespace-nowrap font-primary font-bold leading-9 text-primary-200 sm:text-2xl">{t("common.multiAgtPanel")}</h1>
                    </div>
                    <nav className="relative hidden h-full w-full bg-white shadow-sm mid:flex">
                        <div className="hidden w-full sm:flex">
                            <Link
                                to={`/pma/chats`}
                                className={`group mr-3 inline-flex max-w-[14rem] items-center truncate px-4 py-2 text-base font-normal leading-5 text-gray-400 hover:border-primary-200 focus:outline-none ${
                                    toUpper(section) === currentSectionPma.CHATS ||
                                    toUpper(section) === "" ||
                                    (toUpper(section) === currentSectionPma.CHATS && toUpper(subSection) === currentSectionPma.ARCHIVED)
                                        ? "border-b-4 text-base font-normal leading-5 text-gray-400 focus:outline-none mid:border-primary-200"
                                        : "border-b-4 border-transparent"
                                }`}
                            >
                                <span className="mx-auto">{t("pma.Chats")}</span>
                            </Link>
                            {hasInternalInbox && (
                                <Link
                                    to={`/pma/inbox`}
                                    className={`group mr-3 inline-flex max-w-[14rem] items-center truncate px-4 py-2 text-base font-normal leading-5 text-gray-400 hover:border-primary-200 focus:outline-none ${
                                        toUpper(section) === currentSectionPma.INBOX
                                            ? "border-b-4 text-base font-normal leading-5 text-gray-400 focus:outline-none mid:border-primary-200"
                                            : "border-b-4 border-transparent"
                                    }`}
                                >
                                    <span className="mx-auto">{t(inboxName)}</span>
                                </Link>
                            )}

                            {canViewPosts && (
                                <Link
                                    to={`/pma/posts`}
                                    className={`group mr-3 inline-flex max-w-[14rem] items-center truncate px-4 py-2 text-base font-normal leading-5 text-gray-400 hover:border-primary-200 focus:outline-none ${
                                        toUpper(section) === currentSectionPma.POSTS || (toUpper(section) === currentSectionPma.POSTS && toUpper(subSection) === currentSectionPma.ARCHIVED)
                                            ? "border-b-4 text-base font-normal leading-5 text-gray-400 focus:outline-none mid:border-primary-200"
                                            : "border-b-4 border-transparent"
                                    }`}
                                >
                                    <span className="mx-auto">{t("pma.Posts")}</span>
                                    {unread > 0 && <span className="ml-2 flex h-5 items-center justify-center rounded-full bg-red-675 px-2 text-xs text-white">{unread}</span>}
                                </Link>
                            )}
                            {canViewEmails && (
                                <Link
                                    to={`/pma/emails`}
                                    className={`group mr-3 inline-flex max-w-[14rem] items-center truncate px-4 py-2 text-base font-normal leading-5 text-gray-400 hover:border-primary-200 focus:outline-none ${
                                        toUpper(section) === currentSectionPma.EMAILS
                                            ? "border-b-4 text-base font-normal leading-5 text-gray-400 focus:outline-none mid:border-primary-200"
                                            : "border-b-4 border-transparent"
                                    }`}
                                >
                                    <span className="mx-auto">{t("pma.Emails")}</span>
                                </Link>
                            )}
                        </div>
                    </nav>
                </div>
                <div className="mx-1 flex h-full flex-1 items-center justify-end space-x-3 mid:hidden">
                    <button className="flex items-center" onClick={reload}>
                        <svg className="h-4 w-4 sm:h-5 sm:w-6" viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M48.463 6.87359C48.463 5.47068 48.4383 4.33185 48.4713 3.18477C48.5289 1.18769 49.6656 -0.0171558 51.4037 0.00760134C53.084 0.0406109 54.1796 1.2207 54.196 3.14351C54.2208 6.7498 54.229 10.3561 54.196 13.9541C54.1796 15.9265 53.0429 17.0653 51.0577 17.09C47.4581 17.1313 43.8585 17.1231 40.2671 17.09C38.3479 17.0735 37.1864 15.976 37.17 14.2842C37.1535 12.477 38.2655 11.4372 40.3165 11.3959C41.6757 11.3711 43.043 11.3876 44.5092 11.3876C44.4104 11.1566 44.3939 10.9915 44.3115 10.9255C33.002 2.45031 16.2065 3.8037 8.66958 17.3706C3.94972 25.8706 4.53456 34.4778 10.3829 42.2433C16.2395 50.0088 24.3365 52.8394 33.8092 50.7185C43.0101 48.6554 49.6904 41.187 51.1071 32.0186C51.2883 30.8715 51.3048 29.6914 51.3954 28.5279C51.5437 26.7618 52.7216 25.6065 54.3031 25.6808C55.9258 25.7551 56.9637 26.9351 56.9967 28.7507C57.2191 42.5074 46.2967 55.0015 32.5078 56.751C17.1456 58.7068 3.55434 48.9608 0.531326 33.8259C-2.62348 18.0061 8.63663 2.29351 24.6001 0.271677C33.0267 -0.801133 40.646 1.32798 47.5405 6.22165C47.7711 6.4032 48.0017 6.56 48.463 6.87359Z"
                                fill="#00B3C7"
                            />
                        </svg>
                    </button>
                </div>
                <div className="relative flex h-full items-center space-x-1 md:justify-between">
                    {isNumber(Number(companyFirstResponseTime)) && Number(companyFirstResponseTime) > 0 && (
                        <OperatorAvgResponseTime operatorTime={operatorTime} companyTime={companyFirstResponseTime} />
                    )}
                    {hasBroadcast && (
                        <div className={`hidden items-center mid:flex`}>
                            <button
                                className="flex items-center justify-center rounded-full border-transparent bg-primary-200 px-3 py-2 outline-none hover:bg-primary-100 focus:outline-none"
                                onClick={() => setShowModal(true)}
                            >
                                <BroadcastIcon className="fill-current text-white" width="1.438rem" height="1.125rem" />
                                <span className="text-11 font-bold text-white lg:ml-2 lg:text-sm">{t("pma.Envío masivo")}</span>
                            </button>
                        </div>
                    )}
                </div>
                {get(company, "properties.hasBroadcast") && showModal && <HsmModal setShowModal={setShowModal} sendCustomText={sendCustomText} />}
            </div>
        </>
    );
};

export default Menu;
