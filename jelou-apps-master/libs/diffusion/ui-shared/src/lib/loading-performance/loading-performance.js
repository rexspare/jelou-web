import { useTranslation } from "react-i18next";
import { DeliveredReplyIcon, DoubleCheckmarkIcon1, DoubleCheckmarkIcon2, WhatsappColoredIcon } from "@apps/shared/icons";
import { BeatLoader } from "react-spinners";

const LoadingPerformance = () => {
    const { t } = useTranslation();

    const loadingQuantity = (color = "#727c94") => {
        return <BeatLoader color={color} size={8} />;
    };

    return (
        <div style={{ gridTemplateRows: "50%  50%" }} className="grid min-h-[14.6rem] grid-cols-4 gap-0 overflow-hidden">
            <div className="text-whatsapp-stat flex max-w-full flex-col items-center justify-center border-r-1 px-4">
                <div className="stat bold flex w-[-webkit-fill-available] justify-center overflow-auto text-stat-total">
                    <WhatsappColoredIcon isCenter={true} className="mr-2" width={20} height={20} />
                    {loadingQuantity("#00BC2A")}
                </div>
                <div className="h-12 text-center text-13 text-gray-400 lg:text-xs xl:text-13 base:text-xs">
                    {t("HSMTable.Total de mensajes entregados")}
                </div>
            </div>
            <div className="text-whatsapp-stat flex max-w-full flex-col items-center justify-center border-r-1 px-4">
                <div className="statHsm bold flex w-[-webkit-fill-available] justify-center overflow-auto text-primary-200">
                    <DoubleCheckmarkIcon1 width={20} height={16} isCenter={true} className="mt-2 mr-2 flex items-start justify-end" />
                    {loadingQuantity("#80D9E3")}
                </div>
                <div className="h-12 text-center text-13 text-gray-400 lg:text-xs xl:text-13 base:text-xs">{t("HSMTable.deliveredUser")}</div>
            </div>
            <div className="text-whatsapp-stat flex max-w-full flex-col items-center justify-center border-r-1 px-4">
                <div className="bold flex w-[-webkit-fill-available] justify-center overflow-auto text-stat-read">
                    <DoubleCheckmarkIcon2 width={20} height={16} isCenter={true} className="mt-2 mr-2 flex items-start justify-end" />
                    {loadingQuantity("#0095BE")}
                </div>
                <div className="h-12 text-center text-13 text-gray-400 lg:text-xs xl:text-13 base:text-xs">{t("HSMTable.Entregados y leídos")}</div>
            </div>
            <div className="text-whatsapp-stat flex max-w-full flex-col items-center justify-center px-4">
                <div className="bold flex w-[-webkit-fill-available] justify-center overflow-auto text-secondary-425">
                    <DeliveredReplyIcon width={20} height={16} isCenter={true} className="mt-2 mr-2 flex items-start justify-end" />
                    {loadingQuantity("#00BA9D")}
                </div>
                <div className="h-12 text-center text-13 text-gray-400 lg:text-xs xl:text-13 base:text-xs">
                    {t("HSMTable.Entregados con respuesta")}
                </div>
            </div>

            {/* ------------------------------------------------ */}
            <div className={`flex items-end justify-center border-r-1 bg-white pb-5`}>{loadingQuantity("#00BC2A")}</div>
            <div className={`flex items-end justify-center border-r-1 bg-white pb-5`}>{loadingQuantity("#80D9E3")}</div>
            <div className={`flex items-end justify-center border-r-1 bg-white pb-5`}>{loadingQuantity("#0095BE")}</div>
            <div className={`flex items-end justify-center bg-white pb-5 `}>{loadingQuantity("#00BA9D")}</div>
        </div>
    );
};
export default LoadingPerformance;
