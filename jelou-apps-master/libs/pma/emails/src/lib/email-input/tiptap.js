import uniqid from "uniqid";
import has from "lodash/has";
import get from "lodash/get";
import Tippy from "@tippyjs/react";
import toLower from "lodash/toLower";
import isEmpty from "lodash/isEmpty";
import { useSelector } from "react-redux";
import * as Sentry from "@sentry/react";
import { MoonLoader } from "react-spinners";
import { Editor } from "@tinymce/tinymce-react";
import { withTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { MAX_SIZE } from "@apps/shared/constants";
import { DocumentIcon, QuickReplyIcon, SendReplyIcon, TrashIcon } from "@apps/shared/icons";
import { ShowFiles } from "@apps/pma/ui-shared";
import { JelouApiV1 } from "@apps/shared/modules";
import CreateFirm from "./create-firm";
import Macros from "./macros";
import AddTo from "./add-to";
import AddCCs from "./add-ccs";
import { renderMessage } from "@apps/shared/common";
import AddFrom from "./add-from";

const Tiptap = (props) => {
    const {
        setShowEmailError,
        showEmailError,
        blackListEmails,
        lastMessageContext,
        editFromPermission,
        defaultSignature,
        setDefaultSignature,
        setShowDeleteMessageModal,
        sendMail,
        sending,
        textBox,
        attachments,
        setAttachments,
        to,
        setTo,
        cc,
        setCc,
        bcc,
        setBcc,
        t,
        signatures,
        text,
        setText,
        handleEditorChange,
        editorRef,
        bot,
        tipTapRef,
        from,
        setFrom,
        setSignatures,
        setAddedContext,
        addedContext,
        fontFamily,
    } = props;
    const currentEmail = useSelector((state) => state.currentEmail);
    const userSession = useSelector((state) => state.userSession);
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";
    const [openTableMenu, setOpenTableMenu] = useState(false);
    const [openMacrosModal, setOpenMacrosModal] = useState(false);
    const [macros, setMacros] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showCc, setShowCc] = useState(false);
    const [showBcc, setShowBcc] = useState(false);

    const attachmentAcceptance = () => {
        return ".xls, .xlsx, .doc, .docx, .ppt, .pdf , application/pdf, .html, .csv, .svg, .txt, .plain, html, csv, svg, txt, plain, .svg, .dmg, .rar, .zip, .yml, dmg, .php";
    };

    const imageAcceptance = () => {
        return "image/jpg, image/jpeg, image/png";
    };

    useEffect(() => {
        if (cc.length > 0) {
            setShowCc(true);
        }
    }, []);

    useEffect(() => {
        if (bcc.length > 0) {
            setShowBcc(true);
        }
    });

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

    const handleAttachment = async (event) => {
        try {
            const { target } = event;
            const file = target.files[0];
            var reader = new FileReader();
            const fileType = file.type.split("/").pop();
            let fileName = file.name.replace(/ /g, "_");
            fileName = uniqid() + `-${fileName}`;
            fileName = toLower(`${fileName}`);
            const path = `images/${fileName}`;
            const kbSize = file.size / 1000;

            event.target.value = null;

            // Verify that the file is supported.
            const imageAcceptancee = imageAcceptance().split(",");

            const isImageType = !!imageAcceptancee.find((acp) => fileType === acp.replace("image/", "").replace(/\s+/, ""));

            reader.onloadend = async () => {
                const url = await uploadFile(file, path);

                if (url && isImageType) {
                    editorRef.current.setContent({ src: url });
                }

                setAttachments([...attachments, { url, fileName }]);

                if (kbSize > MAX_SIZE) {
                    return;
                }
            };

            if (file) {
                reader.readAsDataURL(file);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const searchMacros = async () => {
        setOpenMacrosModal(true);
        getMacros();
    };

    const getMacros = async () => {
        setIsLoading(true);
        const { Company } = userSession;

        try {
            const { data } = await JelouApiV1.get(`/companies/${Company.id}/macros`);
            const { companyMacros, teamMacros } = data.data;

            setMacros([companyMacros, teamMacros]);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setMacros([]);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (defaultSignature) {
            setText(get(defaultSignature, "body", ""));
        }
    }, []);

    const closeModal = () => {
        setOpenMacrosModal(false);
    };

    const copyMacro = ({ macroPreview }) => {
        editorRef.current.insertContent(macroPreview.body);
        setOpenMacrosModal(false);
    };

    const deleteTo = () => {
        setTo([]);
    };

    const insertContext = () => {
        setAddedContext(true);
        editorRef.current.focus();
        editorRef.current.setContent(text + lastMessageContext);
    };
    return (
        <div className="py-4">
            <div className={`relative flex w-full flex-1 ${showCc || showBcc ? "flex-col" : "flex-row"} justify-between px-3`}>
                <div className={"flex flex-col"}>
                    {editFromPermission && (
                        <div className="mb-2 flex items-center">
                            <AddFrom
                                tipTapRef={tipTapRef}
                                blackListEmails={blackListEmails}
                                id="email"
                                setShowError={setShowEmailError}
                                showError={showEmailError}
                                title={"De"}
                                from={from}
                                setFrom={setFrom}
                                deleteFromArray={deleteTo}
                            />
                        </div>
                    )}
                    <div className="mb-2 flex items-center">
                        <AddTo blackListEmails={blackListEmails} id="email" title={"Para"} to={to} setTo={setTo} deleteFromArray={deleteTo} />
                    </div>
                </div>
                {showCc && (
                    <div className="mb-2 flex items-center">
                        <AddCCs blackListEmails={blackListEmails} title={"Cc"} cc={cc} setCc={setCc} t={t} />
                    </div>
                )}
                {showBcc && (
                    <div className="mb-2 flex items-center">
                        <AddCCs blackListEmails={blackListEmails} id="email2" title={"Bcc"} cc={bcc} setCc={setBcc} t={t} />
                    </div>
                )}
                <div className="flex justify-end space-x-1">
                    {!showCc && (
                        <button className="mb-2 flex items-center text-sm font-medium text-gray-400 hover:underline" onClick={() => setShowCc(true)}>
                            Cc
                        </button>
                    )}
                    {!showBcc && (
                        <button className="mb-2 flex items-center text-sm font-medium text-gray-400 hover:underline" onClick={() => setShowBcc(true)}>
                            Bcc
                        </button>
                    )}
                </div>
            </div>
            <div id="format-custom" className="relative">
                <Editor
                    apiKey="fi0lek2gijjyiyk6h2pl63hqjbxmikhcamncemv9fpy0csdb"
                    id="my-editor"
                    value={text}
                    init={{
                        selector: "textarea#format-custom",
                        height: 500,
                        auto_focus: "my-editor",
                        paste_data_images: true,
                        file_picker_types: "file image media",
                        plugins: ["link image lists", "searchreplace visualblocks code fullscreen", "insertdatetime table wordcount"],
                        toolbar:
                            "undo redo | formatselect | fontselect | bold italic underline strikethrough forecolor backcolor |link insertfile image | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | checklist | casechange",
                        table_default_attributes: {
                            id: "tiny-table",
                            border: "1px solid black",
                        },

                        table_style_by_css: false,
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
                            `pre {font-family:${fontFamily},Helvetica,sans-serif; }` +
                            ".example1 {} " +
                            `body { font-family:${fontFamily},Helvetica,sans-serif; font-size:14px }` +
                            ".tablerow1 { background-color: #D3D3D3; }",

                        formats: {
                            alignleft: { selector: "p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,audio,video", classes: "left" },
                            aligncenter: { selector: "p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,audio,video", classes: "center" },
                            alignright: { selector: "p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,audio,video", classes: "right" },
                            alignfull: { selector: "p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,audio,video", classes: "full" },
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
                            { title: "Table", selector: "table", classes: "editor-table" },
                            { title: "Image formats" },
                            { title: "Image Left", selector: "img", styles: { float: "left", margin: "0 10px 0 10px" } },
                            { title: "Image Right", selector: "img", styles: { float: "right", margin: "0 0 10px 10px" } },
                        ],
                    }}
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    onChange={handleEditorChange}
                    onEditorChange={(newValue, editor) => setText(newValue)}></Editor>
            </div>

            {false && (
                <Tippy content={t("pma.Ver historial")} theme={"tomato"} arrow={false}>
                    <button
                        className="absolute right-0 m-auto flex h-4 w-8 items-center justify-center rounded-full bg-[#D9DCE0]"
                        style={{ bottom: "4.375rem", right: "1.5625rem" }}
                        onClick={() => insertContext()}
                        disabled={addedContext}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                            />
                        </svg>
                    </button>
                </Tippy>
            )}

            {!isEmpty(attachments) && <ShowFiles attachments={attachments} setAttachments={setAttachments} canEdit />}
            <div className={"flex w-full justify-between border-t-default !border-gray-100 !border-opacity-25 px-4 pt-1"}>
                <div className={"flex w-full flex-1 items-center"}>
                    <div className="flex items-center gap-3 border-r-default !border-gray-100/25 pr-3">
                        <Tippy theme={"tomato"} content={t("pma.Adjuntar archivos")} touch={false} arrow={false}>
                            <button className="cursor-pointer ">
                                <label className="custom-file-upload flex cursor-pointer items-center justify-center" htmlFor="image-upload">
                                    <DocumentIcon className="fill-current text-gray-400/75" width="1.2rem" height="1.2rem" />
                                </label>
                                <input
                                    type="file"
                                    hidden
                                    id="image-upload"
                                    accept={attachmentAcceptance()}
                                    onChange={(event) => handleAttachment(event)}
                                />
                            </button>
                        </Tippy>
                        <Tippy theme={"tomato"} content={t("Macros")} touch={false} arrow={false}>
                            <button onClick={searchMacros}>
                                <QuickReplyIcon className="fill-current text-gray-400/75" width="1.2rem" height="1.2rem" />
                            </button>
                        </Tippy>

                        <section>
                            <CreateFirm
                                attachments={attachments}
                                setAttachments={setAttachments}
                                attachmentAcceptance={attachmentAcceptance}
                                handleAttachment={handleAttachment}
                                editorRef={editorRef}
                                setOpenTableMenu={setOpenTableMenu}
                                openTableMenu={openTableMenu}
                                t={t}
                                signatures={signatures}
                                userSession={userSession}
                                currentEmail={currentEmail}
                                text={text}
                                textBox={textBox}
                                setText={setText}
                                bot={bot}
                                defaultSignature={defaultSignature}
                                setDefaultSignature={setDefaultSignature}
                                setSignatures={setSignatures}
                            />
                        </section>
                    </div>
                    <div className="flex items-center pl-3">
                        <button
                            onClick={() => {
                                setShowDeleteMessageModal(true);
                            }}>
                            <TrashIcon width="16" height="18" className="fill-current text-gray-400 hover:text-gray-475" />
                        </button>
                    </div>

                    {openMacrosModal && (
                        <Macros
                            openMacrosModal={openMacrosModal}
                            setOpenMacrosModal={setOpenMacrosModal}
                            macros={macros}
                            closeModal={closeModal}
                            isLoading={isLoading}
                            copyMacro={copyMacro}
                        />
                    )}
                </div>

                <div>
                    <button
                        className="flex items-center rounded-full border-default !border-transparent bg-primary-200 px-4 py-2 text-13 font-bold text-white hover:bg-primary-100 disabled:cursor-not-allowed"
                        disabled={sending}
                        onClick={() => sendMail(editorRef)}>
                        {sending ? (
                            <div className="mr-2">
                                <MoonLoader sizeUnit="px" size={16} color="#ffffff" />
                            </div>
                        ) : (
                            <span>
                                <SendReplyIcon width="0.9375rem" height="0.6875rem" className="mr-2 fill-current text-white" />
                            </span>
                        )}

                        <span>{t("pma.Enviar")}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default withTranslation()(Tiptap);
