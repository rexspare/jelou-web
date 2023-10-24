import { Editor } from "@tinymce/tinymce-react";

import uniqid from "uniqid";
import toLower from "lodash/toLower";
import has from "lodash/has";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";

import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import Tippy from "@tippyjs/react";
import * as Sentry from "@sentry/react";

import { CloseIcon2, QuickReplyIcon } from "@apps/shared/icons";
import { MAX_SIZE } from "@apps/shared/constants";

import EmailConfigurationSection from "./EmailConfigurationSection";
import dayjs from "dayjs";
import { ClipLoader } from "react-spinners";
import { ShowFiles } from "@apps/pma/ui-shared";
import Macros from "../email-input/macros";
import AddTo from "../email-input/add-to";
import AddCCs from "../email-input/add-ccs";
import { DocumentIcon, SavedIcon, SendIconReplies, TrashIcon } from "@apps/shared/icons";
import { JelouApiV1, JelouApiPma } from "@apps/shared/modules";
import CreateFirm from "../email-input/create-firm";
import { useTranslation } from "react-i18next";
import { renderMessage } from "@apps/shared/common";

const OutboundEmailWindow = (props) => {
    const {
        allOperators,
        emailBodyHasChanged,
        setPrevEmailAssignation,
        bot,
        emailsTeams,
        setEmailsTeams,
        emailAssignationRef,
        sendEmail,
        outboundLoading,
        operators,
        setOutboundDueDate,
        setOperators,
        setOpenCloseEmailModal,
        setOpenDiscardEmailModal,
        minimizedOutboundWindow,
        setMinimizedOutboundWindow,
        to,
        cc,
        bcc,
        assignationType,
        setIsFavoriteOutbound,
        isFavoriteOutbound,
        textMessage,
        emailPriority,
        attachments,
        outboundDueDate,
        emailAssignation,
        setEmailAssignation,
        setBlockCreationTicket,
        setTo,
        setCc,
        setBcc,
        title,
        setTitle,
        sendIsLoading,
        setAttachments,
        setAssignationType,
        setTextMessage,
        setChatTags,
        priorityArray,
        setExpirationDate,
        expirationDate,
        setEmailPriority,
        chatTags,
        isSavedToday,
        savedDate,
        handleSaveDraft,
        emailNumber,
        gotEmailOperators,
        setGotEmailOperators,
        cleanEmailBody,
        setShowOutboundWindow,
        allTeams,
        setDefaultSignature,
        defaultSignature,
        setSignatures,
        signatures,
    } = props;

    const userSession = useSelector((state) => state.userSession);
    const [showCc, setShowCc] = useState(false);
    const [showBcc, setShowBcc] = useState(false);
    const [openMacrosModal, setOpenMacrosModal] = useState(false);
    const [isLoadingMacros, setIsLoadingMacros] = useState(false);
    const [macros, setMacros] = useState([]);
    const [changeAssignation, setChangeAssignation] = useState(false);

    const { t } = useTranslation();

    const attachmentAcceptance = () => {
        return ".xls, .xlsx, .doc, .docx, .ppt, .pdf , application/pdf, .html, .csv, .svg, .txt, .plain, html, csv, svg, txt, plain, .svg, .dmg, .rar, .zip, .yml, dmg, .php";
    };

    const imageAcceptance = () => {
        return "image/jpg, image/jpeg, image/png";
    };

    const parseTeams = (teamsArray) => {
        let teams = [];
        teamsArray.forEach((team) => {
            teams.push({
                value: team.id,
                name: team.name,
                companyId: team.companyId,
            });
        });

        return teams;
    };

    const getEmailTeams = () => {
        const filteredTeams = allTeams.filter((teamObj) => teamObj.properties?.views.some((el) => el.includes("emails")));

        setEmailsTeams(parseTeams(filteredTeams));
    };

    useEffect(() => {
        allTeams && getEmailTeams();
    }, []);

    const searchMacros = async () => {
        setOpenMacrosModal(true);
        getMacros();
    };

    const closeMacrosModal = () => {
        setOpenMacrosModal(false);
    };

    const getMacros = async () => {
        setIsLoadingMacros(true);
        const { Company } = userSession;

        try {
            const { data } = await JelouApiPma.get(`/v1/companies/${Company.id}/macros`);
            const { companyMacros, teamMacros } = data.data;

            setMacros([companyMacros, teamMacros]);
            setIsLoadingMacros(false);
        } catch (error) {
            console.log(error);
            setMacros([]);
            setIsLoadingMacros(false);
        }
    };

    const outboundEditorRef = useRef(null);

    const copyMacro = ({ macroPreview }) => {
        outboundEditorRef.current.insertContent(macroPreview.body);
        setOpenMacrosModal(false);
    };

    const handleSaveAssignationType = () => {
        setChangeAssignation(false);
    };

    const company = useSelector((state) => state.company);

    const settingFavorite = () => {
        setIsFavoriteOutbound(!isFavoriteOutbound);
    };

    useEffect(() => {
        if (defaultSignature) {
            setTextMessage(get(defaultSignature, "body", ""));
        }
    }, []);

    const uploadFile = async (file, path) => {
        const botId = get(bot, "id");
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
            // const documentAcceptancee = documentAcceptance().split(",");

            const isImageType = !!imageAcceptancee.find((acp) => fileType === acp.replace("image/", "").replace(/\s+/, ""));

            // const isDocType = !!documentAcceptancee.find((acp) => fileType === acp.replace("application/", "").replace(/\s+/, ""));
            // const isFileType = isImageType || isDocType;
            // if (!isFileType) {
            //     alert("Formato de imagen no soportado");
            //     return;
            // }

            reader.onloadend = async () => {
                const url = await uploadFile(file, path);

                if (url && isImageType) {
                    outboundEditorRef.current.setContent({ src: url });
                }

                setAttachments([...attachments, { url, fileName }]);

                if (kbSize > MAX_SIZE) {
                    renderMessage(t("pma.Tamaño de imagen excedido", "ERROR"));
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

    const handleChangeTypeAssignation = (value) => {
        setAssignationType(value);
    };

    const handleChangeAssignation = (value) => {
        setEmailAssignation(value);
    };

    //
    useEffect(() => {
        if (cc.length > 0) {
            setShowCc(true);
        }
    }, []);

    useEffect(() => {
        if (bcc.length > 0) {
            setShowBcc(true);
        }
    }, []);

    useEffect(() => {
        setPrevEmailAssignation(emailAssignation);
    }, []);

    const disabledSendEmail = !title || isEmpty(to) || !textMessage || !emailAssignation || !emailNumber;

    const onCloseEmail = () => {
        if (!emailBodyHasChanged) {
            setBlockCreationTicket(true);
            cleanEmailBody();
            setOpenCloseEmailModal(false);
            setShowOutboundWindow(false);
            return;
        }
        setOpenCloseEmailModal(true);
    };

    const deleteTo = () => {
        setTo([]);
    };

    useEffect(() => {
        if (emailAssignation) {
            emailAssignationRef.current = emailAssignation;
        }
    }, []);

    const fontFamily = get(bot, "properties.editorConfig.fontFamily", "Arial");

    return (
        <div
            className={
                !minimizedOutboundWindow &&
                `drop-shadow-xl fixed inset-x-0 top-0 z-[130] overflow-auto px-4 pt-8 sm:inset-0 sm:flex sm:items-center sm:justify-center sm:p-0`
            }>
            {!minimizedOutboundWindow && (
                <div className="fixed inset-0 transition-opacity">
                    <div className="absolute inset-0 z-120 bg-smoke-light" />
                </div>
            )}
            {minimizedOutboundWindow ? (
                <div
                    onClick={() => setMinimizedOutboundWindow(false)}
                    className=" drop-shadow-xl fixed bottom-0 right-5 z-[130] flex h-8 w-[23rem] items-center justify-between rounded-tl-lg rounded-tr-lg bg-[#00B3C7] hover:cursor-pointer">
                    <p className="pl-4 text-sm text-white">{`${t("pma.newEmail")} # ${emailNumber ? emailNumber : t("pma.notAssignedYet")}`}</p>
                    <div className="flex h-full items-center space-x-3 pr-4">
                        <svg
                            viewBox="0 0 20 20"
                            onClick={() => {
                                setMinimizedOutboundWindow(!minimizedOutboundWindow);
                            }}
                            className={`h-5 w-5 rotate-180 fill-current text-white text-opacity-50 transition-all hover:cursor-pointer hover:text-opacity-100`}>
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>

                        <button
                            className="flex items-center pt-[0.3px]"
                            onClick={() => {
                                onCloseEmail();
                            }}>
                            <CloseIcon2
                                fill="#fff"
                                fillOpacity="0.45"
                                className="font-fold mt-[0.25rem] cursor-pointer fill-current"
                                height="0.75rem"
                            />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="z-120 flex h-[95vh] w-[75vw] flex-col rounded-xl bg-white  xxl:h-[90vh] ">
                    <div className="flex h-8 items-center justify-between rounded-tl-xl rounded-tr-xl bg-[#00B3C7]">
                        <p className="pl-4 text-sm text-white">{`${t("pma.newEmail")} # ${emailNumber ? emailNumber : t("pma.notAssignedYet")}`}</p>
                        <div className=" flex items-center space-x-3 pr-4">
                            <svg
                                viewBox="0 0 20 20"
                                onClick={() => {
                                    setMinimizedOutboundWindow(!minimizedOutboundWindow);
                                }}
                                className={`h-5 w-5 fill-current text-white text-opacity-50 transition-all hover:cursor-pointer`}>
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>

                            <button
                                className="flex items-center pt-[0.3px]"
                                onClick={() => {
                                    onCloseEmail();
                                }}>
                                <CloseIcon2 fill="#fff" fillOpacity="0.45" className="font-fold cursor-pointer fill-current" height="0.7rem" />
                            </button>
                        </div>
                    </div>
                    <div className="flex h-full flex-col ">
                        <div className="h-full">
                            <div className="flex h-full">
                                <div className="flex w-full flex-col border-r-0.5 border-[#E8EAEE]">
                                    <div className={`flex border-b-0.5 border-[#E8EAEE] px-3 ${showCc || showBcc ? "flex-col" : "flex-row"}`}>
                                        <div
                                            className={`my-1 flex w-full items-center pb-1 ${
                                                (showCc || showBcc) && "border-b-0.5 border-[#E8EAEE]"
                                            }`}>
                                            <AddTo
                                                blackListEmails={[]}
                                                id="email"
                                                title={t("pma.to")}
                                                to={to}
                                                setTo={setTo}
                                                deleteFromArray={deleteTo}
                                            />
                                        </div>
                                        {showCc && (
                                            <div className="mb-2 flex items-center border-b-0.5 border-[#E8EAEE] pb-1">
                                                <AddCCs blackListEmails={[]} title={"Cc"} cc={cc} setCc={setCc} t={t} />
                                            </div>
                                        )}
                                        {showBcc && (
                                            <div className={`mb-2 flex items-center pb-1 ${!showCc && "border-b-0.5 border-[#E8EAEE]"}`}>
                                                <AddCCs blackListEmails={[]} id="email2" title={"Bcc"} cc={bcc} setCc={setBcc} t={t} />
                                            </div>
                                        )}
                                        <div className="flex justify-end space-x-1">
                                            {!showCc && (
                                                <button
                                                    className={`flex items-center font-semibold ${
                                                        showBcc && "pb-2"
                                                    } text-sm text-gray-400 hover:underline`}
                                                    onClick={() => setShowCc(true)}>
                                                    Cc
                                                </button>
                                            )}
                                            {!showBcc && (
                                                <button
                                                    className={`flex items-center text-sm font-semibold text-gray-400 hover:underline ${
                                                        showCc && "pb-2"
                                                    }`}
                                                    onClick={() => setShowBcc(true)}>
                                                    Bcc
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className=" my-1 ml-3 flex">
                                        <span className="text-sm font-medium text-gray-400">{`${t("pma.title")}:`}</span>
                                        <div className="flex flex-1 items-center">
                                            <input
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                className="relative flex w-full items-center justify-between border-transparent p-0 pl-3 text-sm text-gray-400  focus:border-transparent focus:ring-transparent"
                                                type="text"
                                            />
                                        </div>
                                    </div>
                                    <div id="format-custom" className="flex h-full flex-col">
                                        <Editor
                                            apiKey="fi0lek2gijjyiyk6h2pl63hqjbxmikhcamncemv9fpy0csdb"
                                            id="outbound_editor"
                                            // initialValue={get(defaultSignature, "body", "")}
                                            value={textMessage}
                                            init={{
                                                selector: "outbound_editor#format-custom",
                                                height: "100%",
                                                menubar: false,

                                                paste_data_images: true,
                                                file_picker_types: "file image media",
                                                plugins: [
                                                    "link image lists",
                                                    "searchreplace visualblocks code fullscreen",
                                                    "insertdatetime table wordcount",
                                                ],
                                                toolbar:
                                                    "formatselect | bold italic underline strikethrough forecolor backcolor | link insertfile image | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | checklist | casechange",
                                                table_default_attributes: {
                                                    id: "tiny-table",
                                                    border: "1px solid black",
                                                },

                                                // setup: function (editor) {
                                                //     editor.on("init", function (e) {
                                                //         setTimeout(() => {
                                                //             outboundEditorRef.current.setContent(get(defaultSignature, "body", "") + lastMessageContext);
                                                //         }, 1000);
                                                //     });
                                                // },

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

                                                    // fromEditor.commands.focus("end");
                                                    // setAttachments([...attachments, { url, fileName }]);

                                                    if (kbSize > MAX_SIZE) {
                                                        renderMessage(t("pma.Tamaño de imagen excedido", "ERROR"));
                                                        return;
                                                    }
                                                    success(url);

                                                    // For now just a placeholder image to test that we reach here when a user pastes an image
                                                },
                                                language: localStorage.getItem("lang"),
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
                                                    { title: "Table", selector: "table", classes: "editor-table" },
                                                    { title: "Image formats" },
                                                    { title: "Image Left", selector: "img", styles: { float: "left", margin: "0 10px 0 10px" } },
                                                    { title: "Image Right", selector: "img", styles: { float: "right", margin: "0 0 10px 10px" } },
                                                ],
                                            }}
                                            onInit={(evt, editor) => (outboundEditorRef.current = editor)}
                                            // onChange={(e) => handleEditorChange(e)}
                                            onEditorChange={(newValue, editor) => setTextMessage(newValue)}></Editor>
                                        {!isEmpty(attachments) && <ShowFiles attachments={attachments} setAttachments={setAttachments} canEdit />}
                                    </div>
                                    <div className="border-t-0.5 border-[#E8EAEE] px-3 py-3">
                                        <div className="flex items-center space-x-2 pr-2">
                                            <Tippy theme={"tomato"} content={t("Adjuntar archivos")} touch={false} arrow={false}>
                                                <button className="flex  items-center justify-center  ">
                                                    <label className="hover:cursor-pointer" htmlFor="image-upload">
                                                        <DocumentIcon className="fill-current text-gray-400" width="1.2rem" height="1.2rem" />
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
                                            <div className="relative">
                                                <Tippy theme={"tomato"} content={t("Macros")} touch={false} arrow={false}>
                                                    <button className="flex items-center " onClick={searchMacros}>
                                                        <QuickReplyIcon className="fill-current text-gray-400 " width="1.2rem" height="1.2rem" />
                                                    </button>
                                                </Tippy>
                                            </div>
                                            <section>
                                                <CreateFirm
                                                    attachments={attachments}
                                                    setAttachments={setAttachments}
                                                    attachmentAcceptance={attachmentAcceptance}
                                                    handleAttachment={handleAttachment}
                                                    t={t}
                                                    signatures={signatures}
                                                    userSession={userSession}
                                                    bot={bot}
                                                    editorRef={outboundEditorRef}
                                                    defaultSignature={defaultSignature}
                                                    setDefaultSignature={setDefaultSignature}
                                                    setSignatures={setSignatures}
                                                />
                                            </section>
                                        </div>
                                    </div>
                                </div>
                                <EmailConfigurationSection
                                    allOperators={allOperators}
                                    emailsTeams={emailsTeams}
                                    gotEmailOperators={gotEmailOperators}
                                    setGotEmailOperators={setGotEmailOperators}
                                    setEmailAssignation={setEmailAssignation}
                                    setOperators={setOperators}
                                    operators={operators}
                                    bot={bot}
                                    changeAssignation={changeAssignation}
                                    setChangeAssignation={setChangeAssignation}
                                    priorityArray={priorityArray}
                                    outboundDueDate={outboundDueDate}
                                    setOutboundDueDate={setOutboundDueDate}
                                    t={t}
                                    settingFavorite={settingFavorite}
                                    isFavoriteOutbound={isFavoriteOutbound}
                                    handleChangeAssignation={handleChangeAssignation}
                                    handleChangeTypeAssignation={handleChangeTypeAssignation}
                                    assignationType={assignationType}
                                    emailAssignation={emailAssignation}
                                    emailPriority={emailPriority}
                                    handleSaveAssignationType={handleSaveAssignationType}
                                    setEmailPriority={setEmailPriority}
                                    setChatTags={setChatTags}
                                    chatTags={chatTags}
                                    company={company}
                                    expirationDate={expirationDate}
                                    setExpirationDate={setExpirationDate}
                                />
                            </div>
                        </div>
                        <div className="flex h-16 items-center justify-between rounded-b-xl  bg-[#EAF5F7] px-4">
                            <div className="flex items-center space-x-2 pl-2">
                                <span>
                                    <SavedIcon width="16" height="18" className="fill-current text-primary-200" />
                                </span>
                                <p className="text-13 font-semibold text-primary-200">
                                    {emailNumber
                                        ? isSavedToday
                                            ? `${t("pma.draftSavedTodayAt")} ${dayjs(savedDate).locale("es").format("hh:mm a")}`
                                            : `${t("pma.draftSavedOn")} ${dayjs(savedDate).locale("es").format("DD/MM/YYYY")} ${t("pma.at")} ${dayjs(
                                                  savedDate
                                              )
                                                  .locale("es")
                                                  .format("hh:mm a")}`
                                        : t("pma.draftNotSavedYet")}
                                </p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => (emailNumber ? setOpenDiscardEmailModal(true) : onCloseEmail())}
                                    className="group flex h-8 items-center space-x-2 rounded-[12px] border-default !border-[#D7DCE9]  px-4 py-2 font-bold text-gray-400">
                                    <span>
                                        <TrashIcon width="14" height="18" className="group-hover:text-grey-400 fill-current text-gray-400" />
                                    </span>
                                    <span className="group-hover:text-grey-400 text-15 group-hover:text-opacity-75">{t("pma.discard")}</span>
                                </button>
                                <button
                                    disabled={outboundLoading || sendIsLoading}
                                    onClick={() => {
                                        handleSaveDraft(true);
                                    }}
                                    className="group flex h-8 w-28 items-center space-x-2 rounded-[12px] bg-[#BFECF1] px-4  py-2 font-bold text-gray-400 disabled:hover:cursor-not-allowed">
                                    <span>
                                        <SavedIcon width="14" height="18" className="group-hover:text-primary-hover fill-current text-[#008D9D]" />
                                    </span>
                                    <span className="group-hover:text-primary-hover w-full text-15 text-[#008D9D]">
                                        {outboundLoading ? (
                                            <div className="tp-1 flex w-full items-center justify-center ">
                                                <ClipLoader size={"20px"} color="#00B3C7" />
                                            </div>
                                        ) : (
                                            t("pma.save")
                                        )}
                                    </span>
                                </button>
                                <button
                                    disabled={sendIsLoading || outboundLoading || disabledSendEmail}
                                    onClick={() => sendEmail()}
                                    className="hover:bg-primary-light flex h-8 w-28 items-center rounded-[12px] border-default !border-transparent bg-primary-200 px-4 py-2 font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-300 disabled:hover:cursor-not-allowed">
                                    <span>
                                        <SendIconReplies width="15" height="11" className="mr-2 fill-current text-white" />
                                    </span>
                                    <span className="flex w-full items-center justify-center">
                                        {sendIsLoading ? <ClipLoader size={"20px"} color="#fff" /> : <span className="text-15">{t("pma.send")}</span>}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {openMacrosModal && (
                <Macros
                    openMacrosModal={openMacrosModal}
                    setOpenMacrosModal={setOpenMacrosModal}
                    macros={macros}
                    closeModal={closeMacrosModal}
                    isLoading={isLoadingMacros}
                    copyMacro={copyMacro}
                />
            )}
        </div>
    );
};

export default OutboundEmailWindow;
