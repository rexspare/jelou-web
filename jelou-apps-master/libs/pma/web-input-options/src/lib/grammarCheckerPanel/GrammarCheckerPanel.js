import { AbcIcon, CloseIcon, OctagonalWarningIcon } from "@apps/shared/icons";
import { Popover, Transition } from "@headlessui/react";
import Tippy from "@tippyjs/react";
import { useState } from "react";
import { usePopper } from "react-popper";

const GrammarCheckerPanel = (props) => {
    const { referenceElement, t } = props;

    const [popperElement, setPopperElement] = useState();

    const { styles, attributes } = usePopper(referenceElement, popperElement);

    const thereIsGrammarError = true;

    return (
        <Popover as="div">
            <Tippy content={t("Ortografía")} touch={false}>
                <Popover.Button className="flex h-full items-center hover:cursor-pointer">
                    <div className=" h-6 w-6 cursor-pointer select-none rounded-full hover:bg-primary-350  ">
                        <AbcIcon className="fill-current text-gray-400 hover:text-primary-200" goodGrammar={true} height="90%" witdh={"90%"} />
                    </div>
                </Popover.Button>
            </Tippy>
            <Transition
                as="Fragment"
                enter="transition duration-150 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0">
                <Popover.Panel
                    ref={setPopperElement}
                    style={{ ...styles.popper }}
                    className={"w-[98%] !translate-x-[0.5rem] !-translate-y-[7rem] rounded-xl shadow-boxCentered"}
                    {...attributes.popper}>
                    <div className="w-full rounded-xl bg-white ">
                        <header
                            className={`mb-5 flex items-center justify-between rounded-t-xl ${
                                thereIsGrammarError ? "bg-[#FDEFED]" : "bg-primary-600"
                            }  py-2 px-6`}>
                            <div className="flex items-center gap-3">
                                <OctagonalWarningIcon className={"text-primary-200"} width={"1.2rem"} />
                                <div className="max-w-56 md:max-w-128 truncate pr-3 text-base font-semibold  text-red-1050 ">
                                    {t("Corrige la ortografía")}
                                </div>
                            </div>
                            <span
                            //  onClick={() => onClose()}
                            >
                                <CloseIcon className="cursor-pointer fill-current text-gray-400" width="0.8rem" height="0.8rem" />
                            </span>
                        </header>
                        <div className="px-6">
                            <p className="text-sm text-gray-610">
                                lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, diam quis commodo vulputate, lorem ipsum dolor
                                sit amet, consectetur adipiscing elit. Sed euismod, diam quis commodo vulputate, lorem ipsum dolor sit amet,
                                consectetur adipiscing elit. Sed euismod, diam quis commodo vulputate, lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Sed euismod, diam quis commodo vulputate, lorem
                            </p>
                        </div>
                        <footer className="flex items-center justify-end px-6 py-4">
                            <div className="flex gap-2">
                                <button className="rounded-xl bg-gray-34 py-2 px-3 text-sm font-semibold text-gray-610">Omitir</button>
                                <button className="flex rounded-xl border-default bg-primary-200  py-2 px-3 text-sm font-semibold text-white">
                                    <span>Corregir</span>
                                </button>
                            </div>
                        </footer>
                    </div>
                </Popover.Panel>
            </Transition>
        </Popover>
    );
};

export default GrammarCheckerPanel;
