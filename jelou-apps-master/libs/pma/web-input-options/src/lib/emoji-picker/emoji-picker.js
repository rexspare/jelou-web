import React from "react";
import Tippy from "@tippyjs/react";
import { Picker } from "emoji-mart";
import { Transition } from "@headlessui/react";

import { EmojiHappy } from "@apps/shared/icons";

// You might be tempted to wrap this component in a headless menu, we tried that and had problems with the focus.
// What do I mean by this ? That when the component is closed the writing area should be focus and because of problems with this headless ui menu the focus is not triggered.

const EmojiPicker = (props) => {
    const { setShowEmoji, showEmoji, addEmoji } = props;
    return (
        <div>
            <Tippy content={"Emoji"} placement={"top"} touch={false}>
                <div className="relative flex items-center">
                    <button onClick={() => setShowEmoji(!showEmoji)}>
                        <div className="hidden items-center outline-none mid:flex">
                            <div className="mx-auto flex h-6  w-6 items-center rounded-full p-[1px] hover:bg-primary-350">
                                <EmojiHappy className="text-gray-400 hover:text-primary-200" width="100%" height="100%" />
                            </div>
                        </div>
                    </button>
                </div>
            </Tippy>
            <Transition
                show={showEmoji}
                as="div"
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
                className="absolute bottom-[2.5rem] !z-120"
                style={styles.emojiPicker}>
                <Picker
                    set="apple"
                    title=""
                    onSelect={addEmoji}
                    emojiTooltip={false}
                    showPreview={false}
                    showSkinTones={false}
                    emoji="blush"
                    i18n={{ search: "Buscar", categories: { search: "Resultado", recent: "Recientes" } }}
                />
            </Transition>
        </div>
    );
};

export default EmojiPicker;

const styles = {
    container: {
        padding: 20,
        borderTop: "1px #4C758F solid",
        marginBottom: 20,
    },
    form: {
        display: "flex",
    },
    input: {
        color: "inherit",
        background: "none",
        outline: "none",
        border: "none",
        flex: 1,
        fontSize: 16,
    },
    getEmojiButton: {
        cssFloat: "right",
        border: "none",
        margin: 0,
        cursor: "pointer",
    },
    emojiPicker: {
        position: "absolute",
        // backgroundColor: "white",
        // bottom: 0,
        // left: 0,
        // cssFloat: "right",
        // marginLeft: "200px",
        zindex: "120",
    },
};
