import { useTranslation } from "react-i18next";

import { DownloadIcon } from "@apps/shared/icons";
import ApiKeyView from "./ApiKeyView";
import CodeContainer from "./CodeContainer";

const IntegrationsWidget = (props) => {
    const { copyContent, obj, apiKey } = props;
    const { t } = useTranslation();

    const scriptLoader = `<script src="https://cdn.jelou.ai/widgets/loader.js"></script>`;

    const scriptLoaderExample = `<script
    src="https://cdn.jelou.ai/widgets/loader.js"
    data-api-key="${apiKey}"
    data-init="true">
</script>`;

    const connectWidgetService = `<script>
    document.addEventListener('jelou-widget:load', () => {
        const widgetService = new WidgetService({ apiKey: '${apiKey}' });
        widgetService.connect({ names: "<someName>" }).then(() => {
            console.log("Success! 🚀")
        });
    });
</script>`;
    return (
        <div className="h-[60vh] ">
            <div className="flex w-1/2 flex-col space-y-4 p-10 py-8">
                <ApiKeyView copyContent={copyContent} apiKey={apiKey} />
                <div className="my-4 flex flex-col gap-y-2">
                    <div className="flex flex-col gap-y-2">
                        <span className="text-xl font-bold text-gray-610">{t("brain.usingLoader")}</span>
                        <span className="text-sm text-gray-400">{t("brain.Este es un método de instalacion rapida")}</span>
                    </div>
                    <CodeContainer code={scriptLoaderExample} language="html"/>
                </div>
                <div className="my-4 flex flex-col gap-y-8">
                    <div className="flex flex-col gap-y-2">
                        <span className="text-xl font-bold text-gray-610">{t("brain.usingCDN")}</span>
                        <span className="text-sm text-gray-400">{t("brain.Instalación paso a paso con acceso al objeto widget.")}</span>
                    </div>
                    <CodeContainer code={scriptLoader} language="html" text="Script loader para importar" title={`1. ${t("brain.Importa el script")}`} />
                    <CodeContainer code={connectWidgetService} language="html" title={`2. ${t("brain.Conecta WidgetService")}`} />
                    <a
                        href="https://docs.jelou.ai/widget/widget-web/installation"
                        target="_blank"
                        rel="noreferrer"
                        className="mb-8 flex w-fit gap-x-2 rounded-full border-1 border-primary-200 py-2 px-6"
                    >
                        <span className="text-sm font-bold text-primary-200">{t("brain.Ir a documentación completa")}</span>
                        <DownloadIcon className="-rotate-90" width="1.2rem" height="1.2rem" fill="#00B3C7" />
                    </a>
                </div>
            </div>
            <div className="mt-10 flex flex-col gap-5 border-t-1 border-t-neutral-200 pt-6 pb-8">
                <div className="flex w-1/2 flex-col space-y-4 p-10 py-8">
                    <CodeContainer
                        code={obj}
                        language="html"
                        title={t("brain.Integracion de canal")}
                        description={t("brain.Añade el siguiente codigo al final de la seccion <head> en tu pagina web")}
                    />
                </div>
            </div>
        </div>
    );
};

export default IntegrationsWidget;
