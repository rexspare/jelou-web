import { PremiumFeaturesModal } from "@apps/settings/shared";
import { DeleteIcon, LeftArrow, MoreOptionsIcon } from "@apps/shared/icons";
import { Menu, Transition } from "@headlessui/react";
import Tippy from "@tippyjs/react";
import get from "lodash/get";
import toUpper from "lodash/toUpper";
import { useState } from "react";
import Avatar from "react-avatar";
import { useTranslation } from "react-i18next";
import Switch from "react-switch";
import "tippy.js/dist/tippy.css";
import DeleteBot from "./DeleteBot";
import SetToProduction from "./SetToProduction";

const ModelCard = (props) => {
    const {
        openComming,
        setOpenComming,
        deletePermission,
        showProductionModal,
        loading,
        deleteBot,
        botInProduction,
        handleChangeSw,
        bot,
        colours,
        renameRef,
        botType,
        goToBuilder,
        sendBotToProd,
        onCloseBot,
        closeModal,
        onConfirm,
        setDeleteBot,
        id,
    } = props;
    const { t } = useTranslation();
    const [isCopied, setIsCopied] = useState(false);

    // This is the function we wrote earlier
    async function copyTextToClipboard(text) {
        if ("clipboard" in navigator) {
            return await navigator.clipboard.writeText(text);
        } else {
            return document.execCommand("copy", true, text);
        }
    }
    // onClick handler function for the copy button
    const handleCopyClick = () => {
        // Asynchronously call copyTextToClipboard
        copyTextToClipboard(id)
            .then(() => {
                // If successful, update the isCopied state value
                setIsCopied(true);
                setTimeout(() => {
                    setIsCopied(false);
                }, 1500);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const CapitalizeToPascalCase = (word) => (word.match(/[a-zA-Z0-9]+/g) || []).map((w) => `${w.charAt(0).toUpperCase()}${w.slice(1)}`).join(" ");
    return (
        <div className="relative">
            <div className="m-0 w-full cursor-pointer p-0" onClick={() => goToBuilder()}>
                <section
                    className="group relative z-0 flex h-[18rem] min-h-[16.625rem] w-full flex-col rounded-xl border-3 border-transparent bg-white px-4 pt-8 pb-5 text-left hover:cursor-pointer hover:border-primary-200/15 hover:shadow-data-card
                    ">
                    <div className="z-10 mb-6 flex w-full">
                        <div className="flex flex-col">
                            <div className="flex ">
                                <div className="flex flex-col items-start">
                                    <span className={`relative mb-2 rounded-100 ${bot.imageUrl ? "border-1 border-gray-400 border-opacity-10" : ""}`}>
                                        <Avatar
                                            colors={colours}
                                            name={bot.name}
                                            size={"3.125rem"}
                                            fgColor="#31355C"
                                            round={true}
                                            textSizeRatio={2}
                                            className="font-bold"
                                            src={bot.imageUrl}
                                        />
                                    </span>
                                    <div className="flex flex-col items-start" ref={renameRef}>
                                        <span className="mb-3 flex h-12 items-center text-left text-lg font-bold leading-tight text-gray-610">
                                            {bot.name}
                                        </span>
                                        <span className="flex items-center text-15 font-semibold text-gray-610">
                                            {CapitalizeToPascalCase(bot.type)}
                                            <span className="pl-2">{botType[toUpper(bot.type)]}</span>
                                        </span>
                                        <span className="flex w-full items-start text-15 font-semibold text-gray-610">
                                            <span className=" w-[8%] pt-2">ID:</span>
                                            <span className="w-[15rem] overflow-hidden truncate pl-1 pt-2">{get(bot, "id", "")}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex w-full justify-between border-t-0.5 border-gray-400 border-opacity-15 pl-3 pr-4">
                        <div className="flex space-x-2 pt-4" onClick={(evt) => evt.stopPropagation()}>
                            <Tippy
                                theme="jelou"
                                content={!botInProduction ? t("setToProduction.productionTitle") : t("setToProduction.sandboxTitle")}>
                                <div className="flex items-center">
                                    <Switch
                                        id="prod"
                                        checked={botInProduction}
                                        onChange={handleChangeSw}
                                        onColor="#00B3C7"
                                        onHandleColor="#ffffff"
                                        uncheckedIcon={false}
                                        checkedIcon={false}
                                        boxShadow="0rem 0.063rem 0.313rem rgba(0, 0, 0, 0.6)"
                                        activeBoxShadow="0rem 0rem 0.063rem 0.625rem rgba(0, 0, 0, 0.2)"
                                        height={22}
                                        width={41}
                                        className="react-switch"
                                    />
                                    <label htmlFor="prod" className="cursor-pointer">
                                        {!bot.inProduction ? (
                                            <span className="inline-flex items-center rounded-full px-2.5  text-sm font-bold text-gray-400 text-opacity-75">
                                                {t("botsCard.sandbox")}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full px-2.5  text-sm font-bold text-primary-200">
                                                {t("botsCard.production")}
                                            </span>
                                        )}
                                    </label>
                                </div>
                            </Tippy>
                        </div>
                        <div className="pt-4">
                            {/* <Tippy theme="jelou" content={t("botsCard.Construir")} placement={"bottom"} touch={false}> */}
                            <LeftArrow className="mt-1 h-4 w-6" />
                            {/* </Tippy> */}
                        </div>
                    </div>
                </section>
                <Menu as="div" className="absolute top-0 right-0 z-0 mr-4 mt-2 flex flex-row items-center">
                    <Menu.Button as="button" className="h-9 w-7" onClick={(evt) => evt.stopPropagation()}>
                        <MoreOptionsIcon width="12" height="4" className="fill-current" />
                    </Menu.Button>
                    <Transition
                        as="section"
                        className={"absolute right-0 bottom-0"}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95">
                        <Menu.Items
                            as="ul"
                            onClick={(evt) => {
                                evt.stopPropagation();
                            }}
                            className="absolute right-0 z-120 -mt-2 flex w-36 flex-col items-center overflow-hidden rounded-10 bg-white shadow-menu">
                            <Menu.Item
                                as="li"
                                onClick={() => {
                                    handleCopyClick();
                                }}
                                className="flex w-full cursor-pointer items-start justify-start border-1 border-transparent border-b-gray-border py-2 px-[0.8rem] text-13 text-gray-400   hover:text-primary-200 focus:outline-none">
                                <div className="mr-[0.65rem]">
                                    {isCopied ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="h-5 w-5">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            className="h-5 w-5">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z"
                                            />
                                        </svg>
                                    )}
                                </div>
                                {t("bots.copy")}
                            </Menu.Item>
                            {deletePermission && (
                                <Menu.Item
                                    as="li"
                                    className="flex w-full cursor-pointer items-center justify-center border-1 border-transparent border-b-gray-border px-3 hover:bg-primary-200 hover:bg-opacity-10">
                                    <DeleteIcon width="30" height="18" />
                                    <button
                                        className="w-full py-2 pl-[0.5rem] pr-[1rem] text-left text-13 text-gray-400 hover:text-primary-200 focus:outline-none"
                                        onClick={() => {
                                            setDeleteBot(true);
                                        }}>
                                        {t("dataReport.delete")}
                                    </button>
                                </Menu.Item>
                            )}
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
            {deleteBot && <DeleteBot bot={bot} onConfirm={onConfirm} onClose={onCloseBot} loading={loading} />}
            {showProductionModal && (
                <SetToProduction bot={bot} state={botInProduction} onConfirm={sendBotToProd} onClose={closeModal} loading={loading} />
            )}
            {openComming ? (
                <Transition
                    show={openComming}
                    enter="transition ease-out duration-500"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-500"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95">
                    <PremiumFeaturesModal fromBots setOpen={setOpenComming} />
                </Transition>
            ) : null}
        </div>
    );
};

export default ModelCard;
