import { useRef, useCallback, useState } from "react";
import { BeatLoader } from "react-spinners";
import { withTranslation } from "react-i18next";

import get from "lodash/get";
import isEmpty from "lodash/isEmpty";

import { Modal } from "@apps/shared/common";
import { CloseIcon } from "@apps/shared/icons";
import { useOnClickOutside } from "@apps/shared/hooks";
import { formatTemplateMessage } from "@apps/shared/utils";

const DeleteQuickReply = (props) => {
    const { title, onClose, onSubmit, loading, template, t } = props;

    const mediaUrl = !isEmpty(get(template, "mediaUrl", ""));

    const ref = useRef();
    const [isLoadingImage, setIsLoadingImage] = useState(mediaUrl ? true : false);

    useOnClickOutside(ref, () => onClose());

    const ParamsFormat = (props) => {
        const { body, params } = props;
        const parseTemplate = (template, params) => {
            let tempString = template;
            if (!isEmpty(params)) {
                params.forEach((param) => {
                    tempString = tempString.replace(`{{${param.param}}}`, `{{ ${param.label} }}`);
                });
                return tempString;
            }
            return template;
        };
        return formatTemplateMessage(parseTemplate(body || "", params), "break-words max-w-full text-base whitespace-pre-wrap px-2");
    };

    const RenderPreviewMessage = useCallback(
        (props) => {
            const template = props.template;
            const format_message = ParamsFormat(template);

            const showImage = () => {
                setIsLoadingImage(false);
            };

            const IMAGE = props.template.type === "IMAGE" && !isEmpty(props.template.mediaUrl);

            return (
                <div className="img-whatsapp block h-full max-h-xsm flex-col justify-center overflow-auto rounded-lg bg-opacity-50 py-8 px-4 text-sm">
                    <div className="m-auto max-w-lg">
                        <div className="flex flex-col rounded-right-bubble bg-white px-4 py-2 leading-relaxed text-black shadow-preview">
                            {isLoadingImage && <BeatLoader size={"0.5rem"} color="#00B3C7" />}
                            {IMAGE && (
                                <img
                                    onLoad={() => showImage()}
                                    className="max-h-[10rem] w-full rounded-lg object-cover p-0.25"
                                    src={props.template.mediaUrl}
                                    loading="lazy"
                                    alt="preview"></img>
                            )}
                            <div className={IMAGE ? "mt-1" : ""}>{format_message}</div>
                        </div>
                    </div>
                </div>
            );
        },
        [isLoadingImage]
    );

    return (
        <Modal>
            <div className="fixed inset-x-0 top-0 z-120 sm:inset-0 sm:flex sm:items-center sm:justify-center">
                <div className="fixed inset-0 transition-opacity">
                    <div className="absolute inset-0 z-20 bg-gray-490/75" />
                </div>
                <div className="relative min-w-350 transform rounded-lg bg-white px-6 pt-5 pb-4 transition-all" ref={ref}>
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="max-w-md font-bold text-gray-400">{title}</div>
                        </div>
                        <button className="absolute right-0 mr-5" onClick={onClose}>
                            <CloseIcon className="fill-current text-gray-400" width="1rem" height="1rem" />
                        </button>
                    </div>
                    <form action="" onSubmit={onSubmit}>
                        <div className="mt-5 flex flex-col space-y-5 md:mt-0">
                            <RenderPreviewMessage template={template} />
                            <div className="flex flex-row items-end justify-end sm:mt-6">
                                <span className="mr-2 w-32">
                                    <button
                                        onClick={onClose}
                                        type="button"
                                        className="w-full rounded-20 border-1 border-transparent bg-gray-10 p-2 text-base font-bold text-gray-400 focus:outline-none">
                                        {t("Cerrar")}
                                    </button>
                                </span>
                                <span className="w-32">
                                    <button type="submit" className={`button-primary w-full`} disabled={loading}>
                                        {loading ? <BeatLoader color={"white"} size={"0.625rem"} /> : `${t("monitoring.Eliminar")}`}
                                    </button>
                                </span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
};

export default withTranslation()(DeleteQuickReply);
