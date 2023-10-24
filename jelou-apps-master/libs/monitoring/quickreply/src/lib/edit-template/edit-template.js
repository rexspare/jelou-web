import { useEffect, useRef, useState } from "react";
import isEmpty from "lodash/isEmpty";
import includes from "lodash/includes";
// import isNull from "lodash/isNull";
import toLower from "lodash/toLower";
import first from "lodash/first";
import get from "lodash/get";
import toUpper from "lodash/toUpper";

import uniqid from "uniqid";

import { Label, Input, MultiFormCombobox } from "@apps/shared/common";
import { TextArea } from "libs/monitoring/ui-shared/src";
import { Modal } from "@apps/shared/common";
import { BarLoader, BeatLoader } from "react-spinners";

import { JelouApiV1 } from "@apps/shared/modules";
import { CloseIcon, FileIcon, CloseIcon2 } from "@apps/shared/icons";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useOnClickOutside } from "@apps/shared/hooks";

const EditTemplate = (props) => {
    const {
        bottomViewRef,
        submitAllowed,
        paramsNew,
        handleEditParams,
        setIsGlobalParam,
        isGlobalParam,
        handleChange,
        handleChangeParams,
        teams,
        t,
        cleanBots,
        botArray,
        company,
        onConfirm,
        onClose,
        loading,
        template,
        cleanTeams,
        handleMultipleBots,
        multipleBot,
        handleMultipleTeams,
        multipleTeam,
        setMultipleTeam,
        setMultipleBot,
    } = props;
    const { displayName, isGlobal, body, paramsNumber, bots, teams: teamsFromTemplate } = template;
    const teamScopes = useSelector((state) => state.teams);
    const filteredTeams = !isEmpty(teamScopes) ? teams.filter((team) => includes(teamScopes, team.id)) : teams;

    useEffect(() => {
        const actualTeams = filteredTeams.filter((team) => includes(teamsFromTemplate, team.id));
        const actualBots = options.filter((bot) => includes(bots, bot.id));
        setIsGlobalParam(isGlobal);
        setMultipleTeam(actualTeams);
        setMultipleBot(actualBots);
    }, []);

    const ref = useRef();

    useOnClickOutside(ref, () => onClose());

    let options = botArray.map((bot) => {
        return { ...bot, label: bot.name, value: bot.id };
    });

    let array = isEmpty(paramsNew) ? [] : paramsNew;
    // let teamId = isNull(props.template.teamId) ? -1 : props.template.teamId;

    const [showNotification, setShowNotification] = useState(false);

    const [mediaUrl, setMediaUrl] = useState(get(template, "mediaUrl", ""));
    const [mediaFileName, setMediaFileName] = useState(get(template, "mediaUrl", ""));
    const [uploadingImage, setUploadingImage] = useState(false);

    const handleAll = () => {
        handleMultipleBots([]);
        handleMultipleTeams([]);
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
            setMediaUrl(imgUrl);
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

    const uploadFile = (formData) => {
        const { id } = first(botArray);
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

        return JelouApiV1.post(`/bots/${id}/images/upload`, formData, config)
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

    const inputCheckboxCheck =
        "h-5 w-5 border-1 border-gray-300 text-primary-200 checked:border-transparent checked:bg-primary-200 hover:checked:bg-primary-200 focus:ring-primary-200 focus:ring-opacity-25 focus:checked:bg-primary-200";

    const inputStringClassName =
        "outline-none h-34 w-full flex-1 rounded-xs border-transparent bg-primary-700 px-2 text-15 text-gray-400 ring-transparent focus:border-transparent focus:ring-transparent";

    const textareaClassName =
        "w-full resize-none overflow-y-auto rounded-xs border-transparent bg-primary-700 px-2 align-middle text-15 leading-normal text-gray-400 placeholder:text-gray-400 placeholder:text-opacity-65 focus:border-transparent focus:ring-transparent";

    const cancelButton = "focus:outline-none w-40 rounded-20 border-1 border-transparent bg-gray-10 p-2 text-base font-bold text-gray-400";
    const buttonActivated = "button button-primary focus:outline-none w-40";

    const removeDocFile = () => {
        setMediaFileName(null);
        setMediaUrl("");
        handleChange({ target: { name: "mediaUrl", value: "" } });
    };

    return (
        <Modal>
            <div className="fixed inset-x-0 top-0 z-120 overflow-y-auto sm:inset-0 sm:flex sm:items-center sm:justify-center">
                <div className="fixed inset-0 transition-opacity">
                    <div className="absolute inset-0 z-20 bg-gray-490/75" />
                </div>
                <div className="w-4/12 max-w-4xl justify-center" ref={ref}>
                    <div className="relative z-50 m-auto flex max-h-content w-full flex-col overflow-hidden rounded-3xl bg-white opacity-100 shadow-modal">
                        <div className="flex items-center">
                            <div className="px-6 pt-8 font-bold text-gray-400">{t("monitoring.editQuickReply")}</div>
                        </div>
                        <button className="absolute right-0 mr-5 mt-4" onClick={onClose}>
                            <CloseIcon className="fill-current text-gray-400" width="1rem" height="1rem" />
                        </button>
                        <div className="relative my-4 w-full overflow-y-auto px-6">
                            <form onSubmit={onConfirm} action="" autoComplete="off">
                                <div className="space-y-5">
                                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5">
                                        <Label name={t("monitoring.name")} />
                                        <div className="sm:col-span-2">
                                            <Input
                                                className={inputStringClassName}
                                                type="text"
                                                defaultValue={displayName}
                                                onChange={handleChange}
                                                name="displayName"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5">
                                        <Label name={t("monitoring.numberOfParameters")} />
                                        <div className="sm:col-span-2">
                                            <Input
                                                className={inputStringClassName}
                                                type="number"
                                                min="0"
                                                defaultValue={paramsNumber}
                                                onChange={handleChangeParams}
                                                placeholder={"ej: 2"}
                                                name="paramsNumber"
                                                required
                                            />
                                        </div>
                                    </div>
                                    {array.length > 0 && (
                                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5">
                                            <Label name={t("monitoring.parameters")} />
                                            <div className="flex flex-1 flex-col sm:col-span-2">
                                                {array.map((param, index) => {
                                                    return (
                                                        <div className="flex-1 pt-2" key={index}>
                                                            <Input
                                                                className={inputStringClassName}
                                                                type="text"
                                                                id={index + 1}
                                                                defaultValue={param.label}
                                                                onChange={handleEditParams}
                                                                placeholder={"ej: operador"}
                                                                name={`${param.label}`}
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
                                            <TextArea className={textareaClassName} defaultValue={body} onChange={handleChange} name="template" />
                                        </div>
                                    </div>

                                    <div className="sm:grid sm:grid-cols-3 sm:items-end sm:gap-4 sm:pt-5">
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
                                                    clearFilter={cleanBots}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    {!isGlobalParam && (
                                        <div className=" sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5">
                                            <Label name={t("monitoring.Team")} />
                                            <div className="sm:col-span-2">
                                                <MultiFormCombobox
                                                    handleChange={handleMultipleTeams}
                                                    name="team"
                                                    value={multipleTeam}
                                                    options={filteredTeams}
                                                    placeholder={t("monitoring.chooseATeam")}
                                                    clearFilter={cleanTeams}
                                                    position={"top"}
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
                                    <div className="flex justify-end space-x-3 pb-4 pt-4" ref={bottomViewRef}>
                                        <button onClick={onClose} className={cancelButton}>
                                            {t("monitoring.Cancelar")}
                                        </button>
                                        <button type="submit" className={buttonActivated}>
                                            {loading ? <BeatLoader size={"0.5rem"} color={"#e1e1e1"} /> : t("monitoring.Guardar")}
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

export default withTranslation()(EditTemplate);
