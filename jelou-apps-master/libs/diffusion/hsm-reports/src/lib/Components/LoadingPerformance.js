import { useTranslation } from "react-i18next";
import {
    DeliveredReplyIcon,
    DoubleCheckmarkIcon1,
    DoubleCheckmarkIcon2,
    WhatsappColoredIcon,
} from "@apps/shared/icons";
import { BeatLoader } from "react-spinners";

const LoadingPerformance = () => {
    const { t } = useTranslation();

    const loadingQuantity = (color = "#727c94") => {
        return <BeatLoader color={color} size={8} />;
    };

    return (
        <div style={{ gridTemplateRows: '50%  50%' }} 
            className="grid min-h-[14.6rem] grid-cols-4 gap-0 overflow-hidden" >
            <div className="text-whatsapp-stat flex flex-col items-center justify-center border-r-1 max-w-full px-4">
                <div className="justify-center stat bold flex text-stat-total overflow-auto w-[-webkit-fill-available]">
                    <WhatsappColoredIcon isCenter={true} className="mr-2" width={20} height={20} />
                    {loadingQuantity("#00BC2A")}
                </div>
                <div className="text-gray-400 text-center text-13 lg:text-xs xl:text-13 h-12 base:text-xs">{t("HSMTable.Total de mensajes entregados")}</div>
            </div>
            <div className="text-whatsapp-stat flex flex-col items-center justify-center border-r-1 max-w-full px-4">
                <div className="justify-center statHsm bold flex text-primary-200 overflow-auto w-[-webkit-fill-available]">
                    <DoubleCheckmarkIcon1 width={20} height={16} isCenter={true} className="mt-2 mr-2 flex items-start justify-end" />
                        {loadingQuantity("#80D9E3")}
                </div>
                <div className="text-gray-400 text-center text-13 lg:text-xs xl:text-13 h-12 base:text-xs">{t("HSMTable.deliveredUser")}</div>
            </div>
            <div className="text-whatsapp-stat flex flex-col items-center justify-center border-r-1 max-w-full px-4">
                <div className="justify-center bold flex text-stat-read overflow-auto w-[-webkit-fill-available]">
                    <DoubleCheckmarkIcon2 width={20} height={16} isCenter={true} className="mt-2 mr-2 flex items-start justify-end" />
                    {loadingQuantity("#0095BE")}
                </div>
                <div className="text-gray-400 text-center text-13 lg:text-xs xl:text-13 h-12 base:text-xs">{t("HSMTable.Entregados y leídos")}</div>
            </div>
            <div className="text-whatsapp-stat flex flex-col items-center justify-center max-w-full px-4">
                <div className="justify-center bold flex text-secondary-425 overflow-auto w-[-webkit-fill-available]">
                    <DeliveredReplyIcon width={20} height={16} isCenter={true} className="mt-2 mr-2 flex items-start justify-end" />
                    {loadingQuantity("#00BA9D")}
                </div>
                <div className="text-gray-400 text-center text-13 lg:text-xs xl:text-13 h-12 base:text-xs">{t("HSMTable.Entregados con respuesta")}</div>
            </div>

            {/* ------------------------------------------------ */}
            <div className={`pb-5 flex items-end justify-center bg-white border-r-1`} >
                {loadingQuantity("#00BC2A")}
            </div>
            <div className={`pb-5 flex items-end justify-center bg-white border-r-1`} >
                {loadingQuantity("#80D9E3")}
            </div>
            <div className={`pb-5 flex items-end justify-center bg-white border-r-1`} >
                {loadingQuantity("#0095BE")}
            </div>
            <div className={`pb-5 flex items-end justify-center bg-white `} >
                {loadingQuantity("#00BA9D")}
            </div>
        </div>
    );
};
export default LoadingPerformance;
