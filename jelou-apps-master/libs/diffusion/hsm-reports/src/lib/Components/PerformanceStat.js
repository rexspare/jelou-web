import { useTranslation } from "react-i18next";
import { DeliveredReplyIcon, DoubleCheckmarkIcon1, DoubleCheckmarkIcon2, WhatsappColoredIcon } from "@apps/shared/icons";

const PerformanceStat = (props) => {
    const { noHsmData, stats, deliveredPercentage, userReadPercentage, repliedPercentage, numberFormat } = props;
    const { t } = useTranslation();

    const { USER_REPLIED: replied = 0, DELIVERED_USER: deliveredUser = 0, USER_READ: userRead = 0, TOTAL_DELIVERED: totalDelivered = 0 } = stats;

    return (
        <div className="grid min-h-[14.6rem] grid-cols-4 gap-0 overflow-hidden" style={{ gridTemplateRows: "50% 50%" }}>
            <div className="text-whatsapp-stat flex max-w-full flex-col items-center justify-center border-r-1 px-4">
                <div
                    className={`bold flex w-[-webkit-fill-available] text-stat-total ${
                        `${totalDelivered}`.length > 7 ? "flex-col items-center" : "justify-center"
                    }`}>
                    <WhatsappColoredIcon isCenter={true} className="mr-2" width={"1.125rem"} height={"1.125rem"} />
                    <span className={`flex font-bold ${`${totalDelivered}`.length > 7 ? "text-xl" : "text-3xl lg:text-2xl"}`}>
                        {numberFormat(totalDelivered)}
                    </span>
                </div>
                <div
                    className={`text-center text-13 text-gray-400 lg:text-xs xl:text-13 base:text-xs ${
                        `${totalDelivered}`.length > 7 ? "h-10" : "h-12"
                    }`}>
                    {t("HSMTable.Total de mensajes entregados")}
                </div>
            </div>
            <div className="text-whatsapp-stat flex max-w-full flex-col items-center justify-center border-r-1 px-4">
                <div
                    className={`bold scrollcontainer2 flex w-[-webkit-fill-available] text-primary-200 ${
                        `${deliveredUser}`.length > 9 ? "flex-col" : "justify-center"
                    }`}>
                    <DoubleCheckmarkIcon1
                        width={"1.1rem"}
                        height={"1rem"}
                        isCenter={true}
                        className={`flex items-start justify-end ${`${deliveredUser}`.length > 9 ? "mb-1" : "mr-2"} 
                            ${`${deliveredUser}/${totalDelivered}`.length > 7 ? "" : "mt-2"}`}
                    />
                    <span
                        className={`flex items-center font-bold ${
                            `${deliveredUser}/${totalDelivered}`.length > 7 ? "flex-col text-xl leading-5" : "text-3xl lg:text-2xl"
                        }`}>
                        <span className="flex">{numberFormat(deliveredUser)}</span>
                        <span
                            className={`flex items-end text-[#B8BDC9] ${
                                `${deliveredUser}/${totalDelivered}`.length > 7 ? "text-base" : "text-xl lg:text-lg"
                            }`}>
                            /{numberFormat(totalDelivered)}
                        </span>
                    </span>
                </div>
                <div
                    className={`text-center text-13 text-gray-400 lg:text-xs xl:text-13 base:text-xs ${
                        `${deliveredUser}/${totalDelivered}`.length > 7 ? "h-8" : "h-12"
                    }`}>
                    {t("HSMTable.deliveredUser")}
                </div>
            </div>
            <div className="text-whatsapp-stat flex max-w-full flex-col items-center justify-center border-r-1 px-4">
                <div
                    className={`bold scrollcontainer2 flex w-[-webkit-fill-available] text-stat-read ${
                        `${userRead}`.length > 9 ? "flex-col" : "justify-center"
                    }`}>
                    <DoubleCheckmarkIcon2
                        width={"1.1rem"}
                        height={"1rem"}
                        isCenter={true}
                        className={`flex items-start justify-end ${`${userRead}`.length > 9 ? "mb-1" : "mr-2"} 
                            ${`${userRead}/${totalDelivered}`.length > 7 ? "" : "mt-2"}`}
                    />
                    <span
                        className={`flex items-center font-bold ${
                            `${userRead}/${totalDelivered}`.length > 7 ? "flex-col text-xl leading-5" : "text-3xl lg:text-2xl"
                        }`}>
                        <span className="flex">{numberFormat(userRead)}</span>
                        <span
                            className={`flex items-end text-[#B8BDC9] ${
                                `${userRead}/${totalDelivered}`.length > 7 ? "text-base" : "text-xl lg:text-lg"
                            }`}>
                            /{numberFormat(totalDelivered)}
                        </span>
                    </span>
                </div>
                <div
                    className={`text-center text-13 text-gray-400 lg:text-xs xl:text-13 base:text-xs ${
                        `${userRead}/${totalDelivered}`.length > 7 ? "h-8" : "h-12"
                    }`}>
                    {t("HSMTable.Entregados y leídos")}
                </div>
            </div>
            <div className="text-whatsapp-stat flex max-w-full flex-col items-center justify-center px-4">
                <div
                    className={`bold scrollcontainer2 flex w-[-webkit-fill-available] text-secondary-425 ${
                        `${replied}`.length > 9 ? "flex-col" : "justify-center"
                    }`}>
                    <DeliveredReplyIcon
                        width={"1.1rem"}
                        height={"1rem"}
                        isCenter={true}
                        className={`flex items-start justify-end ${`${replied}`.length > 9 ? "mb-1" : "mr-2"} 
                            ${`${replied}/${totalDelivered}`.length > 7 ? "" : "mt-2"}`}
                    />
                    <span
                        className={`flex items-center font-bold ${
                            `${replied}/${totalDelivered}`.length > 7 ? "flex-col text-xl leading-5" : "text-3xl lg:text-2xl"
                        }`}>
                        <span className="flex">{numberFormat(replied)}</span>
                        <span
                            className={`flex items-end text-[#B8BDC9] ${
                                `${replied}/${totalDelivered}`.length > 7 ? "text-base" : "text-xl lg:text-lg"
                            }`}>
                            /{numberFormat(totalDelivered)}
                        </span>
                    </span>
                </div>
                <div
                    className={`text-center text-13 text-gray-400 lg:text-xs xl:text-13 base:text-xs ${
                        `${replied}/${totalDelivered}`.length > 7 ? "h-8" : "h-12"
                    }`}>
                    {t("HSMTable.Entregados con respuesta")}
                </div>
            </div>
            <div className="relative flex h-full w-full items-end border-r-1">
                {/* <div
                    style={{ 
                        clipPath: "polygon(100% 102%, 0% 0%, 0% 102%)",
                        height: `${noHsmData ? 50 : 0}%`,
                        bottom: `${noHsmData ? 0 : 100}%`
                    }}
                    className={`flex absolute w-1/5 items-end justify-center bg-stat-total`}
                /> */}

                <div
                    style={{ height: noHsmData ? "0%" : "100%" }}
                    className={
                        `relative z-10 flex w-full justify-center bg-stat-total before:content-[''] ` +
                        `overflow-hidden before:absolute before:right-0 before:h-full before:w-[0.065rem] before:bg-stat-total ` +
                        `before:z-20 before:translate-x-[0.063rem] before:opacity-100`
                    }>
                    <span className={`absolute bottom-2 flex text-xl font-bold text-white`}>{noHsmData ? "0.00%" : "100.00%"}</span>
                </div>
                <div
                    style={{ height: noHsmData ? "0%" : "100%" }}
                    className={
                        `before:absolute before:right-0 before:h-full before:bg-stat-total before:content-[''] ` +
                        `overflow-hidden before:z-[15] before:w-[0.065rem] before:translate-x-[0.063rem] before:opacity-100`
                    }
                />
                <span className={`absolute bottom-2 flex w-full justify-center text-xl font-bold text-stat-total`}>
                    {noHsmData ? "0.00%" : "100.00%"}
                </span>
            </div>
            <div className="relative flex h-full w-full items-end border-r-1">
                <div
                    style={{
                        clipPath: "polygon(100% 102%, 0% 0%, 0% 102%)",
                        height: `${((noHsmData ? 0 : 100) - parseInt(deliveredPercentage)).toFixed(0)}%`,
                        bottom: `${parseInt(deliveredPercentage).toFixed(0)}%`,
                    }}
                    className={`absolute flex w-1/5 items-end justify-center bg-stat-delivered `}
                />
                <div
                    style={{ height: noHsmData || deliveredUser === 0 ? "0%" : `${parseInt(deliveredPercentage).toFixed(0)}%` }}
                    className={
                        `relative z-10 flex w-full justify-center overflow-hidden bg-stat-delivered before:content-[''] ` +
                        `before:absolute before:right-0 before:h-full before:w-[0.065rem] before:bg-stat-delivered ` +
                        `before:z-20 before:translate-x-[0.063rem] before:opacity-100`
                    }>
                    <span className={`absolute bottom-2 flex text-xl font-bold text-white`}>{`${parseInt(deliveredPercentage).toFixed(2)}%`}</span>
                </div>
                <div
                    style={{ height: noHsmData || deliveredUser === 0 ? "0%" : `${parseInt(deliveredPercentage).toFixed(0)}%` }}
                    className={
                        `before:absolute before:right-0 before:h-full before:bg-stat-delivered before:content-[''] ` +
                        `overflow-hidden before:z-[15] before:w-[0.065rem] before:translate-x-[0.063rem] before:opacity-100`
                    }
                />
                <span className={`absolute bottom-2 flex w-full justify-center text-xl font-bold text-stat-delivered`}>
                    {`${parseInt(deliveredPercentage).toFixed(2)}%`}
                </span>
            </div>
            <div className="relative flex h-full w-full items-end border-r-1">
                <div
                    style={{
                        clipPath: "polygon(100% 102%, 0% 0%, 0% 102%)",
                        height: `${(parseInt(deliveredPercentage) - parseInt(userReadPercentage)).toFixed(0)}%`,
                        bottom: `${parseInt(userReadPercentage).toFixed(0)}%`,
                    }}
                    className={`absolute flex w-1/5 items-end justify-center bg-stat-read`}
                />
                <div
                    style={{ height: noHsmData || userRead === 0 ? "0%" : `${parseInt(userReadPercentage).toFixed(0)}%` }}
                    className={
                        `relative z-10 flex w-full justify-center bg-stat-read before:content-[''] ` +
                        `overflow-hidden before:absolute before:right-0 before:h-full before:w-[0.065rem] before:bg-stat-read ` +
                        `before:z-20 before:translate-x-[0.063rem] before:opacity-100`
                    }>
                    <span className={`absolute bottom-2 flex text-xl font-bold text-white`}>{`${parseInt(userReadPercentage).toFixed(2)}%`}</span>
                </div>
                <div
                    style={{ height: noHsmData || userRead === 0 ? "0%" : `${parseInt(userReadPercentage).toFixed(0)}%` }}
                    className={
                        `before:absolute before:right-0 before:h-full before:bg-stat-read before:content-[''] ` +
                        `overflow-hidden before:z-[15] before:w-[0.065rem] before:translate-x-[0.063rem] before:opacity-100`
                    }
                />
                <span className={`absolute bottom-2 flex w-full justify-center text-xl font-bold text-stat-read`}>
                    {`${parseInt(userReadPercentage).toFixed(2)}%`}
                </span>
            </div>
            <div className="relative flex h-full w-full items-end">
                <div
                    style={{
                        clipPath: "polygon(100% 102%, 0% 0%, 0% 102%)",
                        height: `${(parseInt(userReadPercentage) - parseInt(repliedPercentage)).toFixed(0)}%`,
                        bottom: `${parseInt(repliedPercentage).toFixed(0)}%`,
                    }}
                    className={`absolute flex w-1/5 items-end justify-center bg-stat-answered`}
                />
                <div
                    style={{ height: noHsmData || replied === 0 ? "0%" : `${parseInt(repliedPercentage).toFixed(0)}%` }}
                    className={
                        `relative z-10 flex w-full justify-center overflow-hidden bg-stat-answered before:content-[''] ` +
                        `before:absolute before:right-0 before:h-full before:w-[0.065rem] before:bg-stat-answered ` +
                        `before:z-20 before:translate-x-[0.063rem] before:opacity-100`
                    }>
                    <span className={`absolute bottom-2 flex text-xl font-bold text-white`}>{`${parseInt(repliedPercentage).toFixed(2)}%`}</span>
                </div>
                {/* <div style={{ height: noHsmData || replied === 0 ? '0%' : `${(parseInt(repliedPercentage)).toFixed(0)}%` }} 
                    className={`before:content-[''] before:bg-stat-answered before:h-full before:absolute before:right-0 `
                        +`before:w-[0.065rem] overflow-hidden before:z-20 before:opacity-100 before:translate-x-[0.063rem]`} /> */}
                <span className={`absolute bottom-2 flex w-full justify-center text-xl font-bold text-stat-answered`}>
                    {`${parseInt(repliedPercentage).toFixed(2)}%`}
                </span>
            </div>
        </div>
    );
};
export default PerformanceStat;
