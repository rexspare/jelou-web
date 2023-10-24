import { useRef, useState } from "react";
import { CloseIcon, JelouLogoIcon } from "@apps/shared/icons";
import isEmpty from "lodash/isEmpty";
import { BeatLoader } from "react-spinners";
import { useOnClickOutside } from "@apps/shared/hooks";
import { useTranslation } from "react-i18next";
import { Menu, Listbox, Combobox } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { useSelector } from "react-redux";
import { getTitleBotColor, getTypeIcon } from "../helpers/helpers";
import Tippy from "@tippyjs/react";
const DuplicateBotConfigModal = (props) => {
    const { setOpenDuplicateModal, botToDuplicate, setBotToDuplicate, setOpenDuplicateConfirmation } = props;
    const ref = useRef();
    const { t } = useTranslation();

    const bots = useSelector((state) => state.bots);
    const DEFAULT_LOGO = "https://s3-us-west-2.amazonaws.com/cdn.devlabs.tech/bsp-images/icono_bot.svg";

    const [comboboxQuery, setComboboxQuery] = useState("");

    const filteredBots =
        comboboxQuery === ""
            ? bots
            : bots.filter((bot) => {
                  return bot.name.toLowerCase().includes(comboboxQuery.toLowerCase());
              });

    useOnClickOutside(ref, () => setOpenDuplicateModal(false));
    return (
        <div className="fixed inset-x-0 top-0 z-50 overflow-auto sm:inset-0 sm:flex sm:items-center sm:justify-center">
            <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 z-20 bg-black bg-opacity-25" />
            </div>
            <div className="min-w-125 transform rounded-lg bg-white px-6 pt-5 pb-4 shadow-modal transition-all" ref={ref}>
                <div className="mb-3 flex items-center justify-between pb-4">
                    <div className="flex items-center">
                        <div className={`bg-primary mr-2 flex items-center justify-center rounded-full md:mr-4`}>
                            <JelouLogoIcon width="1.875rem" height="2.5rem" />
                        </div>
                        <div className="max-w-md text-xl font-bold text-gray-400">{t("¿Desea replicar esta configuracion?")}</div>
                    </div>
                    <span
                        Click={() => {
                            console.log("close");
                        }}
                    >
                        <CloseIcon className="cursor-pointer fill-current text-gray-400 hover:text-gray-400" width="1rem" height="1rem" />
                    </span>
                </div>
                <div className="relative">
                    <div>
                        <div className="mx-auto w-full max-w-sm px-5 pb-5">
                            <div className="mt-2">
                                <div className="mb-4">
                                    <div className="flex items-center text-center text-lg text-gray-400 text-opacity-75">
                                        <p className="mr-2">BOT:</p>
                                        <Combobox as="div" className={"relative w-full"} value={botToDuplicate.name} onChange={setBotToDuplicate}>
                                            <div className="relative flex w-full items-center">
                                                <Combobox.Input
                                                    className="border flex h-[2.1875rem] w-full select-none items-center justify-between rounded-[0.5rem] border-transparent bg-[rgb(242,247,253)] text-sm text-gray-400 ring-transparent focus:border-transparent focus:outline-none focus:ring-transparent"
                                                    onChange={(event) => setComboboxQuery(event.target.value)}
                                                />
                                                <Combobox.Button className={"absolute right-0 mr-2"}>
                                                    <ChevronDownIcon className=" h-5 w-5 text-gray-400" aria-hidden="true" />
                                                </Combobox.Button>
                                            </div>
                                            {/* <p className={`pl-2 ${botToDuplicate ? "font-bold text-gray-400" : "text-gray-400 text-opacity-50"}`}>
                                                    {botToDuplicate ? botToDuplicate : t("Seleccione un bot")}
                                                </p> */}
                                            {/* </Combobox.Input> */}
                                            <Combobox.Options className=" absolute mt-2 max-h-xxsm w-full overflow-y-auto rounded-[.5rem] bg-[rgb(242,247,253)] shadow-menu">
                                                {filteredBots.map((bot, index) => (
                                                    <Tippy theme={"jelou"} className="h-full" content={bot.name} placement={"right"} touch={false}>
                                                        <Combobox.Option
                                                            key={index}
                                                            value={bot}
                                                            className="flex w-full cursor-pointer items-center  border-b-2 border-gray-200 p-2  px-5 py-3 text-gray-400 hover:bg-primary-200 hover:bg-opacity-10 hover:text-primary-200"
                                                        >
                                                            {({ active }) => (
                                                                <>
                                                                    <img className="mr-4 h-full w-12 rounded-full object-contain" src={bot.imageUrl ? bot.imageUrl : DEFAULT_LOGO} alt="Logo_image" />
                                                                    <div className="w-full overflow-x-hidden">
                                                                        <p className="truncate text-left text-base font-bold text-gray-400">{bot.name}</p>
                                                                        <div className="flex items-center">
                                                                            <div>{getTypeIcon(bot.type)}</div>
                                                                            <p className={`ml-2 text-15 font-bold capitalize ${getTitleBotColor(bot.type)}`}>{bot.type}</p>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </Combobox.Option>
                                                    </Tippy>
                                                ))}

                                                {/* ... */}
                                            </Combobox.Options>
                                        </Combobox>
                                    </div>
                                </div>

                                <div className="flex w-full flex-col justify-center pt-5 md:flex-row">
                                    <div className="mt-6 mr-3 flex text-center md:mt-0">
                                        <button
                                            type="submit"
                                            className="w-32 rounded-20 border-1 border-transparent bg-gray-10 p-2 text-base font-bold text-gray-400 focus:outline-none"
                                            onClick={() => setOpenDuplicateModal(false)}
                                        >
                                            {t("botsComponentDelete.cancel")}
                                        </button>
                                    </div>
                                    <div className="mt-6 flex text-center md:mt-0">
                                        <button type="submit" className="button-primary w-32" onClick={() => setOpenDuplicateConfirmation(true)}>
                                            {/* {loading ? <BeatLoader color={"white"} size={"0.625rem"} /> : `${t("botsComponentDelete.delete2")}`} */}
                                            {`${t("botsComponentDelete.delete2")}`}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DuplicateBotConfigModal;
