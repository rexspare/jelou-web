import dayjs from "dayjs";
import Tippy from "@tippyjs/react";
import { useSelector } from "react-redux";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import get from "lodash/get";

import { HistoryEvent } from "./history-event";
import { CloseIcon, OperatorIcon1 } from "@apps/shared/icons";
import { useTranslation } from "react-i18next";

const EmailHistorySlideOver = (props) => {
    const { t } = useTranslation();
    const currentEmail = useSelector((state) => state.currentEmail);
    const { lifecycle, assignationFlow } = currentEmail;

    let [isOpen, setIsOpen] = useState(false);

    function closeModal() {
        setIsOpen(false);
    }

    function openModal() {
        setIsOpen(true);
    }

    return (
        <>
            <Tippy theme={"tomato"} content={t("pma.Historial")} arrow={false}>
                <button onClick={openModal}>
                    <svg width={20} height={17} fill="none">
                        <path
                            d="M19.131 6.445c-.64-.466-1.283-.93-1.93-1.387a1.58 1.58 0 0 0-.537-.254l.003-1.065V1.594C16.664.583 16.089.003 15.084.003 11.62-.002 8.154 0 4.692 0H1.627C1.226 0 .915.085.652.266.339.48.145.8.057 1.245c-.082.416-.058.868-.035 1.267.005.089.011.175.013.257.016.366.009.744.005 1.108-.002.192-.007.382-.007.573v8.258c0 .103-.002.209-.006.315-.017.61-.037 1.3.567 1.79.345.28.81.303 1.218.303h8.729c-.01.11-.021.22-.034.33-.045.397.088.651.42.806l.033.015h.172l.147-.062c.08-.035.16-.067.24-.104l.892-.405c.649-.295 1.296-.59 1.947-.88.39-.172.715-.437.972-.79 1.253-1.73 2.598-3.6 4.116-5.718.47-.664.351-1.378-.315-1.863Zm-7.014 5.353 2.038-2.816.884-1.222 2.234 1.606-2.928 4.064-.675-.483c-.507-.364-1.016-.726-1.524-1.086a.385.385 0 0 1-.046-.037c.005-.006.009-.015.018-.026Zm.988 2.313-1.373.626.144-1.507 1.229.881Zm-11.41-.144c-.444 0-.504-.063-.504-.515V1.656c0-.444.063-.506.513-.506H15.01c.45 0 .508.058.508.51v3.243c0 .076.003.153.01.233-.068.065-.13.14-.19.222l-.406.56a578.833 578.833 0 0 0-3.717 5.186 2.277 2.277 0 0 0-.369 1c-.077.619-.135 1.25-.194 1.859l-8.955.004Zm14.118-7.3.474-.66c.071-.1.123-.108.22-.037l1.794 1.294.194.14c.114.082.093.13.045.196-.157.222-.315.442-.48.67l-.117.163-2.24-1.61.11-.156Z"
                            fill="#727C94"
                            fillOpacity={1}
                        />
                        <path
                            d="M3.62 8.823c.145 0 .296-.073.43-.218.037-.039.071-.082.108-.123l1.96-2.305.038.035c.82.727 1.637 1.455 2.454 2.184.412.369.614.36.985-.035.934-.998 1.865-1.996 2.796-2.994v.649c0 .282-.002.565.005.847.006.276.194.477.457.492.274.017.478-.162.521-.451.01-.056.01-.114.01-.17V3.972c0-.054-.005-.108-.007-.166l-.011-.222h-2.898a5.674 5.674 0 0 0-.383.004c-.277.013-.483.218-.481.474.002.268.15.447.414.494.075.013.16.02.265.02h1.49l-2.71 2.89-.658-.584-1.908-1.694c-.13-.114-.285-.229-.466-.216-.183.013-.325.151-.437.285L4.093 7.02l-.412.483c-.13.153-.26.304-.388.462-.198.246-.192.545.015.73a.474.474 0 0 0 .313.128ZM9.612 11.634H3.653a.47.47 0 1 1 0-.94H9.61a.47.47 0 0 1 .002.94Z"
                            fill="#727C94"
                            fillOpacity={1}
                        />
                    </svg>
                </button>
            </Tippy>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="fixed inset-0 z-30 overflow-y-auto" onClose={closeModal}>
                    <div className="relative min-h-screen">
                        <Dialog.Overlay className="fixed inset-0" />

                        <Transition.Child
                            as={Fragment}
                            enter="transition-opacity duration-300 ease-in"
                            enterFrom="opacity-0 -right-0"
                            enterTo="opacity-100"
                            leave="transition-opacity duration-300 ease-in"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0 -right-28">
                            <div className="absolute top-0 right-0 my-2 mr-2 h-history w-72 transform overflow-y-scroll rounded-xl bg-white py-9 pl-8 pr-3 shadow-xl transition-all">
                                <Dialog.Title as="h3" className="mb-4 flex justify-between text-lg font-bold leading-6 text-primary-200">
                                    <span>Historial</span>
                                    <button onClick={closeModal}>
                                        <CloseIcon fill="#727C94" className="text-gray-400" width="0.953125em" height="0.954375em" />
                                    </button>
                                </Dialog.Title>

                                <Dialog.Description as="div">
                                    {Boolean(lifecycle) && lifecycle.length ? (
                                        [...lifecycle].reverse().map((eventLife, index) => {
                                            if (index === 0) {
                                                return (
                                                    <HistoryEvent key={eventLife.payload.operator.id + index} eventLife={eventLife} isLast={true} />
                                                );
                                            }

                                            return <HistoryEvent key={eventLife.payload.operator.id + index} eventLife={eventLife} isLast={false} />;
                                        })
                                    ) : (
                                        <p className="text-center text-gray-100">No hay eventos registrados</p>
                                    )}
                                    <section>
                                        <h3 className="my-4 text-lg font-bold leading-6 text-primary-200">Asignaciones</h3>
                                        {assignationFlow ? (
                                            [...assignationFlow].reverse().map((assignation, i) => {
                                                let payload;
                                                let email;
                                                let id;
                                                if (assignation.event === "CREATION") {
                                                    payload = get(assignation.payload, "creator", {});
                                                    email = get(payload, "email", "");
                                                } else {
                                                    payload = get(assignation, "payload", {});
                                                    email = get(payload.To, "email", "");
                                                    id = get(payload.To, "id", "");
                                                }
                                                const { createdAt } = assignation;
                                                const dateAt = dayjs(createdAt).format("DD/MM/YYYY");
                                                const timeAt = dayjs(createdAt).format("HH:mm:ss");

                                                return (
                                                    <aside key={id + i}>
                                                        <div className="ml-3">
                                                            <span className="text-15 text-gray-400 text-opacity-65">
                                                                <span className="text-gray-400">
                                                                    {assignation.event === "CREATION"
                                                                        ? t("pma.createdAndAssignedBy")
                                                                        : t("pma.assignedTo")}
                                                                </span>
                                                                <div className=" flex flex-row items-center gap-2 text-gray-400">
                                                                    <OperatorIcon1 />
                                                                    <span>{email}</span>
                                                                </div>
                                                            </span>
                                                            <span className="flex gap-2 text-xs font-normal text-gray-400">
                                                                <span>{dateAt}</span>
                                                                <span>{timeAt}</span>
                                                            </span>
                                                        </div>
                                                    </aside>
                                                );
                                            })
                                        ) : (
                                            <p className="text-center text-gray-100">No hay asignaciones registradas</p>
                                        )}
                                    </section>
                                </Dialog.Description>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};
export default EmailHistorySlideOver;
