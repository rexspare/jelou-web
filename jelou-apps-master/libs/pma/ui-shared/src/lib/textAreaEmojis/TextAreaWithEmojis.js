import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Fragment, useRef, useState } from "react";
import TextareaAutosize from "react-autosize-textarea/lib";
import { withTranslation } from "react-i18next";

import { EmojiIcon } from "@apps/shared/icons";
import { Popover, Transition } from "@headlessui/react";
import Tippy from "@tippyjs/react";

const TextAreaWithEmojis = ({ t, handleChange, text, maxLength, setText }) => {
    const [showEmojis, setShowEmojis] = useState(false);
    const inputElement = useRef(null);

    const addEmoji = (e) => {
        let sym = e.unified.split("-");
        let codesArray = [];
        sym.forEach((el) => codesArray.push("0x" + el));
        let emoji = String.fromCodePoint(...codesArray);

        setText((preState) => preState + " " + emoji + " ");
        setShowEmojis(false);
        inputElement.current.focus();
    };

    return (
        <div className="flex w-full items-center rounded-10 bg-[#f3f4f6] p-2">
            <TextareaAutosize
                style={{ minHeight: "3rem" }}
                autoFocus
                className="min-h-[3rem] w-full resize-none overflow-y-auto border-transparent bg-transparent pr-4 align-middle text-15 font-medium leading-normal text-gray-400 placeholder:text-gray-400 placeholder:text-opacity-75 focus:border-transparent focus:ring-transparent"
                placeholder={t("Escribe un mensaje")}
                onChange={handleChange}
                value={text}
                maxLength={maxLength}
                ref={inputElement}
            />

            <Popover className={"relative"}>
                <Tippy content={"Emoji"} placement={"top"} touch={false}>
                    <Popover.Button className={" flex h-10 w-10 items-center"} onClick={() => setShowEmojis(!showEmojis)}>
                        <EmojiIcon className="fill-current text-gray-400" width="1.375rem" height="1.375rem" />
                    </Popover.Button>
                </Tippy>
                <Transition
                    as={Fragment}
                    show={showEmojis}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Popover.Panel className="absolute bottom-[-3.75rem] right-[3.25rem] z-120">
                        <style>
                            {`
                                em-emoji-picker {
                                    height: 25vh;
                                    min-height: 280px;
                                    max-height: 400px;
                                }
                            `}
                        </style>
                        <style>
                            {`
                            @media screen and (min-width: 1024px) {
                                em-emoji-picker { 
                                    min-height: 230px; 
                                }
                            }
                            @media screen and (min-width: 1400px) {
                                em-emoji-picker { 
                                    min-height: 230px; 
                                }
                            }
                            @media screen and (min-width: 1401px) {
                                em-emoji-picker { 
                                    min-height: 280px; 
                                }
                            }
                        `}
                        </style>
                        <Picker
                            height={"235px"}
                            theme={"light"}
                            locale={"es"}
                            emojiButtonSize={"28"}
                            emojiSize={"18"}
                            maxFrequentRows={"2"}
                            data={data}
                            previewPosition={"none"}
                            onEmojiSelect={addEmoji}
                            onClickOutside={() => setShowEmojis(false)}
                        />
                    </Popover.Panel>
                </Transition>
            </Popover>
        </div>
    );
};

export default withTranslation()(TextAreaWithEmojis);
