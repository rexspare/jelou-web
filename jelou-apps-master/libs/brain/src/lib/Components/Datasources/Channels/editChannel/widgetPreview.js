import { CloseIcon, MicIcon, MoreIcon1, SendIconWidget } from "@apps/shared/icons";
import TextareaAutosize from "react-autosize-textarea/lib";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import WidgetMaximize from "./Widget/WidgetMaximize";
import WidgetIconBubble from "./Widget/WidgetIcnoBubble";
import WidgetMinimize from "./Widget/WidgetMinimize";

export default function WidgetPreview(props) {
    const { widgetProperties = {}, selectedWidgetTab } = props;
    const { t } = useTranslation();
    const { datastoreId, channelId } = useParams();

    const goToPreview = () => {
        localStorage.setItem("widgetProperties", JSON.stringify({ ...widgetProperties, viewBubble: selectedWidgetTab.id === 3 }));
        window.open(`/brain/${datastoreId}/channels/${channelId}/widget/previewscreen`, "_blank");
    };

    return (
        <div className="flex w-[25vw] flex-col space-y-4 bg-neutral-100 p-4">
            <header className="flex justify-between">
                <span className="font-bold text-primary-200">{t("common.preview")}</span>
                <button className="rounded-full border-1 border-primary-200 px-3 font-bold text-primary-200" onClick={goToPreview}>
                    {t("common.preview")}
                </button>
            </header>
            {(selectedWidgetTab.id === 1 || selectedWidgetTab.id === 4) && <WidgetMaximize widgetProperties={widgetProperties} />}
            {selectedWidgetTab.id === 2 && (
                <div className="flex h-1/2 w-full items-center">
                    <WidgetIconBubble widgetProperties={widgetProperties} justify="center" />
                </div>
            )}
            {selectedWidgetTab.id === 3 && (
                <div className="flex min-h-1/2 w-full flex-col items-end gap-y-2 py-8 pr-8">
                    <WidgetMinimize widgetProperties={widgetProperties} />
                    <WidgetIconBubble widgetProperties={widgetProperties} />
                </div>
            )}
        </div>
    );
}
