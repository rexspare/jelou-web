import React, { useState, useEffect, useRef, useContext } from "react";
import isEmpty from "lodash/isEmpty";
import { SortIcon } from "@apps/shared/icons";
import { useDispatch, useSelector } from "react-redux";
import get from "lodash/get";
import reverse from "lodash/reverse";
import sortBy from "lodash/sortBy";
import toUpper from "lodash/toUpper";
import { addOperatorsHistory } from "@apps/redux/store";
import ProfilePreview from "./ProfilePreview";
import OperatorHistory from "./OperatorHistory";
import Tippy from "@tippyjs/react";
import { Transition } from "@headlessui/react";
import { useOnClickOutside } from "@apps/shared/hooks";
import { useTranslation } from "react-i18next";
import { DateContext } from "@apps/context";

const ConversationSidebar = (props) => {
    const { getMessageByOperator, selectedOptions, isLoadingMessage, loadingOperators } = props;
    const dayjs = useContext(DateContext);
    const currentRoomClients = useSelector((state) => state.currentRoomClients);
    const operators = useSelector((state) => state.operatorsHistory);
    const storedParams = useSelector((state) => state.storedParams);
    const dispatch = useDispatch();
    const [name, setName] = useState("");
    const [roomAvatar, setRoomAvatar] = useState("");
    const metadata = get(currentRoomClients, "metadata", {});
    const [type, setType] = useState("");
    const [detail, setDetail] = useState("");
    const { tags } = currentRoomClients;
    const { t } = useTranslation();

    const [showAscOptions, setShowAscOptions] = useState(false);
    const [sortOrder, setSortOrder] = useState(false);

    const dropdownRef = useRef();

    useOnClickOutside(dropdownRef, () => setShowAscOptions(false));

    useEffect(() => {
        setSortOrder(get(localStorage, "sortOrderRoom", "desc_chat"));
    }, []);

    const setOrder = (order) => {
        setSortOrder(order);
        localStorage.setItem("sortOrderRoom", order);
    };

    const getFilteredOperators = () => {
        if (sortOrder === "asc_alphabet") {
            return sortBy(operators, ["operator"]);
        }
        if (sortOrder === "asc_history") {
            let ascending = [...operators];
            ascending = ascending.sort(function (a, b) {
                return dayjs(b.date, "DD/MM/YYYY hh:mm:ss") - dayjs(a.date, "DD/MM/YYYY hh:mm:ss");
            });
            return ascending;
        }

        if (sortOrder === "desc_history") {
            let descending = [...operators];
            descending = descending.sort(function (a, b) {
                return dayjs(a.date, "DD/MM/YYYY hh:mm:ss") - dayjs(b.date, "DD/MM/YYYY hh:mm:ss");
            });
            return descending;
        }
        return reverse(sortBy(operators, ["operator"]));
    };

    const getName = () => {
        let name = [];
        name = isEmpty(get(currentRoomClients, "names", ""))
            ? isEmpty(get(currentRoomClients, "metadata.names", ""))
                ? "Desconocido"
                : get(currentRoomClients, "metadata.names", "")
            : get(currentRoomClients, "names", "");
        setName(name);
    };
    const getRoomAvatar = () => {
        let src = get(metadata, "profilePicture");

        if (isEmpty(src)) {
            src = get(currentRoomClients, "avatarUrl");
        }

        if (isEmpty(src)) {
            src = "https://s3.us-west-2.amazonaws.com/cdn.devlabs.tech/default_avatar.jpeg";
        }
        setRoomAvatar(src);
    };

    const getDetail = () => {
        switch (toUpper(type)) {
            case "WHATSAPP": {
                const id = get(currentRoomClients, "referenceId");
                if (!isEmpty(id)) setDetail(id.replace("@c.us", ""));
                break;
            }
            default: {
                let username = get(currentRoomClients, "metadata.username", "");
                if (!isEmpty(username)) {
                    username = `@${username}`;
                }
                setDetail(username);
                break;
            }
        }
    };

    useEffect(() => {
        getName();
        getRoomAvatar();
        setType(get(currentRoomClients, "Bot.type", ""));
        getDetail();
    }, [currentRoomClients]);

    const handleOperator = (operator) => {
        let messageId = get(operator, "messageId", "");

        const updateOperators = operators.map((operator) => {
            if (operator.messageId === messageId) {
                return { ...operator, isSelected: true };
            } else {
                return { ...operator, isSelected: false };
            }
        });
        dispatch(addOperatorsHistory(updateOperators));
        getMessageByOperator(messageId);
    };

    const filteredOperators = getFilteredOperators();

    return (
        <div className="flex w-74 flex-col overflow-hidden border-l-1 border-gray-100 border-opacity-25 bg-white text-gray-500 shadow-menu lg:rounded-br-xl">
            <ProfilePreview roomAvatar={roomAvatar} name={name} detail={detail} tags={tags} storedParams={storedParams} />

            <div className="flex flex-row items-center justify-between border-t-1 border-b-1 border-gray-100 border-opacity-25 px-5">
                <span className="flex h-14 items-center text-base font-semibold">{t("clients.history")}</span>
                <div className="relative flex space-x-2">
                    <Tippy content={t("clients.orderBy")} touch={false}>
                        <button
                            className="border-transparent focus:outline-none"
                            onClick={() => {
                                setShowAscOptions(!showAscOptions);
                            }}>
                            <SortIcon className="h-6 w-6 fill-current font-bold text-gray-400 text-opacity-50" />
                        </button>
                    </Tippy>
                    <Transition
                        className="absolute right-0 z-50 mt-10 w-48 flex-col overflow-hidden rounded-lg bg-white shadow-global lg:flex"
                        show={showAscOptions}
                        as={"div"}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95">
                        <div className="flex flex-col" ref={dropdownRef}>
                            <button
                                className={`border-b-1 border-gray-400 border-opacity-25 py-2 hover:bg-gray-400 hover:bg-opacity-15 ${
                                    sortOrder === "asc_alphabet" ? "text-primary-200" : "text-gray-400"
                                }`}
                                onClick={() => {
                                    setOrder("asc_alphabet");
                                    setShowAscOptions(false);
                                }}>
                                <span className={`border-transparent text-13 font-bold focus:outline-none`}>{"A-Z"}</span>
                            </button>
                            <button
                                className={`border-b-1 border-gray-400 border-opacity-25 py-2 hover:bg-gray-400 hover:bg-opacity-15 ${
                                    sortOrder === "asc_history" ? "text-primary-200" : "text-gray-400"
                                }`}
                                onClick={() => {
                                    setOrder("asc_history");
                                    setShowAscOptions(false);
                                }}>
                                <span className={`border-transparent text-13 font-bold focus:outline-none`}>{t("clients.recentOperator")}</span>
                            </button>
                            <button
                                className={`py-2 hover:bg-gray-400 hover:bg-opacity-15 ${
                                    sortOrder === "desc_history" ? "text-primary-200" : "text-gray-400"
                                }`}
                                onClick={() => {
                                    setOrder("desc_history");
                                    setShowAscOptions(false);
                                }}>
                                <span
                                    className={`${
                                        sortOrder === "desc_history" ? "text-primary-200" : "text-gray-400"
                                    } border-transparent text-13 font-bold focus:outline-none`}>
                                    {t("clients.oldestOperator")}
                                </span>
                            </button>
                        </div>
                    </Transition>
                </div>
            </div>
            <OperatorHistory
                currentRoomClients={currentRoomClients}
                operators={filteredOperators}
                handleOperator={handleOperator}
                selectedOptions={selectedOptions}
                isLoadingMessage={isLoadingMessage}
                loadingOperators={loadingOperators}
                storedParams={storedParams}
                noOperators={t("clients.noOperators")}
            />
        </div>
    );
};

export default ConversationSidebar;
