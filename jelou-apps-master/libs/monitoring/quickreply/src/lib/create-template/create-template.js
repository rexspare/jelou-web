import uniqid from "uniqid";
import get from "lodash/get";
import first from "lodash/first";
import isEmpty from "lodash/isEmpty";
import includes from "lodash/includes";

import toLower from "lodash/toLower";
import toUpper from "lodash/toUpper";
import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { BarLoader, BeatLoader } from "react-spinners";

import { Modal } from "@apps/shared/common";
import { JelouApiV1 } from "@apps/shared/modules";
import { QR_CONST } from "@apps/shared/constants";
import { TextArea } from "@apps/monitoring/ui-shared";
import { CloseIcon, FileIcon, CloseIcon2 } from "@apps/shared/icons";
import { Label, Input, MultiFormCombobox } from "@apps/shared/common";
import { useOnClickOutside } from "@apps/shared/hooks";
import { useSelector } from "react-redux";

const CreateTemplate = (props) => {
    const {
        goToBottom,
        setSubmitAllowed,
        multipleBot,
        submitAllowed,
        onClose,
        handleChange,
        handleParams,
        param,
        teams,
        cleanTeams,

        multipleTeam,
        handleMultipleBots,
        handleMultipleTeams,
        bottomViewRef,
        company,
        bots,
        mediaUrl,
        paramsNew,
        values,
        setErrors,
        errors,
        notify,
        setOpenCreateModal,
        readHsmTemplate,
        setValues,
        setParam,
        setParamsNew,
        setMultipleTeam,
        setMultipleBot,
    } = props;

    const [showNotification, setShowNotification] = useState(false);
    const [mediaFileName, setMediaFileName] = useState("");
    const [uploadingImage, setUploadingImage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isGlobalParam, setIsGlobalParam] = useState(true);
    const teamScopes = useSelector((state) => state.teams);

    const filteredTeams = !isEmpty(teamScopes) ? teams.filter((team) => includes(teamScopes, team.id)) : teams;

    const lang = useSelector((state) => state.userSession?.lang) ?? "es";

    const { t } = useTranslation();
    const formRef = useRef();

    useOnClickOutside(formRef, () => onClose());

    const handleAll = () => {
        setMultipleTeam([]);
        setMultipleBot([]);
        setIsGlobalParam(!isGlobalParam);
    };

    const handleImage = async (evt) => {
        const { target } = evt;
        const file = target.files[0];
        if (!file) {
            return;
        }
        if (toUpper(file.name.slice(-3)) !== "PNG" && toUpper(file.name.slice(-3)) !== "JPG" && toUpper(file.name.slice(-4)) !== "JPEG") {
            setShowNotification(true);
            return;
        }
        setShowNotification(false);
        setUploadingImage(true);
        var reader = new FileReader();
        let fileName = file.name.replace(/ /g, "_");
        fileName = uniqid() + `-${fileName}`;
        fileName = toLower(`${fileName}`);
        const path = `images/${fileName}`;
        reader.onloadend = async () => {
            // setFile(URL.createObjectURL(file));
            const imgUrl = await prepareFile(file, path);
            setUploadingImage(false);
            setMediaFileName(fileName);
            handleChange({ target: { name: "mediaUrl", value: imgUrl } });
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const prepareFile = async (file, path) => {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("path", path);
        const url = await uploadFile(formData);
        return url;
    };

    const uploadFile = async (formData) => {
        const { id } = first(bots);
        const { clientId, clientSecret } = company;

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

        return await JelouApiV1.post(`/bots/${id}/images/upload`, formData, config)
            .then(({ data }) => {
                return data;
            })
            .catch(({ err }) => {
                console.log(err, "==== Error");
            });
    };

    const imageAcceptance = () => {
        return "image/jpg, image/jpeg, image/png";
    };

    const removeDocFile = () => {
        setMediaFileName(null);
        handleChange({ target: { name: "mediaUrl", value: "" } });
    };

    const createHsmTemplate = async (event) => {
        event.preventDefault();
        let paramsNumber = get(values, "paramsNumber");
        const botIds =
            bots.length === 1
                ? [first(bots).id]
                : multipleBot.map((bot) => {
                      return bot.id;
                  });
        const teamIds = multipleTeam.map((team) => team.id);

        if (isEmpty(paramsNumber)) {
            paramsNumber = 0;
        }

        if (isEmpty(multipleBot) && isEmpty(multipleTeam) && !isGlobalParam) {
            setTimeout(() => {
                goToBottom();
            }, 500);

            setSubmitAllowed(false);
            return;
        }

        try {
            await JelouApiV1.post(`companies/${company.id}/macros/templates`, {
                type: "IMAGE",
                channelType: "chat",
                isGlobal: isGlobalParam,
                bots: botIds,
                teams: teamIds,
                displayName: values.displayName,
                body: values.template,
                params: paramsNew,
                paramsNumber,
                isVisible: QR_CONST.isVisible,
                ...(!isEmpty(mediaUrl) ? { type: "IMAGE" } : { type: "TEXT" }),
                language: QR_CONST.language,
                companyId: company.id,
                ...(!isEmpty(mediaUrl) ? { mediaUrl } : {}),
            });
            setLoading(false);
            setOpenCreateModal(false);
            readHsmTemplate();
            setValues({});
            setParam([]);
            setParamsNew([]);
            setMultipleBot([]);
            setMultipleTeam([]);
            notify(t("monitoring.Plantilla creada correctamente"));
        } catch (error) {
            console.log(error);
            setLoading(false);
            const { response } = error;
            const { data } = response;

            const validationError = get(data, "validationError", []);
            setErrors(validationError);
        }
    };

    let options = bots.map((bot) => {
        return { ...bot, label: bot.name, value: bot.id };
    });

    const inputCheckboxCheck =
        "mt-1 mr-2 h-5 w-5 border-1 border-gray-300 text-primary-200 checked:border-transparent checked:bg-primary-200 hover:checked:bg-primary-200 focus:ring-primary-200 focus:ring-opacity-25 focus:checked:bg-primary-200";

    const inputStringClassName =
        "outline-none h-34 w-full flex-1 rounded-xs border-transparent bg-primary-700 px-2 text-15 text-gray-400 ring-transparent focus:border-transparent focus:ring-transparent";

    const textareaClassName =
        "w-full resize-none overflow-y-auto rounded-xs border-transparent bg-primary-700 px-2 align-middle text-15 leading-normal text-gray-400 placeholder:text-gray-400 placeholder:text-opacity-65 focus:border-transparent focus:ring-transparent";

    const cancelButton = "focus:outline-none w-40 rounded-20 border-1 border-transparent bg-gray-10 p-2 text-base font-bold text-gray-400";
    const buttonActivated = "button button-primary focus:outline-none w-40";

    const getErrorValidation = (key) => {
        return first(errors[key]);
    };

    return (
        <Modal>
            <div className="fixed inset-x-0 top-0 z-120 overflow-y-auto sm:inset-0 sm:flex sm:items-center sm:justify-center">
                <div className="fixed inset-0 transition-opacity">
                    <div className="absolute inset-0 z-20 bg-gray-490/75" />
                </div>
                <div className="w-4/12 max-w-4xl justify-center" ref={formRef}>
                    <div className="relative z-50 m-auto flex max-h-content w-full flex-col overflow-hidden rounded-3xl bg-white opacity-100 shadow-modal">
                        <div className="flex items-center">
                            <div className="px-6 pt-8 font-bold text-gray-400">{t("monitoring.createQuickReply")}</div>
                        </div>
                        <button className="absolute right-0 mr-5 mt-4" onClick={onClose}>
                            <CloseIcon className="fill-current text-gray-400" width="1rem" height="1rem" />
                        </button>
                        <div className="relative my-4 w-full overflow-y-auto px-6">
                            <form onSubmit={createHsmTemplate} action="" autoComplete="off">
                                <div className="space-y-5">
                                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5">
                                        <Label name={t("monitoring.name")} />
                                        <div className="sm:col-span-2">
                                            <Input
                                                className={inputStringClassName}
                                                type="text"
                                                onChange={handleChange}
                                                placeholder={"ej: Bienvenida"}
                                                name="displayName"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {!isEmpty(get(errors, "elementName")) && (
                                        <span className="text-xs italic text-red-500">{t(errors["elementName"])}</span>
                                    )}

                                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5">
                                        <Label name={t("monitoring.numberOfParameters")} />
                                        <div className="sm:col-span-2">
                                            <Input
                                                className={inputStringClassName}
                                                type="number"
                                                min="0"
                                                onChange={handleChange}
                                                placeholder={"ej: 2"}
                                                name="paramsNumber"
                                            />
                                        </div>
                                    </div>
                                    {param.length > 0 && (
                                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5">
                                            <Label name={t("monitoring.parameters")} />
                                            <div className="flex flex-1 flex-col sm:col-span-2">
                                                {param.map((param, index) => {
                                                    return (
                                                        <div className="flex-1 pt-2" key={index}>
                                                            <Input
                                                                className={inputStringClassName}
                                                                type="text"
                                                                onChange={handleParams}
                                                                placeholder={"ej: operador"}
                                                                name={index + 1}
                                                                required
                                                            />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5" id="template">
                                        <Label name={t("monitoring.content")} />
                                        <div className="sm:col-span-2">
                                            <TextArea
                                                required={true}
                                                className={textareaClassName}
                                                onChange={handleChange}
                                                placeholder={t("ej: ¡Hola! Somos *Jelou*. Te damos la bienvenida.")}
                                                name="template"
                                            />
                                        </div>
                                    </div>
                                    {!isEmpty(get(errors, "template")) && (
                                        <div className="w-full text-right text-xs italic text-red-500">
                                            {get(getErrorValidation("template"), `${lang}`, get(getErrorValidation["template"], "es", ""))}
                                        </div>
                                    )}

                                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5">
                                        <Label name={t("monitoring.attachedImage")} />
                                        <div className="sm:col-span-2">
                                            <label className="flex cursor-pointer items-center gap-0.5 text-primary-200">
                                                <FileIcon />
                                                <input
                                                    onChange={handleImage}
                                                    type="file"
                                                    hidden={true}
                                                    accept={imageAcceptance()}
                                                    id="image-upload"
                                                    name="mediaUrl"
                                                />
                                                <span className="text-sm">{t("monitoring.selectFile")}</span>
                                            </label>
                                        </div>
                                    </div>

                                    {uploadingImage ? (
                                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5">
                                            <div className="sm:col-span-2">
                                                <div className="my-1 flex h-11 w-full flex-row items-center justify-center pb-3">
                                                    <BarLoader size={"2.25rem"} color="#00b3c7" />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        !isEmpty(mediaUrl) && (
                                            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5">
                                                <p>&nbsp;</p>
                                                <div className="sm:col-span-2">
                                                    <div
                                                        className="grid grid-cols-8 items-start text-sm font-medium lg:text-justify"
                                                        style={{ color: "#9CB4CD" }}>
                                                        <div className="col-span-7 flex flex-row items-center rounded-lg border-1 p-3">
                                                            <img className="h-11 rounded-lg" src={mediaUrl} alt="Uploaded file"></img>
                                                            <p className="... ml-3  flex-1 truncate">{mediaFileName}</p>
                                                        </div>
                                                        <button
                                                            className="col-span-1"
                                                            onClick={() => {
                                                                removeDocFile();
                                                            }}>
                                                            <CloseIcon2 />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )}

                                    <div className="mt-4 border-b-default border-gray-200"></div>

                                    <div className="mt-4">
                                        <p className="font-bold text-gray-400">{t("monitoring.availabilityForTeamsAndBots")}</p>
                                    </div>

                                    <div className="flex items-center sm:pt-3">
                                        <div className="mr-2 flex">
                                            <input
                                                id="allSelection"
                                                checked={isGlobalParam}
                                                onChange={handleAll}
                                                name="addButton"
                                                type="radio"
                                                className={inputCheckboxCheck}
                                            />
                                        </div>
                                        <div className="flex items-center">
                                            <label htmlFor="allSelection" className="text-sm text-gray-400">
                                                {t("monitoring.quickReplyForEveryone")}
                                            </label>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <div className="mr-2 flex">
                                            <input
                                                id="individualSelection"
                                                checked={!isGlobalParam}
                                                onChange={handleAll}
                                                name="addButton"
                                                type="radio"
                                                className={inputCheckboxCheck}
                                            />
                                        </div>
                                        <div className="flex">
                                            <label htmlFor="individualSelection" className="text-sm text-gray-400">
                                                {t("monitoring.specifyTeamOrBot")}
                                            </label>
                                        </div>
                                    </div>
                                    {!isGlobalParam && (
                                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5">
                                            <Label name={"Bot"} />
                                            <div className="sm:col-span-2">
                                                <MultiFormCombobox
                                                    position="top"
                                                    handleChange={handleMultipleBots}
                                                    name="bot"
                                                    value={multipleBot}
                                                    options={options}
                                                    placeholder={t("monitoring.chooseABot")}
                                                    hasCleanFilter={false}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    {!isGlobalParam && (
                                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5">
                                            <Label name={t("monitoring.Team")} />

                                            <div className="sm:col-span-2">
                                                <MultiFormCombobox
                                                    position="top"
                                                    handleChange={handleMultipleTeams}
                                                    name="team"
                                                    value={multipleTeam}
                                                    options={filteredTeams}
                                                    placeholder={t("monitoring.chooseATeam")}
                                                    clearFilter={cleanTeams}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {submitAllowed === false && (
                                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 ">
                                            <div className="col-span-1"></div>
                                            <div className=" col-span-2 flex items-center justify-end ">
                                                <div className="text-xs font-bold text-[#D6806F]">{"Debes seleccionar al menos un bot u equipo"}</div>
                                            </div>
                                        </div>
                                    )}

                                    {showNotification && (
                                        <div className="relative mt-2 w-full flex-1">
                                            <div className="absolute right-0 top-0 transform hover:scale-125">
                                                <div onClick={() => setShowNotification(false)} className="mr-1 mt-1 cursor-pointer p-1">
                                                    <CloseIcon
                                                        className="cursor-pointer rounded-full fill-current text-gray-400"
                                                        width="8"
                                                        height="8"
                                                    />
                                                </div>
                                            </div>
                                            <div className="bg-red-675-100 text-red-675-200 flex h-10 items-center rounded-default px-4 text-sm font-bold">
                                                {t("Imagen no soportada.")}
                                            </div>
                                        </div>
                                    )}
                                    <input type="submit" hidden={true} />

                                    <div className="flex justify-end space-x-3 pb-4 pt-4 " ref={bottomViewRef}>
                                        <button onClick={onClose} className={cancelButton}>
                                            {t("monitoring.Cancelar")}
                                        </button>
                                        <button type="submit" className={buttonActivated}>
                                            {loading ? <BeatLoader size={"0.5rem"} color={"#ffffff"} /> : t("monitoring.Crear")}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default CreateTemplate;
