import Fuse from "fuse.js";
import get from "lodash/get";
import first from "lodash/first";
import toUpper from "lodash/toUpper";
import isEmpty from "lodash/isEmpty";
import toLower from "lodash/toLower";
import { toast } from "react-toastify";
import { BeatLoader } from "react-spinners";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";

import { JelouApiV1 } from "@apps/shared/modules";
import { ShowTags, Tag } from "@apps/pma/ui-shared";
import { currentSectionPma } from "@apps/shared/constants";
import { checkIfOperatorIsOnline } from "@apps/shared/utils";
import SidebarElement from "../sidebar-element/SidebarElement";
import { DownIcon, PlusIcon1, RightIcon } from "@apps/shared/icons";
import { updateRoom, updateRoomById, updateStoredParams, updateArchivedRoom, setShowDisconnectedModal } from "@apps/redux/store";

const CRMTab = ({ settings, errorArray, storeParams, activeButton, setSavedData, settingsArray, setStoreParams, isArchivedRoom, heightOfParent, showButton, setSidebarChanged } = {}) => {
    const { t } = useTranslation();
    const company = useSelector((state) => state.company);
    const currentRoom = useSelector((state) => state.currentRoom);

    const [tag, setTag] = useState("");
    const [createTagFlag] = useState(false);
    const [addTag, setAddTag] = useState(false);
    const [loading, setLoading] = useState(false);
    const [viewTag, setViewTag] = useState(false);
    const [verifyParams, setVerifyParams] = useState([]);
    const tags = useSelector((state) => state.tags);
    const statusOperator = useSelector((state) => state.statusOperator);
    const { section = "" } = useParams();

    const dispatch = useDispatch();

    useEffect(() => {
        if (!isEmpty(settings) && isEmpty(verifyParams)) {
            setVerifyParams(settings);
        }
    }, [currentRoom]);

    const searchTag = ({ target }) => {
        const { value } = target;
        setTag(value);

        const fuseOptions = {
            keys: ["name.es"],
            threshold: 0.3,
        };

        const fuse = new Fuse(tags, fuseOptions);

        const result = fuse.search(value);
        let tagsResponse = [];
        result.map((tag) => {
            return tagsResponse.push(tag.item);
        });

        if (!isEmpty(value) && isEmpty(result) && createTagFlag) {
            setAddTag(true);
        }
        if (addTag && !isEmpty(result)) {
            setAddTag(false);
        }

        if (isEmpty(result)) {
            tagsResponse = [{ emptyTag: true }];
        }
        return tagsResponse;
    };

    const notify = () => {
        toast.success(
            <div className="flex items-center justify-between">
                <svg className="-mt-px ml-4 mr-2" width="1.563rem" height="1.563rem" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M18.0256 8.53367C18.4071 8.91514 18.4071 9.5335 18.0256 9.91478L11.4742 16.4663C11.0928 16.8476 10.4746 16.8476 10.0931 16.4663L6.97441 13.3474C6.59294 12.9662 6.59294 12.3478 6.97441 11.9665C7.35569 11.585 7.97405 11.585 8.35533 11.9665L10.7836 14.3948L16.6445 8.53367C17.0259 8.15239 17.6443 8.15239 18.0256 8.53367ZM25 12.5C25 19.4094 19.4084 25 12.5 25C5.59063 25 0 19.4084 0 12.5C0 5.59063 5.59158 0 12.5 0C19.4094 0 25 5.59158 25 12.5ZM23.0469 12.5C23.0469 6.67019 18.329 1.95312 12.5 1.95312C6.67019 1.95312 1.95312 6.67095 1.95312 12.5C1.95312 18.3298 6.67095 23.0469 12.5 23.0469C18.3298 23.0469 23.0469 18.329 23.0469 12.5Z"
                        fill="#0CA010"
                    />
                </svg>
                <div className="text-15 text-[#0CA010]">{t("pma.Los datos fueron guardados correctamente")}</div>
            </div>,
            {
                position: toast.POSITION.BOTTOM_RIGHT,
            }
        );
    };

    const updateName = async (name) => {
        const { id } = currentRoom;
        JelouApiV1.put(`/rooms/${id}`, { name }).catch((err) => {
            console.log("error", err);
        });
    };

    // Get random Int
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    // Add the tag to a Room
    const addTagChat = (tag) => {
        if (checkIfOperatorIsOnline(statusOperator)) {
            dispatch(setShowDisconnectedModal(true));
            return;
        }
        const currentRoomTags = get(currentRoom, "tags", []);

        const newTagForChat = { name: tag.name, color: tag.color, id: tag.id };
        const chatTagsIds = currentRoomTags.map((value) => value.id);

        const updateChatTags = [...currentRoomTags];
        let isTagInChat = chatTagsIds.includes(tag.id);

        if (isTagInChat) return;

        chatTagsIds.push(tag.id);
        updateChatTags.push(newTagForChat);

        const updatedRoom = { ...currentRoom, tags: updateChatTags };
        if (currentRoom?.archived) {
            dispatch(updateArchivedRoom(updatedRoom));
        } else {
            dispatch(updateRoom(updatedRoom));
        }

        const botId = currentRoom.appId;
        JelouApiV1.post(`/bots/${botId}/rooms/tags`, {
            tags: chatTagsIds,
            roomId: currentRoom.id,
        }).catch((err) => {
            console.log("=== ERROR", err);
        });
    };

    // Remove tag from the Room
    const removeTag = (tagId) => {
        if (checkIfOperatorIsOnline(statusOperator)) {
            dispatch(setShowDisconnectedModal(true));
            return;
        }
        const currentRoomTags = get(currentRoom, "tags", []);

        const updateChatTags = currentRoomTags.filter((tag) => {
            if (tag.id !== tagId) return true;
            else return false;
        });

        const updateChatTagsId = updateChatTags.map((value) => {
            return value.id;
        });

        const updatedRoom = { ...currentRoom, tags: updateChatTags };

        if (currentRoom?.archived) {
            dispatch(updateArchivedRoom(updatedRoom));
        } else {
            dispatch(updateRoom(updatedRoom));
        }
        const botId = currentRoom.appId;
        JelouApiV1.post(`/bots/${botId}/rooms/tags`, {
            tags: updateChatTagsId,
            roomId: currentRoom.id,
        }).catch((err) => {
            console.log("=== ERROR", err);
        });
    };

    // Create a new tag with a random color
    const createTag = () => {
        // select random color
        const colorArray = ["#FFAEBC", "#A0E7E5", "#B4F8C8", "#FBE7C6"];
        const colorIndex = getRandomInt(colorArray.length);
        const tagColor = colorArray[colorIndex];

        const companyId = company.id;
        JelouApiV1.post(`/company/${companyId}/tags`, {
            name: { es: tag, en: "" },
            color: tagColor,
        })
            .then((res) => {
                addTagChat(res.data.data);
            })
            .catch((err) => {
                console.log("=== ERROR", err);
            });
    };

    const handleChange = ({ target }) => {
        const { name, value } = target;
        setStoreParams({
            ...storeParams,
            [name]: value,
        });
    };

    const handleSelect = (evt, moreInfo) => {
        setStoreParams({
            ...storeParams,
            [moreInfo]: evt.value,
        });
    };

    const handleSubmit = async () => {
        try {
            if (checkIfOperatorIsOnline(statusOperator)) {
                dispatch(setShowDisconnectedModal(true));
                return;
            }
            const { appId, senderId } = currentRoom;
            const keyObj = Object.keys(storeParams);

            let trimParams = {};
            keyObj.forEach((key) => {
                if (typeof storeParams[key] === "string") {
                    if (toLower(key) === "name" || toLower(key) === "names" || toLower(key) === "fullname") {
                        updateName(storeParams[key].trim());
                    }
                    trimParams = { ...trimParams, [key]: storeParams[key].trim() };
                } else {
                    trimParams = { ...trimParams, [key]: storeParams[key] };
                }
            });

            setLoading(true);
            notify();

            const { data } = await JelouApiV1.post(`/bots/${appId}/users/${senderId.replace("@c.us", "")}/storedParams/legacy`, trimParams);
            const userData = get(data, "data", []);
            setLoading(false);
            setSavedData({ ...storeParams });
            setSidebarChanged(true);
            dispatch(updateStoredParams(userData));
            dispatch(updateRoomById({ ...currentRoom, sidebarData: trimParams }));
        } catch (error) {
            console.error(error);
            setLoading(false);
            toast.error(t("Ocurrió un error al guardar los datos por favor intenta nuevamente"), {
                position: toast.POSITION.BOTTOM_RIGHT,
            });
        }
    };

    /**
     * Send the error message text. If it has the error atribute.
     *
     */
    const getErrorMessage = (elementData, setting, rule) => {
        const { name, label } = setting;
        const rules = get(rule, "rules", null);
        if (!rules) {
            return null;
        }
        const errorString = first(errorArray[name]);
        if (errorString === undefined) {
            return null;
        }
        const correctedMessage = errorString.replace(name, label);
        return correctedMessage;
    };

    return (
        <div>
            {!isArchivedRoom && (
                <>
                    <div className="flex flex-row justify-between pt-10 text-gray-400 md:p-4 md:pb-2">
                        <div className="flex flex-row">
                            <span className="flex items-center text-13 leading-normal text-gray-400 md:text-15 xxl:text-base">
                                <button className="flex items-center border-transparent" onClick={() => setViewTag(!viewTag)}>
                                    <span className="font-bold">{t("pma.Etiquetas")}</span>
                                    {` ( ${get(currentRoom, "tags", []).length} )`}
                                    {viewTag ? (
                                        <DownIcon className="select-none fill-current pb-[0.22rem] text-gray-400 outline-none" width="1.25rem" height="1.25rem" />
                                    ) : (
                                        <RightIcon className="select-none fill-current pb-[0.18rem] text-gray-400 outline-none" width="1.25rem" height="1.25rem" />
                                    )}
                                </button>
                            </span>
                        </div>
                        <div className="relative ml-3 flex h-full justify-end">
                            <Menu>
                                <Menu.Button className="h-full border-transparent focus:outline-none">
                                    <PlusIcon1 className="font-bold" width="1.563rem" height="1.563rem" />
                                </Menu.Button>
                                <Transition
                                    enter="transition-opacity duration-75"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="transition-opacity duration-150"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <Menu.Items className="border-11 absolute right-0 top-0 z-100 mt-8 w-56 rounded-lg bg-white p-4 shadow-normal">
                                        <ShowTags
                                            Tags
                                            searchTag={searchTag}
                                            addTag={addTag}
                                            setAddTag={setAddTag}
                                            tag={tag}
                                            setTag={setTag}
                                            createTag={createTag}
                                            tagsArray={tags}
                                            addTagChat={addTagChat}
                                            chatTags={get(currentRoom, "tags", [])}
                                        />
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        </div>
                    </div>
                    {!isEmpty(currentRoom) && currentRoom?.tags && (
                        <div className="ml-2 flex flex-wrap-reverse gap-1 space-y-2 overflow-x-auto px-2">
                            {!viewTag &&
                                currentRoom.tags.map((tag, index) => {
                                    if (index < 1) {
                                        return (
                                            <div className="mr-1 flex h-6" key={index}>
                                                <Tag tag={tag} removeTag={removeTag} key={index} />
                                            </div>
                                        );
                                    }
                                    if (index === 2) {
                                        return (
                                            <span key={index} className="ml-3 text-gray-400">
                                                ...
                                            </span>
                                        );
                                    }
                                    return null;
                                })}
                            {viewTag &&
                                currentRoom.tags.map((tag, index) => {
                                    return (
                                        <div className="mr-1 h-6 flex-none" key={index}>
                                            <Tag tag={tag} removeTag={removeTag} key={index} />
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                </>
            )}

            <div className={`mt-4 hidden h-full w-full flex-col border-gray-100 border-opacity-25 md:flex md:py-6 md:pl-4 md:pr-1 ${isArchivedRoom ? "" : "border-t-1.5"}`}>
                <div className="overflow-y-auto md:pr-4" style={{ height: Math.floor(heightOfParent) }}>
                    <div className="flex flex-col justify-between bg-white">
                        {settingsArray.map((setting, index) => {
                            return (
                                <div key={index}>
                                    <SidebarElement
                                        {...setting}
                                        key={index}
                                        onChange={handleChange}
                                        handleSelect={handleSelect}
                                        storeParams={storeParams}
                                        getErrorMessage={() => getErrorMessage(storeParams[setting.name], setting, get(setting, "rules"))}
                                        readOnly={toUpper(section) === currentSectionPma.ARCHIVED}
                                    />
                                </div>
                            );
                        })}
                    </div>

                    {showButton && (
                        <div className="absolute bottom-0 left-0 right-0 flex h-16 items-center justify-end bg-white">
                            {loading ? (
                                <button className="mr-2 flex h-10 cursor-not-allowed items-center justify-center rounded-full bg-primary-200 px-5 text-white outline-none hover:bg-primary-100 focus:outline-none">
                                    <BeatLoader size={"0.5rem"} color="#ffff" />
                                </button>
                            ) : (
                                <button
                                    onClick={activeButton ? handleSubmit : null}
                                    className={`text-14 mr-2 flex h-10 items-center justify-center rounded-full border-transparent px-5 font-bold outline-none ${
                                        activeButton ? "bg-primary-200 text-white hover:bg-primary-100 focus:outline-none" : "cursor-not-allowed bg-gray-10 text-gray-400"
                                    }`}
                                    disabled={!activeButton}
                                >
                                    {t("pma.Guardar")}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CRMTab;
