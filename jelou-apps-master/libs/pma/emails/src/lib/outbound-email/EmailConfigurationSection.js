import { Listbox, Menu, Transition } from "@headlessui/react";
import dayjs from "dayjs";
import isEmpty from "lodash/isEmpty";
import React, { useEffect, useRef, useState } from "react";
import SelectSearch from "react-select-search";
import Fuse from "fuse.js";
import { useDispatch, useSelector } from "react-redux";
import { JelouApiPma } from "@apps/shared/modules";
import { setTags } from "@apps/redux/store";
// import { setTags } from "actions/tags";
import get from "lodash/get";
import first from "lodash/first";
import { usePopper } from "react-popper";
import Tippy from "@tippyjs/react";
import { ShowTags, Tag, PeriodPicker } from "@apps/pma/ui-shared";
import { CalendarIcon, CloseIcon, DownIcon, PlusIcon1, RightIcon, StarFillIcon, StarIcon } from "@apps/shared/icons";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { useOnClickOutside } from "@apps/shared/hooks";

const EmailConfigurationSection = (props) => {
    const {
        emailsTeams,
        company,
        setEmailAssignation,
        operators,
        changeAssignation,
        setChangeAssignation,
        priorityArray,
        t,
        outboundDueDate,
        setOutboundDueDate,
        settingFavorite,
        isFavoriteOutbound,
        handleChangeAssignation,
        handleChangeTypeAssignation,
        handleSaveAssignationType,
        emailPriority,
        setEmailPriority,
        emailAssignation,
        assignationType,
        chatTags,
        setChatTags,
    } = props;

    const [viewTag, setViewTag] = useState(false);
    const [tag, setTag] = useState("");
    const [createTagFlag] = useState(false);
    const [addTag, setAddTag] = useState(false);
    const [showDateMenu, setShowDateMenu] = useState(false);
    const [referenceElement, setReferenceElement] = useState(null);
    const [popperElement, setPopperElement] = useState(null);
    const userSession = useSelector((state) => state.userSession);
    const tags = useSelector((state) => state.tags);

    const myOperatorId = get(userSession, "operatorId", null);

    const dispatch = useDispatch();

    const assignationTypeOptions = [
        {
            value: "operator",
            name: "Operador",
        },
        {
            value: "team",
            name: "Equipo",
        },
    ];

    const ref1 = useRef(null);

    useOnClickOutside(ref1, () => setShowDateMenu(false));

    const { styles, attributes } = usePopper(referenceElement, popperElement, {
        placement: "left",
        modifiers: [
            {
                name: "offset",
                options: {
                    offset: [0, 10],
                },
            },
        ],
    });

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

    const addTagChat = (tag) => {
        const tagObj = { name: tag.name, color: tag.color, id: tag.id };
        const updateChatTagsId = tagsInfo.map((value) => {
            return value.id;
        });

        const updateChatTags = tagsInfo;
        let repetido = false;
        updateChatTagsId.forEach((tagId) => {
            if (tagId === tag.id) repetido = true;
        });

        if (!repetido) {
            updateChatTags.push(tagObj);
        }
        setChatTags(updateChatTags);
    };

    const getTagsInfo = () => {
        let objs = tags.filter((el) => {
            if (chatTags.includes(el.id)) {
                return el;
            }
            if (chatTags.some((tag) => tag.id === el.id)) {
                return el;
            }
        });

        return objs;
    };

    let tagsInfo = !isEmpty(tags) && getTagsInfo();

    const getTags = () => {
        const companyId = company.id;

        JelouApiPma.get(`/v1/company/${companyId}/tags`)
            .then((res) => {
                const tagsArray = get(res, "data.data", []);
                dispatch(setTags(tagsArray));
            })
            .catch((err) => {
                console.log("=== ERROR", err);
            });
    };

    const restartEmailAssignation = () => {
        setEmailAssignation(myOperatorId);
        handleChangeTypeAssignation("operator");
    };

    useEffect(() => {
        if (changeAssignation) {
            if (assignationType === "team") {
                setEmailAssignation(first(emailsTeams).value);
            } else {
                setEmailAssignation(myOperatorId);
            }
        }
    }, [changeAssignation, assignationType]);

    useEffect(() => {
        getTags();
    }, []);

    const removeTag = (tagId) => {
        const updateChatTags = chatTags.filter((tag) => {
            if (tag.id !== tagId) return true;
            else return false;
        });
        setChatTags(updateChatTags);
    };

    return (
        <div className="w-68">
            <div className="flex w-[17rem] flex-col px-3">
                <div className="border-b-0.5 border-[#E8EAEE] px-2 pt-3 pb-4">
                    <h3 className="text-sm font-bold text-primary-200">{t("pma.emailConfig")}</h3>
                    <div className="flex flex-row justify-between py-2 text-gray-400">
                        <div className="flex flex-row">
                            <span className="flex items-center leading-normal text-gray-400">
                                <button className="flex border-transparent" onClick={() => setViewTag(!viewTag)}>
                                    <span className="text-sm font-bold">{t("pma.tags")}</span>
                                    {` (${chatTags.length})`}
                                    {viewTag ? (
                                        <DownIcon
                                            className="select-none fill-current pb-[0.22rem] text-gray-400 outline-none"
                                            width="1.25rem"
                                            height="1.25rem"
                                        />
                                    ) : (
                                        <RightIcon
                                            className="select-none fill-current pb-[0.18rem] text-gray-400 outline-none"
                                            width="1.25rem"
                                            height="1.25rem"
                                        />
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
                                    leaveTo="opacity-0">
                                    <Menu.Items className="border-11 absolute top-0 right-0 z-100 mt-8 w-56 rounded-lg bg-white p-4 shadow-normal">
                                        <ShowTags
                                            searchTag={searchTag}
                                            addTag={addTag}
                                            tagsArray={tags}
                                            addTagChat={addTagChat}
                                            chatTags={tagsInfo}
                                            tag={tag}
                                        />
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        </div>
                    </div>
                    {chatTags && (
                        <div className={`xxl:max-h-24 max-h-16 ml-2 flex flex-wrap-reverse gap-1 space-y-2 overflow-x-auto px-2`}>
                            {!viewTag &&
                                chatTags.map((tag, index) => {
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
                                chatTags.map((tag, index) => {
                                    return (
                                        <div className="mr-1 h-6 flex-none" key={index}>
                                            <Tag tag={tag} removeTag={removeTag} />
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                </div>
                <div className="flex flex-col border-b-0.5 border-[#E8EAEE] px-1 py-1">
                    <h3 className="text-ellipsis py-2 px-1 text-sm font-bold text-gray-400">
                        {t("pma.assignTo")}
                        <span className="pl-1 font-normal">{assignationType === "operator" ? "Operador" : "Equipo"}</span>
                    </h3>
                    <div className="flex space-x-1">
                        {!changeAssignation ? (
                            <div className="w-full rounded-3 border-default border-[#DCDEE4] p-2">
                                <div className="relative rounded-3 bg-[#F2F7FD] ">
                                    <SelectSearch
                                        placeholder="Seleccione"
                                        className="moduleSelect"
                                        search
                                        options={assignationType === "operator" ? operators : emailsTeams}
                                        onChange={handleChangeAssignation}
                                        value={emailAssignation}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col space-y-2 rounded-3 border-default border-[#DCDEE4] p-2">
                                <div className="flex items-center space-x-2">
                                    <span className="text-gray-400">{t("pma.assignBy")}</span>

                                    <div className="relative flex-1 rounded-3 bg-[#F2F7FD]">
                                        <SelectSearch
                                            className="moduleSelect "
                                            placeholder="Seleccione"
                                            search
                                            options={assignationTypeOptions}
                                            onChange={handleChangeTypeAssignation}
                                            value={assignationType}
                                        />
                                    </div>
                                </div>
                                <div className="relative flex-1 rounded-3 bg-[#F2F7FD]">
                                    <SelectSearch
                                        className="moduleSelect "
                                        search
                                        placeholder="Seleccione"
                                        options={assignationType === "operator" ? operators : emailsTeams}
                                        onChange={handleChangeAssignation}
                                        value={emailAssignation}
                                    />
                                </div>
                            </div>
                        )}
                        {!changeAssignation && (
                            <Tippy theme={"tomato"} content={t("Restablecer")} touch={false} arrow={false}>
                                <span>
                                    <button
                                        onClick={() => {
                                            restartEmailAssignation();
                                        }}>
                                        <CloseIcon className="cursor-pointer fill-current text-gray-400" width="0.6rem" height="1rem" />
                                    </button>
                                </span>
                            </Tippy>
                        )}
                    </div>
                    <div className="flex flex-col">
                        {!changeAssignation ? (
                            <button onClick={() => setChangeAssignation(true)} className="flex px-1 py-3 text-sm font-bold text-primary-200">
                                {`+ ${t("pma.changeAssignation")}`}
                            </button>
                        ) : (
                            <button
                                className="hover:bg-primary-light my-2 flex items-center justify-center self-end rounded-full border-transparent bg-primary-200 px-5 py-2 outline-none focus:outline-none"
                                onClick={() => handleSaveAssignationType()}>
                                <span className=" flex items-center justify-center font-bold text-white">{t("pma.save")}</span>
                            </button>
                        )}
                    </div>
                </div>
                <div className="relative flex flex-col px-1 pt-3 pb-2">
                    <h3 className="px-1 pb-2 text-sm font-bold text-gray-400">{t("pma.priority")}</h3>
                    <div className="">
                        <Listbox>
                            <Listbox.Button className="border flex h-[2.1875rem] w-full select-none items-center justify-between rounded-[0.5rem] border-transparent bg-[rgb(242,247,253)]  text-gray-400 ring-transparent focus:border-transparent focus:outline-none focus:ring-transparent">
                                <div className="flex items-center">
                                    <span className="mx-2">{emailPriority.icon}</span>
                                    <span className="text-sm capitalize text-gray-400">{emailPriority.name}</span>
                                </div>
                                <ChevronDownIcon className="left-0 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                            </Listbox.Button>
                            <Listbox.Options className="absolute z-120 mt-2 w-full overflow-hidden rounded-[.5rem] bg-white shadow-menu">
                                {priorityArray &&
                                    priorityArray.map((item, index) => {
                                        return (
                                            <Listbox.Option className="" key={index}>
                                                {({ active, selected }) => (
                                                    <div
                                                        className={`flex  cursor-pointer items-center space-x-3 border-b-[0.5px] border-[#A6B4D0] border-opacity-25 p-2 px-2 text-gray-400 hover:bg-primary-200 hover:bg-opacity-10 hover:text-primary-200`}
                                                        key={index}
                                                        onClick={(e) => setEmailPriority(item)}>
                                                        <span className="ml-1">{item.icon}</span>
                                                        <p className="">{item.name}</p>
                                                    </div>
                                                )}
                                            </Listbox.Option>
                                        );
                                    })}
                            </Listbox.Options>
                        </Listbox>
                    </div>
                </div>
                <div className="relative px-1 pt-2 pb-3">
                    <h3 className="px-1 pb-2 text-sm font-bold text-gray-400">{t("pma.expirationDate")}</h3>
                    <div ref={ref1}>
                        <button
                            ref={setReferenceElement}
                            className={`relative flex h-[2.0625rem] w-full select-none items-center justify-between space-x-2 rounded-[0.5rem] border-transparent bg-[rgb(242,247,253)] px-2 text-sm  text-gray-400 disabled:cursor-not-allowed`}
                            onClick={() => {
                                setShowDateMenu(!showDateMenu);
                            }}>
                            <div className="flex items-center space-x-2">
                                <CalendarIcon height="1.2rem" width="1.2rem" className={`fill-current `} />
                                <p className={``}>
                                    {!outboundDueDate || isEmpty(outboundDueDate) ? (
                                        <span>{t("pma.Seleccione una fecha")}</span>
                                    ) : (
                                        <span>{dayjs(outboundDueDate).locale("es").format("DD MMMM YY")} </span>
                                    )}
                                </p>
                            </div>
                            <ChevronDownIcon className="left-0 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                        </button>
                        <Transition
                            show={showDateMenu}
                            enter="transition ease-out duration-200"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                            className="absolute z-100">
                            <PeriodPicker
                                styles={styles}
                                attributes={attributes}
                                setShowMenu={setShowDateMenu}
                                expirationDate={null}
                                setDueDate={setOutboundDueDate}
                                setPopperElement={setPopperElement}
                            />
                        </Transition>
                    </div>
                </div>
                <div className="relative px-1 pt-2 pb-3">
                    <div className="flex items-center space-x-2 px-1 " onClick={() => settingFavorite()}>
                        <button className="disabled:cursor-not-allowed" id="favorite">
                            {isFavoriteOutbound ? (
                                <StarFillIcon height="1.2rem" width="1.2rem" className="fill-current text-[#D39C00]" />
                            ) : (
                                <StarIcon height="1.2rem" width="1.2rem" className={`fill-current text-gray-400 `} />
                            )}
                        </button>
                        <span onClick={() => settingFavorite()} className="text-sm font-bold text-gray-400 hover:cursor-pointer">
                            {t("pma.favorite")}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailConfigurationSection;
