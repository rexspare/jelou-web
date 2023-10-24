import { BeatLoader } from "react-spinners";
import { useTranslation } from "react-i18next";

import { CardWrapper } from "@apps/shared/common";

export function Stats(props) {
    const { t } = useTranslation();
    const {
        ifKia,
        loading,
        totalConversations,
        actualConversation,
        actualConversationNotReplied,
        attendedConversation,
        transferedConversation,
        notAttendedConversation,
        avgOperatorReply,
        averageReply,
        avgConversationTime,
    } = props;

    return (
        <div className="my-4 flex h-[17rem] w-full flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
            <CardWrapper
                className="flex h-full w-full flex-col justify-between overflow-hidden rounded-1 bg-white shadow-card md:w-[57%]"
                title={t("monitoring.Mensajes privados")}>
                <div className="flex h-full">
                    <div className="flex w-1/2 items-center justify-center">
                        <div className="flex h-full flex-col justify-center space-y-3">
                            <div className="flex items-center justify-center space-x-1">
                                {loading ? (
                                    <div className="leading-9">
                                        <BeatLoader color={"#00B3C7"} size={10} />
                                    </div>
                                ) : (
                                    <dd id="card" className={`text-[2.25rem] font-bold leading-9 text-primary-200`}>
                                        {totalConversations}
                                    </dd>
                                )}
                            </div>

                            <dt className="text-lg font-bold text-gray-400">{t("monitoring.Totales")}</dt>
                        </div>
                    </div>
                    <div className={`grid h-full w-1/2 ${ifKia ? "grid-cols-2" : "grid-cols-3"} grid-rows-2 items-center justify-center`}>
                        {!ifKia && (
                            <div className="flex items-center">
                                <dl className="flex flex-col">
                                    <dt className="text-15 leading-5 text-gray-400">{t("monitoring.Actuales")}</dt>
                                    {loading ? (
                                        <div className="leading-9">
                                            <BeatLoader color={"#727C94"} size={10} />
                                        </div>
                                    ) : (
                                        <dd className="text-[1.375rem] font-bold leading-9 text-gray-400">{actualConversation}</dd>
                                    )}
                                </dl>
                            </div>
                        )}
                        <div className="flex items-center">
                            <dl className="flex flex-col">
                                <dt className="text-15 leading-5 text-gray-400">{t("monitoring.Atendidos")}</dt>
                                {loading ? (
                                    <div className="leading-9">
                                        <BeatLoader color={"#727C94"} size={10} />
                                    </div>
                                ) : (
                                    <dd className="text-[1.375rem] font-bold leading-9 text-gray-400">{attendedConversation}</dd>
                                )}
                            </dl>
                        </div>
                        <div className="flex items-center">
                            <dl className="flex flex-col">
                                <dt className="text-15 leading-5 text-gray-400">{t("monitoring.No Atendidos")}</dt>
                                {loading ? (
                                    <div className="leading-9">
                                        <BeatLoader color={"#727C94"} size={10} />
                                    </div>
                                ) : (
                                    <dd className="text-[1.375rem] font-bold text-gray-400">{notAttendedConversation}</dd>
                                )}
                            </dl>
                        </div>
                        {!ifKia && (
                            <div className="flex items-center">
                                <dl className="flex flex-col">
                                    <dt className={`text-15 leading-5 ${actualConversationNotReplied === 0 ? "text-[#438d4d]" : "text-red-1010"}`}>
                                        {t("monitoring.Por Atender")}
                                    </dt>
                                    {loading ? (
                                        <div className="leading-9">
                                            <BeatLoader color={actualConversationNotReplied === 0 ? "#438d4d" : "#D6806F"} size={10} />
                                        </div>
                                    ) : (
                                        <dd
                                            className={`font-bold leading-9 ${
                                                actualConversationNotReplied === 0 ? "text-[#438d4d]" : "text-red-1010"
                                            } text-[1.375rem]`}>
                                            {actualConversationNotReplied}
                                        </dd>
                                    )}
                                </dl>
                            </div>
                        )}

                        <div className="flex items-center">
                            <dl className="flex flex-col">
                                <dt className="text-15 leading-5 text-gray-400">{t("monitoring.Transferidos")}</dt>
                                {loading ? (
                                    <div className="leading-9">
                                        <BeatLoader color={"#727C94"} size={10} />
                                    </div>
                                ) : (
                                    <dd className="text-[1.375rem] font-bold text-gray-400">{transferedConversation}</dd>
                                )}
                            </dl>
                        </div>
                    </div>
                </div>
            </CardWrapper>

            <CardWrapper
                className="flex h-full w-full flex-col justify-between overflow-hidden rounded-1 bg-white shadow-card md:w-[43%]"
                title={t("monitoring.Tiempo de Atención")}>
                <div className="flex h-full">
                    <div className="flex w-1/2 items-center justify-center">
                        <div className="flex h-full flex-col justify-center space-y-3">
                            <div className="flex items-center justify-center space-x-1">
                                {loading ? (
                                    <div className="leading-9">
                                        <BeatLoader color={"#00B3C7"} size={10} />
                                    </div>
                                ) : (
                                    <dd id="card" className={`text-[2.25rem] font-bold leading-9 text-primary-200`}>
                                        {averageReply}
                                    </dd>
                                )}
                            </div>

                            <dt className="text-lg font-bold text-gray-400">{t("monitoring.Primera Respuesta")}</dt>
                        </div>
                    </div>
                    <div className="grid w-1/2 grid-flow-row grid-cols-1 items-center justify-center">
                        <div className="flex items-center">
                            <dl className="flex flex-col">
                                <dt className="text-15 leading-5 text-gray-400">{t("monitoring.Promedio Respuesta")}</dt>
                                {loading ? (
                                    <div className="leading-9">
                                        <BeatLoader color={"#727C94"} size={10} />
                                    </div>
                                ) : (
                                    <dd className="text-[1.375rem] font-bold text-gray-400">{avgOperatorReply}</dd>
                                )}
                            </dl>
                        </div>
                        <div className="flex items-center">
                            <dl className="flex flex-col">
                                <dt className="text-15 leading-5 text-gray-400">{t("monitoring.Promedio Duración")}</dt>
                                {loading ? (
                                    <div className="leading-9">
                                        <BeatLoader color={"#727C94"} size={10} />
                                    </div>
                                ) : (
                                    <dd className="text-[1.375rem] font-bold text-gray-400">{avgConversationTime}</dd>
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
