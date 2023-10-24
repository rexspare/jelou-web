import { BeatLoader } from "react-spinners";
import { useTranslation } from "react-i18next";

import { CardWrapper } from "@apps/shared/common";
import { CheckCircleIcon, ClockIcon, ClosedMailIcon, NotAssignedicon, OpenMailIcon, ReloadIcon } from "@apps/shared/icons";

export function Stats(props) {
    const { t } = useTranslation();
    const {
        loading,
        newEmails,
        openEmails,
        totalEmails,
        solvedEmails,
        closedEmails,
        solutionTime,
        pendingEmails,
        firstResponseTime,
        notAssignedEmails,
    } = props;

    return (
        <div className="my-4 flex h-[17rem] w-full flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
            <CardWrapper
                className="flex h-full w-full flex-col justify-between overflow-hidden rounded-1 bg-white shadow-card md:w-[57%]"
                title={t("Emails")}>
                <div className="flex h-full">
                    <div className="flex w-[45%] items-center justify-center">
                        <div className="flex h-full flex-col justify-center space-y-3">
                            <div className="flex items-center justify-center space-x-1">
                                {loading ? (
                                    <div className="leading-9">
                                        <BeatLoader color={"#00B3C7"} size={10} />
                                    </div>
                                ) : (
                                    <dd id="card" className={`text-[2.25rem] font-bold leading-9 text-primary-200`}>
                                        {totalEmails}
                                    </dd>
                                )}
                            </div>
                            <dt className="text-lg font-bold text-gray-400">{t("monitoring.Totales")}</dt>
                        </div>
                    </div>

                    <div className="grid h-full flex-1 grid-cols-3 grid-rows-2 items-center justify-center">
                        <div className="flex items-center">
                            <dl className="flex space-x-1">
                                <div className="flex pt-[0.1313rem]">
                                    <ReloadIcon height="1rem" width="1.15rem" className="fill-current leading-normal text-yellow-1020" />
                                </div>

                                <div className="flex flex-col">
                                    <dt className="text-15 leading-5 text-yellow-1020">{t("monitoring.Nuevos")}</dt>
                                    {loading ? (
                                        <div className="flex leading-9">
                                            <BeatLoader color={"#D39C00"} size={10} />
                                        </div>
                                    ) : (
                                        <dd className="text-[1.375rem] font-bold leading-9 text-yellow-1020">{newEmails}</dd>
                                    )}
                                </div>
                            </dl>
                        </div>

                        <div className="flex items-center">
                            <dl className="flex space-x-1">
                                <div className="flex">
                                    <NotAssignedicon height="1rem" width="1.15rem" className="fill-current leading-normal text-red-950" />
                                </div>
                                <div className="flex flex-col">
                                    <dt className="text-15 leading-5 text-red-950">{t("monitoring.Sin Asignar")}</dt>
                                    {loading ? (
                                        <div className="flex leading-9">
                                            <BeatLoader color={"#a83927"} size={10} />
                                        </div>
                                    ) : (
                                        <dd className="text-[1.375rem] font-bold leading-9 text-red-950">{notAssignedEmails}</dd>
                                    )}
                                </div>
                            </dl>
                        </div>

                        <div className="flex items-center">
                            <dl className="flex space-x-1">
                                <div className="flex">
                                    <OpenMailIcon height="1rem" width="1.15rem" className="fill-current leading-normal text-gray-400" />
                                </div>
                                <div className="flex flex-col">
                                    <dt className="text-15 leading-5 text-gray-400">{t("monitoring.Abiertos")}</dt>
                                    {loading ? (
                                        <div className="flex leading-9">
                                            <BeatLoader color={"#727C94"} size={10} />
                                        </div>
                                    ) : (
                                        <dd className="text-[1.375rem] font-bold leading-9 text-gray-400">{openEmails}</dd>
                                    )}
                                </div>
                            </dl>
                        </div>

                        <div className="flex items-center">
                            <dl className="flex space-x-1">
                                <div className="flex">
                                    <ClockIcon height="1rem" width="1.15rem" className="fill-current leading-normal text-gray-400" />
                                </div>
                                <div className="flex flex-col">
                                    <dt className="text-15 leading-5 text-gray-400">{t("monitoring.Pendientes")}</dt>
                                    {loading ? (
                                        <div className="flex leading-9">
                                            <BeatLoader color={"#727C94"} size={10} />
                                        </div>
                                    ) : (
                                        <dd className="text-[1.375rem] font-bold leading-9 text-gray-400">{pendingEmails}</dd>
                                    )}
                                </div>
                            </dl>
                        </div>

                        <div className="flex items-center">
                            <dl className="flex space-x-1">
                                <div className="flex">
                                    <CheckCircleIcon height="1rem" width="1.15rem" className="fill-current leading-normal text-gray-400 " />
                                </div>
                                <div className="flex flex-col">
                                    <dt className="text-15 leading-5 text-gray-400">{t("monitoring.Resueltos")}</dt>
                                    {loading ? (
                                        <div className="flex leading-9">
                                            <BeatLoader color={"#727C94"} size={10} />
                                        </div>
                                    ) : (
                                        <dd className="text-[1.375rem] font-bold leading-9 text-gray-400">{solvedEmails}</dd>
                                    )}
                                </div>
                            </dl>
                        </div>

                        <div className="flex items-center">
                            <dl className="flex space-x-1">
                                <div className="flex">
                                    <ClosedMailIcon height="1rem" width="1.15rem" className="fill-current leading-normal text-gray-400" />
                                </div>
                                <div className="flex flex-col">
                                    <dt className="text-15 leading-5 text-gray-400">{t("monitoring.Cerrados")}</dt>
                                    {loading ? (
                                        <div className="flex leading-9">
                                            <BeatLoader color={"#727C94"} size={10} />
                                        </div>
                                    ) : (
                                        <dd className="text-[1.375rem] font-bold leading-9 text-gray-400">{closedEmails}</dd>
                                    )}
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </CardWrapper>

            <CardWrapper
                className="flex h-full w-full flex-col justify-between overflow-hidden rounded-1 bg-white shadow-card md:w-[43%]"
                title={t("monitoring.Tiempo de Atención")}>
                <div className="flex h-full">
                    <div className="flex flex-1 items-center justify-center">
                        <div className="flex h-full flex-col items-center justify-center space-y-3">
                            <div className="flex items-center justify-center space-x-1">
                                {loading ? (
                                    <div className="leading-9">
                                        <BeatLoader color={"#00B3C7"} size={10} />
                                    </div>
                                ) : (
                                    <dd id="card" className={`text-[2.25rem] font-bold leading-9 text-primary-200`}>
                                        {firstResponseTime}
                                    </dd>
                                )}
                            </div>

                            <dt className="text-lg font-bold text-gray-400">{t("monitoring.Primera Respuesta")}</dt>
                        </div>
                    </div>
                    <div className="grid w-[40%] grid-flow-row grid-cols-1 items-center justify-center">
                        <div className="flex items-center">
                            <dl className="flex flex-col">
                                <dt className="text-15 leading-5 text-gray-400">{t("monitoring.Tiempo de solución")}</dt>
                                {loading ? (
                                    <div className="leading-9">
                                        <BeatLoader color={"#727C94"} size={10} />
                                    </div>
                                ) : (
                                    <dd className="text-[1.375rem] font-bold text-gray-400">{solutionTime}</dd>
                                )}
                            </dl>
                        </div>
                    </div>
                </div>
            </CardWrapper>
        </div>
    );
}

export default Stats;
