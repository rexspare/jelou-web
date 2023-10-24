import React, { useState, useCallback, useEffect } from "react";
import { withTranslation } from "react-i18next";
import { SearchIcon } from "@apps/shared/icons";
import isEmpty from "lodash/isEmpty";
import Tag from "../tag/tag";
import { Popover } from "@headlessui/react";
import get from "lodash";
import first from "lodash";

const ShowTags = ({ tag, searchTag, addTag = false, setAddTag, createTag = false, tagsArray, addTagChat = false, chatTags, t }) => {
    const inputStyle = "input input-tag h-8";
    const [filterArray, setFilterArray] = useState([]);
    const [notFound, setNotFound] = useState(false);

    const alreadyAssigned = chatTags.map((tag) => tag.id);

    const callbackRef = useCallback((inputElement) => {
        if (inputElement) {
            setTimeout(function () {
                inputElement.focus();
            }, 100);
        }
    }, []);

    useEffect(() => {
        if (isEmpty(tag)) {
            setNotFound(false);
        }
    }, [tag]);

    return (
        <div className="flex max-h-40 flex-col">
            <div className="relative mb-4 w-full">
                <div className="absolute top-0 bottom-0 left-0 ml-4 flex items-center">
                    <SearchIcon className="fill-current" width="0.938rem" height="0.938rem" />
                </div>
                <div className="z-10">
                    <input
                        id="tag-input-search"
                        type="search"
                        className={inputStyle}
                        ref={callbackRef}
                        value={tag}
                        placeholder={t("pma.Buscar etiquetas")}
                        onChange={(value) => {
                            const content = value.target.value;
                            if (isEmpty(content) && addTag) {
                                setAddTag(false);
                            }
                            const result = searchTag(value);
                            const emptyTag = get(first(result), "emptyTag", false);
                            if (emptyTag && result.length === 1) {
                                setNotFound(true);
                            } else {
                                setNotFound(false);
                            }
                            setFilterArray(result);
                        }}
                    />
                </div>
            </div>
            {!addTag && (
                <div className="flex max-h-lg flex-wrap overflow-y-auto">
                    {!isEmpty(tagsArray) &&
                        tagsArray.map((tagData, index) => {
                            if (tagData.state && isEmpty(tag) && !alreadyAssigned.includes(tagData.id)) {
                                return (
                                    <Popover key={index}>
                                        <Popover.Button className="h-full border-transparent focus:outline-none" key={index}>
                                            <div className="mb-2 mr-2 h-6" key={index}>
                                                <Tag tag={tagData} isList={true} key={index} addTagChat={addTagChat} />
                                            </div>
                                        </Popover.Button>
                                    </Popover>
                                );
                            } else if (tagData.state && !isEmpty(tag) && filterArray.includes(tagData) && !alreadyAssigned.includes(tagData.id)) {
                                return (
                                    <Popover key={index}>
                                        <Popover.Button className="h-full border-transparent focus:outline-none" key={index}>
                                            <div className="mb-2 mr-2 h-6" key={index}>
                                                <Tag tag={tagData} isList={true} key={index} addTagChat={addTagChat} />
                                            </div>
                                        </Popover.Button>
                                    </Popover>
                                );
                            }
                            return null;
                        })}
                    {notFound && (
                        <Popover>
                            <Popover.Button className="h-full border-transparent focus:outline-none">
                                <div className="mb-2 mr-2 h-6">
                                    <span className="h-full text-xs focus:outline-none">No se encontraron etiquetas</span>
                                </div>
                            </Popover.Button>
                        </Popover>
                    )}
                </div>
            )}
            {addTag && (
                <div className="flex flex-col">
                    <span className="my-3 text-center text-13 text-gray-300">{t("pma.No se encontró busqueda")}</span>
                    <button className="w-full text-center focus:outline-none" onClick={() => createTag()}>
                        <span className="inline-flex items-center rounded-full bg-gray-10 px-5 py-1 text-13 font-bold text-gray-100">
                            {t("pma.Nueva etiqueta")}
                        </span>
                    </button>
                </div>
            )}
        </div>
    );
};
export default withTranslation()(ShowTags);
