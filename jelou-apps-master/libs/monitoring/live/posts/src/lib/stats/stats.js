import { msToHMS } from "@apps/shared/utils";
import { useTranslation } from "react-i18next";
import { BeatLoader } from "react-spinners";

import { CardWrapper } from "@apps/shared/common";

const PostStats = (props) => {
    const { loading, totalReplies, assignedReplies, attendedReplies, avgFirstReply, avgSolutionTime, avgWaitingTime } = props;

    const { t } = useTranslation();

    const isLoadingOrShow = (metric, color) => {
        return loading ? <BeatLoader color={color} size={10} /> : metric;
    };

    return (
        <div className="my-4 flex h-[17rem] w-full flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
            <CardWrapper
                className="flex h-full w-full flex-col justify-between overflow-hidden rounded-1 bg-white shadow-card md:w-[57%]"
                title={t("monitoring.Publicaciones")}>
                <div className="flex h-full">
                    <div className="flex w-1/2 items-center justify-center">
                        <div className="flex h-full flex-col justify-center space-y-3">
                            <div className="flex items-center justify-center space-x-1">
                                <dd id="card" className={`text-[2.25rem] font-bold leading-9 text-primary-200`}>
                                    {isLoadingOrShow(totalReplies, "#00B3C7")}
                                </dd>
                            </div>

                            <dt className="text-lg font-bold text-gray-400">{t("monitoring.Totales")}</dt>
                        </div>
                    </div>
                    <div className={`grid h-full w-1/2 grid-cols-1 grid-rows-2 items-center justify-center`}>
                        <div className="flex items-center">
                            <div className="flex flex-col">
                                <dt className="text-15 leading-5 text-gray-400">{t("monitoring.Atendidos")}</dt>
                                <dd className="text-[1.375rem] font-bold leading-9 text-gray-400">{isLoadingOrShow(attendedReplies, "#727C94")}</dd>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="flex flex-col">
                                <dt className="text-15 leading-5 text-gray-400">{t("monitoring.asignados")}</dt>
                                <dd className="text-[1.375rem] font-bold leading-9 text-gray-400">{isLoadingOrShow(assignedReplies, "#727C94")}</dd>
                            </div>
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
                                <dd id="card" className={`flex items-center text-[2.25rem] font-bold leading-9 text-[#00B3C7]`}>
                                    {isLoadingOrShow(msToHMS(avgFirstReply), "#00B3C7")}
                                </dd>
                            </div>
                            <dt className="text-lg font-bold text-gray-400">{t("monitoring.Primera Respuesta")}</dt>
                        </div>
                    </div>
                    <div className="grid w-1/2 grid-flow-row grid-cols-1 items-center justify-center">
                        <div className="flex items-center">
                            <dl className="flex flex-col">
                                <dt className="text-15 leading-5 text-gray-400">{t("monitoring.Espera de ticket promedio")}</dt>

                                <dd className="text-[1.375rem] font-bold text-gray-400">{isLoadingOrShow(msToHMS(avgWaitingTime), "#727C94")}</dd>
                            </dl>
                        </div>
                        <div className="flex items-center">
                            <dl className="flex flex-col">
                                <dt className="text-15 leading-5 text-gray-400">{t("monitoring.Tiempo de solución")}</dt>
                                {loading ? (
                                    <div className="leading-9">
                                        <BeatLoader color={"#727C94"} size={10} />
                                    </div>
                                ) : (
                                    <dd className="text-[1.375rem] font-bold text-gray-400">
                                        {isLoadingOrShow(msToHMS(avgSolutionTime), "#727C94")}
                                    </dd>
                                )}
                            </dl>
                        </div>
                    </div>
                </div>
            </CardWrapper>
        </div>
    );
};

export default PostStats;
