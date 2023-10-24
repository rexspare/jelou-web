import { CloseIcon, CloseIcon1, FileIcon1, ImageIcon, ImageIcon1, LocationIcon, MicIcon, MoreIcon1, PreviewCircleIcon, SendIconWidget } from "@apps/shared/icons";
import { useState, useEffect } from "react";
import TextareaAutosize from "react-autosize-textarea";
import Skeleton from "react-loading-skeleton";
import WidgetIconBubble from "./WidgetIcnoBubble";
import SkeletonMarket from "./SkeletonMarket";
import WidgetMaximize from "./WidgetMaximize";
import WidgetMinimize from "./WidgetMinimize";

const WidgetPreviewAllScreen = () => {
    const [widgetProperties, setWidgetProperties] = useState(JSON.parse(localStorage.getItem("widgetProperties")) || {});

    useEffect(() => {
        function checkWidgetProperties() {
            const widget = JSON.parse(localStorage.getItem("widgetProperties"));

            if (widget) {
                setWidgetProperties(widget);
            }
        }
        window.addEventListener("storage", checkWidgetProperties);
        return () => {
            window.removeEventListener("storage", checkWidgetProperties);
        };
    }, []);

    return (
        <div className="bg-app-body relative flex max-h-screen min-h-screen w-full min-w-sm flex-col">
            <SkeletonMarket />
            <div className="absolute bottom-2 right-2 flex flex-col gap-y-2">
                {widgetProperties && !widgetProperties.viewBubble ? <WidgetMaximize widgetProperties={widgetProperties} /> : <WidgetMinimize widgetProperties={widgetProperties} />}
                <WidgetIconBubble widgetProperties={widgetProperties} />
            </div>
        </div>
    );
};

export default WidgetPreviewAllScreen;
