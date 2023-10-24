import { Outlet } from "react-router-dom";
import Sidebar from "./SideBar";
import { ReconnectModal, Modal } from "@apps/shared/common";
import { useSelector } from "react-redux";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CloseIcon, DragIcon, IncognitoIcon, ShowHideIcon, WarningImpersonateIcon } from "@apps/shared/icons";
import { useTranslation } from "react-i18next";
import Draggable from "react-draggable";

let NO_AUTH_ROUTES = [
    "/login",
    "/recover-password",
    "/register",
    "/register-business",
    "/choose-channel",
    "/facebook-fan-page",
    "/login/",
    "/recover-password/",
    "/register/",
    "/register-business/",
    "/choose-channel/",
    "/facebook-fan-page/",
];

const Layout = (props) => {
    const { location, isTourOpen, setIsTourOpen, setShowCampaigns, steps } = props;
    const unauthorized = useSelector((state) => state.unauthorized);
    const userSession = useSelector((state) => state.userSession);
    const impersonate = localStorage.getItem("jwt-operator");
    const { t } = useTranslation();
    let [isOpen, setIsOpen] = useState(false);
    const [hiddenBadge, setHiddenBadge] = useState(false);
    const [positionX, setPositionX] = useState(0);
    const [positionY, setPositionY] = useState(0);

    function closeModal() {
        setIsOpen(false);
    }

    function openModal() {
        setIsOpen(true);
    }

    const stopImpersonate = () => {
        const url = window.location.origin;
        const website = `${url}/pma/chats`;
        const masterOperator = localStorage.getItem("jwt-operator");

        localStorage.setItem("jwt", masterOperator);
        localStorage.removeItem("jwt-operator");
        const impersonateCompany = localStorage.getItem("jwt-master");

        if (impersonateCompany) {
            return (window.location = "/monitoring/operators");
        }
        window.location.replace(website);
    };

    const handleStop = (evt) => {
        const { clientY, clientX } = evt;
        setPositionX(clientX);
        setPositionY(clientY);
    };

    const showBadge = () => {
        setHiddenBadge(false);

        const draggableBadge = document.getElementById("draggable-impersonate");
        draggableBadge.style.transform = `(${positionX}px, ${positionY}px)`;

        const standButton = document.getElementById("stand-by-impersonate");
        standButton.style.display = "none";
    };

    const hideImpersonateBadge = (evt) => {
        evt.stopPropagation();
        evt.preventDefault();
        setHiddenBadge(true);

        const standButton = document.getElementById("stand-by-impersonate");
        const draggableBadge = document.getElementById("draggable-impersonate");
        const transformStyle = draggableBadge.style.transform;
        const translate = transformStyle.split("(")[1].split(")")[0];
        const translateY = parseInt(translate.split(",")[1].slice(0, -2));

        if (translateY >= 0) {
            standButton.style.bottom = `0px`;
            standButton.style.top = `unset`;
        } else {
            standButton.style.top = `${positionY - 60}px`;
        }
        standButton.style.display = "flex";
    };

    return (
        <div className="flex-1">
            <Sidebar steps={steps} location={location} isTourOpen={isTourOpen} setIsTourOpen={setIsTourOpen} setShowCampaigns={setShowCampaigns} />
            <Outlet />
            {!NO_AUTH_ROUTES.includes(location.pathname) && !location.pathname.includes("new-password") && unauthorized && (
                <Modal>
                    <ReconnectModal />
                </Modal>
            )}
            {impersonate && (
                <>
                    <Draggable onStop={handleStop} bounds={"parent"}>
                        <div id="draggable-impersonate" className={`fixed bottom-0 right-0 z-40 items-center justify-center pb-8 pr-8 ${hiddenBadge ? "hidden" : "flex"}`}>
                            <div
                                type="button"
                                className="focus-visible:ring-2 flex items-center space-x-4 rounded-lg bg-black bg-opacity-40 px-4 py-2 text-15 font-normal text-white focus:outline-none focus-visible:ring-white focus-visible:ring-opacity-75"
                            >
                                <DragIcon className="cursor-grab " width="1.5625rem" height="1.5625rem" />
                                <span className="flex cursor-auto flex-col tracking-wide">
                                    <span>{t("pma.Impersonando a")}</span>
                                    <span className="w-40 truncate font-semibold">{userSession.names}</span>
                                </span>
                                <button onClick={openModal} className="rounded-full bg-primary-200 p-3 font-semibold tracking-wide text-white hover:bg-primary-100">
                                    {t("pma.Dejar de impersonar")}
                                </button>
                                <button onClick={hideImpersonateBadge}>
                                    <ShowHideIcon width="1.5rem" />
                                </button>
                            </div>
                        </div>
                    </Draggable>
                    <button
                        id="stand-by-impersonate"
                        onClick={showBadge}
                        className="fixed bottom-0 right-0 z-40 mb-18 hidden h-14 items-center justify-center rounded-bl-xl rounded-tl-xl bg-black bg-opacity-40 p-4 transition delay-200 ease-in"
                    >
                        <svg width="1rem" height="1rem" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute right-0 top-0 m-1">
                            <circle cx="7.99674" cy="8.00004" r="6.66667" fill="white" />
                            <path
                                d="M7.99992 1.33337C4.33325 1.33337 1.33325 4.33337 1.33325 8.00004C1.33325 11.6667 4.33325 14.6667 7.99992 14.6667C11.6666 14.6667 14.6666 11.6667 14.6666 8.00004C14.6666 4.33337 11.6666 1.33337 7.99992 1.33337ZM7.99992 11.3334C7.59992 11.3334 7.33325 11.0667 7.33325 10.6667C7.33325 10.2667 7.59992 10 7.99992 10C8.39992 10 8.66658 10.2667 8.66658 10.6667C8.66658 11.0667 8.39992 11.3334 7.99992 11.3334ZM8.66658 8.00004C8.66658 8.40004 8.39992 8.66671 7.99992 8.66671C7.59992 8.66671 7.33325 8.40004 7.33325 8.00004V5.33337C7.33325 4.93337 7.59992 4.66671 7.99992 4.66671C8.39992 4.66671 8.66658 4.93337 8.66658 5.33337V8.00004Z"
                                fill="#F12B2C"
                            />
                        </svg>

                        <IncognitoIcon className="items-center text-white" width="1.5rem" height="1.5rem" fill="currentColor" />
                    </button>
                </>
            )}

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-100" onClose={closeModal}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="relative w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 px-10 text-left align-middle shadow-xl transition-all">
                                    <button className="absolute right-0 top-0 m-8 cursor-pointer fill-current text-gray-480" onClick={closeModal}>
                                        <CloseIcon width="1.2rem" height="1.2rem" />
                                    </button>
                                    <div className="mt-2">
                                        <WarningImpersonateIcon />
                                        <p className="my-4 items-baseline text-xl text-yellow-1040">
                                            {t("pma.Estás seguro de")}
                                            <span className="font-bold"> {t("pma.dejar de impersonar?")}</span>
                                        </p>
                                    </div>

                                    <div className="my-4">
                                        <p className="text-15 text-gray-400">
                                            {t("pma.Volverás a la plataforma para navegar")} <span className="font-bold"> {t("pma.desde tu perfil")}</span>
                                        </p>
                                    </div>
                                    <div className="my-2 flex items-center justify-between text-sm font-bold">
                                        <button type="button" className="p-3 text-primary-200" onClick={closeModal}>
                                            {t("buttons.cancel")}
                                        </button>
                                        <button onClick={stopImpersonate} className="rounded-full bg-primary-200 p-3 px-5 text-white">
                                            {t("buttons.continue")}
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default Layout;
