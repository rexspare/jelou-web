import uniqid from "uniqid";
import get from "lodash/get";
import has from "lodash/has";
import concat from "lodash/concat";
import isEmpty from "lodash/isEmpty";
import { v4 as uuidv4 } from "uuid";
import toLower from "lodash/toLower";
import * as Sentry from "@sentry/react";
import React, { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { DebounceInput } from "react-debounce-input";
import { NewFormModal } from "@apps/pma/ui-shared";
import { JelouApiV1 } from "@apps/shared/modules";
import { MAX_SIZE } from "@apps/shared/constants";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { renderMessage } from "@apps/shared/common";

export const CreateFirmModal = ({
    closeModal,
    attachments,
    setAttachments,
    userSession,
    currentEmail,
    setDefaultSignature,
    message,
    setMessage,
    signatures = [],
    setSignatures,
    fontFamily,
}) => {
    const { t } = useTranslation();
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";
    const signatureRef = useRef(null);
    const [name, setName] = useState("");

    const uploadFile = async (file, path) => {
        const botId = get(currentEmail, "bot.id");
        const { Company } = userSession;
        const { clientId, clientSecret } = Company;

        const auth = {
            username: clientId,
            password: clientSecret,
        };

        const config = {
            headers: {
                "content-type": "multipart/form-data",
            },
            auth,
        };

        const formData = new FormData();
        formData.append("image", file);
        formData.append("path", path);

        try {
            const { data } = await JelouApiV1.post(`/bots/${botId}/images/upload`, formData, config);
            return data;
        } catch (error) {
            if (has(error, "response.data")) {
                Sentry.setExtra("error", get(error, "response.data"));
            } else {
                Sentry.setExtra("error", error);
            }

            Sentry.captureException(new Error("Error uploading file."));
            return error;
        }
    };

    const addSignature = async (signature) => {
        let newSignature = { id: uuidv4(), name, body: `<p><br><br>${signature.current.getContent()}</p>`, state: true };

        JelouApiV1.post("operators/signatures/create", newSignature)
            .then((res) => {
                setMessage({ type: "success", text: "Firma creada exitosamente" });
                setTimeout(() => {
                    closeModal();
                }, 1000);
                setSignatures(concat(signatures, newSignature));
            })
            .catch((error) => {
                setMessage({ type: "failed", text: "Ha ocurrido un error, intentar más tarde" });
                console.log(error);
            });
    };

    const applySignature = (signature) => {
        if (isEmpty(signature.current.getContent())) {
            return;
        }
        let newSignature = { id: uuidv4(), body: `<p><br><br>${signature.current.getContent()}</p>` };
        setDefaultSignature(newSignature);
        closeModal();
    };

    return (
        <NewFormModal onClose={closeModal}>
            <div className="max-h-37.5 relative max-w-[38rem] transform overflow-y-auto rounded-[1.375rem] bg-white px-4 pb-4 pt-5 shadow-modal transition-all sm:p-8">
                <div className="flex flex-col items-center space-y-3">
                    {!isEmpty(message) && (
                        <div
                            className={`${
                                get(message, "type", "") === "success" ? "bg-whatsapp-200 text-whatsapp-350" : "bg-[#ffc1c1] text-[#ff7777]"
                            } mb-3 flex h-14 w-full items-center rounded-lg px-4 text-center font-bold `}>
                            <span className="w-full text-center">{t(message.text)}</span>
                        </div>
                    )}
                    <div className="flex items-center">
                        <div className="sm:max-w-56 md:max-w-128 whitespace-pre-line text-xl font-bold leading-snug text-primary-200 md:text-xl">
                            {t("Crear firma")}
                        </div>
                    </div>
                    <button className="absolute right-0 top-0 mr-4 mt-4" onClick={() => closeModal()}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M0.744913 12.7865L3.2609 15.3025L8.02135 10.5421L12.7605 15.2812L15.2737 12.768L10.5346 8.02887L15.2817 3.28171L12.7657 0.765728L8.01857 5.51289L3.25284 0.747158L0.73964 3.26036L5.50537 8.02609L0.744913 12.7865Z"
                                fill="#D7D7D7"
                            />
                        </svg>
                    </button>
                    <div className="inline-block w-[33rem] transform overflow-hidden text-left align-middle transition-all">
                        <section>
                            <label>
                                <h3 className="mb-3 text-15 font-bold text-gray-400">{t("pma.Nombre de la firma")}</h3>
                                <DebounceInput
                                    type="search"
                                    minLength={2}
                                    className="mb-3 w-full rounded-lg border-0 bg-gray-10 text-sm placeholder:text-sm placeholder:text-gray-400 placeholder:opacity-50 focus:border-transparent focus:ring-transparent"
                                    debounceTimeout={500}
                                    placeholder={t("pma.Escribe el nombre de la firma")}
                                    autoFocus
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </label>
                            <h3 className="mb-4 text-15 font-bold text-gray-400">{t("Cuerpo de la firma")}</h3>
                            <div>
                                <div id="signature-custom" className="relative">
                                    <Editor
                                        apiKey="fi0lek2gijjyiyk6h2pl63hqjbxmikhcamncemv9fpy0csdb"
                                        id="my-editor1"
                                        init={{
                                            selector: "textarea#signature-custom",
                                            height: 250,
                                            auto_focus: "my-editor1",
                                            paste_data_images: true,
                                            file_picker_types: "file image media",
                                            menubar: false,
                                            plugins: [
                                                "link image lists",
                                                "searchreplace visualblocks code fullscreen",
                                                "insertdatetime table wordcount",
                                            ],
                                            toolbar:
                                                "fontselect | bold italic underline strikethrough forecolor backcolor | link insertfile image | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | checklist | casechange | formatselect",

                                            image_title: true,
                                            automatic_uploads: true,
                                            images_upload_handler: async function (blobInfo, success, failure, progress) {
                                                blobInfo.blob();

                                                const file = blobInfo.blob();
                                                const kbSize = file.size / 1000;

                                                let fileName = file.name.replace(/ /g, "_");

                                                fileName = uniqid() + `-${fileName}`;
                                                fileName = toLower(`${fileName}`);
                                                const path = `images/${fileName}`;

                                                const url = await uploadFile(file, path);

                                                // setAttachments([...attachments, { url, fileName }]);

                                                if (kbSize > MAX_SIZE) {
                                                    renderMessage(t("pma.Tamaño de imagen excedido", "ERROR"));

                                                    return;
                                                }
                                                success(url);

                                                // For now just a placeholder image to test that we reach here when a user pastes an image
                                            },
                                            language: lang,
                                            /* and here's our custom image picker*/

                                            content_style:
                                                ".left { text-align: left; } " +
                                                "img.left { float: left; } " +
                                                "table.left { float: left; } " +
                                                ".right { text-align: right; } " +
                                                "img.right { float: right; } " +
                                                "table.right { float: right; } " +
                                                ".center { text-align: center; } " +
                                                "img.center { display: block; margin: 0 auto; } " +
                                                "table.center { display: block; margin: 0 auto; } " +
                                                ".full { text-align: justify; } " +
                                                "img.full { display: block; margin: 0 auto; } " +
                                                "table.full { display: block; margin: 0 auto; } " +
                                                ".bold { font-weight: bold; } " +
                                                ".italic { font-style: italic; } " +
                                                ".underline { text-decoration: underline; } " +
                                                ".example1 {} " +
                                                `body { font-family:${fontFamily},Helvetica,sans-serif; font-size:14px }` +
                                                ".tablerow1 { background-color: #D3D3D3; }",

                                            formats: {
                                                alignleft: {
                                                    selector: "p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,audio,video",
                                                    classes: "left",
                                                },
                                                aligncenter: {
                                                    selector: "p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,audio,video",
                                                    classes: "center",
                                                },
                                                alignright: {
                                                    selector: "p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,audio,video",
                                                    classes: "right",
                                                },
                                                alignfull: {
                                                    selector: "p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,audio,video",
                                                    classes: "full",
                                                },
                                                underline: { inline: "u", exact: true },
                                                italic: { inline: "em", exact: true },
                                                bold: { inline: "b", exact: true },
                                                strikethrough: { inline: "del" },
                                                customformat: {
                                                    inline: "span",
                                                    styles: { color: "#00ff00", fontSize: "20px" },
                                                    attributes: { title: "My custom format" },
                                                    classes: "example1",
                                                },
                                            },
                                            style_formats: [
                                                { title: "Custom format", format: "customformat" },
                                                { title: "Align left", format: "alignleft" },
                                                { title: "Align center", format: "aligncenter" },
                                                { title: "Align right", format: "alignright" },
                                                { title: "Align full", format: "alignfull" },
                                                { title: "Bold text", inline: "strong" },
                                                { title: "Red text", inline: "span", styles: { color: "#ff0000" } },
                                                { title: "Red header", block: "h1", styles: { color: "#ff0000" } },
                                                {
                                                    title: "Badge",
                                                    inline: "span",
                                                    styles: {
                                                        display: "inline-block",
                                                        border: "1px solid #2276d2",
                                                        "border-radius": "5px",
                                                        padding: "2px 5px",
                                                        margin: "0 2px",
                                                        color: "#2276d2",
                                                    },
                                                },
                                                { title: "Table row 1", selector: "tr", classes: "tablerow1" },
                                                { title: "Image formats" },
                                                { title: "Image Left", selector: "img", styles: { float: "left", margin: "0 10px 0 10px" } },
                                                { title: "Image Right", selector: "img", styles: { float: "right", margin: "0 0 10px 10px" } },
                                            ],
                                        }}
                                        onInit={(evt, editor) => (signatureRef.current = editor)}
                                    />
                                </div>
                            </div>
                        </section>
                        <footer className="mt-5 flex justify-end gap-3">
                            <button
                                type="button"
                                className="flex items-center rounded-full border-default !border-transparent bg-gray-10 px-4 py-2 text-15  font-bold text-gray-400 disabled:cursor-not-allowed"
                                onClick={closeModal}>
                                {t("Cancelar")}
                            </button>
                            <button
                                type="button"
                                className="flex items-center rounded-full border-default !border-transparent bg-primary-600 px-4 py-2 text-15  font-bold text-primary-200 disabled:cursor-not-allowed"
                                onClick={() => applySignature(signatureRef)}>
                                {t("Aplicar firma")}
                            </button>
                            <button
                                type="button"
                                className="flex items-center rounded-full border-default !border-transparent bg-primary-200 px-4 py-2 text-15  font-bold text-white disabled:cursor-not-allowed"
                                onClick={() => addSignature(signatureRef)}>
                                {t("Crear firma")}
                            </button>
                        </footer>
                    </div>
                </div>
            </div>
        </NewFormModal>
    );
};
