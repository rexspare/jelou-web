/* eslint-disable array-callback-return */
import { ShowTags, Tag } from "@apps/pma/ui-shared";
import { updateCurrentEmail, updateEmail } from "@apps/redux/store";
import { usePrevious } from "@apps/shared/hooks";
import { PlusIcon1 } from "@apps/shared/icons";
import { JelouApiV1 } from "@apps/shared/modules";
import { Menu, Transition } from "@headlessui/react";
import Fuse from "fuse.js";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const EmailTags = ({ disableAddTag, emailTags, isPublicEmail = false }) => {
    const userSession = useSelector((state) => state.userSession);
    const currentEmail = useSelector((state) => state.currentEmail);

    const [addTag, setAddTag] = useState(false);
    const [createTagFlag] = useState(false);
    const [tags, setTags] = useState([]);
    const [chatTags, setChatTags] = useState([]);
    const [tag, setTag] = useState("");
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    const prevcurrentEmail = usePrevious(currentEmail);

    useEffect(() => {
        if (!isEmpty(currentEmail) && isEmpty(prevcurrentEmail) && !isEmpty(userSession)) {
            getTags();
        }
    }, [currentEmail, userSession]);

    const getTags = () => {
        const companyId = get(userSession, "companyId");
        const teams = get(userSession, "teams", []);
        const bots = get(currentEmail, "bot.id", []);

        JelouApiV1.get(`/company/${companyId}/tags`, {
            params: {
                type: "reply",
                ...(!isEmpty(teams) ? { teams } : {}),
                ...(!isEmpty(bots) ? { bots: [bots] } : {}),
                joinTags: true,
            },
        })
            .then((res) => {
                const tagsArray = get(res, "data.data", []);
                setTags(tagsArray);
            })
            .catch((err) => {
                console.log("=== ERROR", err);
            });
    };

    const getTagsInfo = () => {
        let objs = tags.filter((el) => {
            if (emailTags.includes(el.id)) {
                return el;
            }
            if (emailTags.some((tag) => tag.id === el.id)) {
                return el;
            }
        });
        return objs;
    };

    let tagsInfo = isPublicEmail ? emailTags : getTagsInfo();

    const addTagChat = (tag) => {
        const tagObj = { name: tag.name, color: tag.color, id: tag.id };
        const updateChatTagsId = tagsInfo.map((value) => {
            return value.id;
        });

        const updatedTagsBody = [...tagsInfo];
        const updateChatTags = chatTags;
        let repetido = false;
        updateChatTagsId.forEach((tagId) => {
            if (tagId === tag.id) repetido = true;
        });

        if (!repetido) {
            updateChatTagsId.push(tag.id);
            updateChatTags.push(tagObj);
            updatedTagsBody.push(tag);
        }

        const keyId = currentEmail._id;
        setChatTags(updateChatTags);

        JelouApiV1.put(`/support-tickets/${keyId}`, {
            sort: "DESC",
            limit: 10,
            tags: updatedTagsBody,
        }).catch((error) => console.log("ERROR: ", error));

        const updatedRoom = { ...currentEmail, tags: updateChatTagsId };
        dispatch(updateEmail(updatedRoom));
        dispatch(updateCurrentEmail(updatedRoom));
    };

    // Remove tag from the Room
    const removeTag = (tagId) => {
        const keyId = currentEmail._id;

        const updateChatTags = tagsInfo.filter((tag) => {
            if (tag.id !== tagId) return true;
            else return false;
        });

        const updatedTagsBody = tagsInfo.filter((value) => value.id !== tagId);

        const updateChatTagsId = updateChatTags.map((value) => {
            return value.id;
        });
        setChatTags(updateChatTags);

        const updatedRoom = { ...currentEmail, tags: updateChatTagsId };
        dispatch(updateCurrentEmail(updatedRoom));
        dispatch(updateEmail(updatedRoom));
        JelouApiV1.put(`/support-tickets/${keyId}`, {
            tags: updatedTagsBody,
        }).catch((err) => {
            console.log("=== ERROR", err);
        });
    };

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

        return tagsResponse;
    };

    return (
        <div className="flex flex-col justify-start space-y-2 text-gray-400">
            <div className="flex flex-row">
                <div className="h-ful relative flex">
                    <div className="mr-2 flex flex-wrap-reverse space-x-1 space-y-2 overflow-x-auto">
                        <div id="tags-container" className="flex flex-nowrap space-x-1 overflow-x-auto">
                            {!isEmpty(tagsInfo) &&
                                tagsInfo.map((tag, index) => {
                                    return (
                                        <div className="h-6 flex-none" key={index}>
                                            <Tag
                                                tag={tag}
                                                setLoading={setLoading}
                                                showDeleteTag={!isPublicEmail}
                                                loading={loading}
                                                removeTag={removeTag}
                                                key={index}
                                            />
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                    {disableAddTag && (
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
                                leaveTo="opacity-0">
                                <Menu.Items className="border-11 absolute left-0 top-0 z-100 mt-8 w-56 rounded-lg bg-white p-4 shadow-normal">
                                    <ShowTags
                                        Tags
                                        searchTag={searchTag}
                                        addTag={addTag}
                                        setAddTag={setAddTag}
                                        tag={tag}
                                        setTag={setTag}
                                        createTag={() => console.log("createTag")}
                                        tagsArray={tags}
                                        chatTags={tagsInfo}
                                        addTagChat={addTagChat}
                                    />
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmailTags;
