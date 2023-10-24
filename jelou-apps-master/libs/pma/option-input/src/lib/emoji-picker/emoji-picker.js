import React, { Fragment } from "react";
import Tippy from "@tippyjs/react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import { Popover, Transition } from "@headlessui/react";

import { EmojiIcon } from "@apps/shared/icons";

const EmojiPicker = (props) => {
    const { setShowEmoji, showEmoji, addEmoji } = props;
    return (
        <Popover className={"relative"}>
            <Tippy content={"Emoji"} placement={"top"} touch={false}>
                <Popover.Button className={" flex h-10 w-10 items-center"} onClick={() => setShowEmoji(!showEmoji)}>
                    <EmojiIcon className="fill-current text-gray-400" width="1.375rem" height="1.375rem" />
                </Popover.Button>
            </Tippy>
            <Transition
                as={Fragment}
                show={showEmoji}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Popover.Panel className="absolute bottom-[2.5rem] right-[1rem] z-120">
                    <style>
                        {`
                                em-emoji-picker {
                                    height: 28vh;
                                    min-height: 347px;
                                    max-height: 400px;
                                }
                            `}
                    </style>
                    <Picker
                        locale={"es"}
                        theme={"light"}
                        emojiButtonSize={"28"}
                        emojiSize={"18"}
                        maxFrequentRows={"2"}
                        data={data}
                        previewPosition={"none"}
                        onEmojiSelect={addEmoji}
                        onClickOutside={() => setShowEmoji(false)}
                    />
                </Popover.Panel>
            </Transition>
        </Popover>
    );
};

export default EmojiPicker;
