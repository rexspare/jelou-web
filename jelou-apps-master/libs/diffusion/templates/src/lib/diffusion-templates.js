import { DiffusionCreateTemplateHsm2023 } from "@apps/diffusion/create-template-hsm-2023";
import { DeleteTemplate, TemplatesTable, UpdateTemplate, ViewTemplate } from "@apps/diffusion/ui-shared";
import { ComboboxSelect, renderMessage as renderToastMessage, TextFilter } from "@apps/shared/common";
import { MESSAGE_TYPES } from "@apps/shared/constants";
import { useOnClickOutside } from "@apps/shared/hooks";
import { DownloadIcon, RefreshIcon } from "@apps/shared/icons";
import { DashboardServer, JelouApiV1 } from "@apps/shared/modules";
import Tippy from "@tippyjs/react";
import dayjs from "dayjs";
import FileDownload from "js-file-download";
import cloneDeep from "lodash/cloneDeep";
import first from "lodash/first";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import isUndefined from "lodash/isUndefined";
import omit from "lodash/omit";
import orderBy from "lodash/orderBy";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { BeatLoader, ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { v4 as uuid } from "uuid";

const DiffusionTemplates = (props) => {
    const { templatePermissionArr, bots, bot: initialBot, isCreateModalOpen, setIsCreateModalOpen, template, setTemplate, paramsNew, setParamsNew, setButtonsHsm, buttonsHsm } = props;
    const { t } = useTranslation();
    const [teams, setTeams] = useState([]);
    const [bot, setBot] = useState({});
    const [status, setStatus] = useState({});
    const [types, setTypes] = useState({});
    const [categoryChoose, setCategoryChoose] = useState(null);
    const [values, setValues] = useState({
        teamId: {
            id: "noTeam",
            name: t("hsm.noTeam"),
        },
    });
    /* Table stuffs */
    const [data, setData] = useState([]);
    const [totalResults, setTotalResults] = useState("--");
    const [pageLimit, setPageLimit] = useState(1);
    const [row, setRows] = useState(20);
    const [maxPage, setMaxPage] = useState(null);
    /** edits & deletes */
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [loadingCreate, setLoadingCreate] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [param, setParam] = useState([]);
    const [checked, setChecked] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const modalRef = useRef();
    const [templateName, setTemplateName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [currentBotId, setCurrentBotId] = useState("");
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const [paramsValidation, setParamsValidation] = useState(false);
    const [displayNameValidation, setDisplayNameValidation] = useState(false);
    const [isImageUploaded, setIsImageUploaded] = useState(true);
    const [loadingMedia, setLoadingMedia] = useState(false);
    const [showUpdateMessage, setShowUpdateMessage] = useState(false);
    const [fileType, setFileType] = useState("HSM");
    const [hsmCategory, setHsmCategory] = useState("UTILITY");
    const [opcAuth, setOpcAuth] = useState([]);
    const [mediaFileName, setMediaFileName] = useState("");
    const [weightFile, setWeightFile] = useState(null);
    const [mediaUrlMessage, setMediaUrlMessage] = useState(null);
    const [buttonInputsArray, setButtonInputsArray] = useState([1]);
    const [selectedType, setSelectedType] = useState({ id: "NONE", name: t("hsm.none") });
    const [isPreviewImageUploaded, setIsPreviewImageUploaded] = useState(false);
    const [confirmTestHsm, setConfirmTestHsm] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [validateElement, setValidateElement] = useState(false);
    const [loadingDownload, setLoadingDownload] = useState(false);
    const company = useSelector((state) => state.company);
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";
    const [state, setState] = useState("");
    const [cur, setCur] = useState("");
    const [oldParams, setOldParams] = useState(paramsNew);
    const [loadingRefresh, setLoadingRefresh] = useState(false);

    const templateTypeOptions = [
        { id: "HSM", name: t("hsm.HSM") },
        { id: "IMAGE", name: t("hsm.IMAGE") },
        { id: "VIDEO", name: t("hsm.VIDEO") },
        { id: "DOCUMENT", name: t("hsm.DOCUMENT") },
        // { id: "HSM_QUICKREPLY", name: t("hsm.HSM_QUICKREPLY") },
    ];
    const templateStatus = [
        { id: "PENDING", name: t("hsm.PENDING") },
        { id: "APPROVED", name: t("hsm.APPROVED") },
        // { id: "DISABLED", name: t("hsm.DISABLED") },
        { id: "REJECTED", name: t("hsm.REJECTED") },
    ];
    const hsmCategoryOptions = [
        { id: "UTILITY", info: t("hsm.utilityInfo"), name: t("hsm.UTILITY") },
        { id: "MARKETING", info: t("hsm.marketingInfo"), name: t("hsm.MARKETING") },
        { id: "AUTHENTICATION", info: t("hsm.authenticationInfo"), name: t("hsm.AUTHENTICATION") },
    ];

    const buttonTypes = [
        { id: "QUICK_REPLY", name: t("hsm.QUICK_REPLY") },
        { id: "CALL_TO_ACTION", name: t("hsm.CALL_TO_ACTION") },
        { id: "NONE", name: t("hsm.none") },
    ];

    const languageOptions = [
        { id: "es", name: t("hsm.spanish") },
        { id: "en", name: t("hsm.english") },
        { id: "pt_BR", name: t("hsm.portuguese") },
    ];
    const teamOptions = [{ id: "noTeam", name: t("hsm.noTeam") }].concat(orderBy(teams, ["name"], ["asc"]));

    const handleTemplateType = (value) => {
        const templateType = value.id;
        if (templateType === "HSM") {
            setFileType("HSM");
        }
        if (templateType === "IMAGE") {
            setFileType(".jpg, .png");
        }
        if (templateType === "DOCUMENT") {
            setFileType(".pdf");
        }
        if (templateType === "VIDEO") {
            setFileType(".mp4");
        }
    };
    const handleCombobox = (e, comboboxType) => {
        const value = e;
        let added = {};
        if (comboboxType === "type") {
            //added = { addButton: false };
            if (mediaFileName) {
                removeDocFile();
            }
            handleTemplateType(value);
        }
        setValues({ ...values, [comboboxType]: value, ...added });
    };
    const templateModalInputNames = {
        noTeam: t("hsm.noTeam"),
        name: t("hsm.name"),
        template: t("hsm.template"),
        content: t("hsm.content"),
        paramsNumber: t("hsm.paramsNumber"),
        parameters: t("hsm.parameters"),
        example: t("hsm.example"),
        language: t("hsm.language"),
        team: t("hsm.team"),
        visible: t("hsm.visible"),
        type: t("hsm.type"),
        attachedFile: t("hsm.attachedFile"),
        attachFile: t("hsm.attachFile"),
        button: t("hsm.button"),
        buttonsType: t("hsm.buttonsType"),
        actionType: t("hsm.actionType"),
        buttonsNumber: t("hsm.buttonsNumber"),
        buttons: t("hsm.buttons"),
        buttonsContent: t("hsm.buttonsContent"),
        buttonContent: t("hsm.buttonContent"),
        save: t("hsm.save"),
        continue: t("hsm.continue"),
        close: t("hsm.close"),
        cancel: t("hsm.cancel"),
        required: t("hsm.required"),
        replaceParams: t("hsm.replaceParams"),
        requiredAllFields: t("hsm.requiredAllFields"),
        placeholderExample: t("hsm.placeholderExample"),
        placeholderElementName: t("hsm.placeholderElementName"),
        placeholderLanguage: t("hsm.placeholderLanguage"),
        placeholderTeam: t("hsm.placeholderTeam"),
        placeholderParamsNumber: t("hsm.placeholderParamsNumber"),
        placeholderParameters: t("hsm.placeholderParameters"),
        placeholderDisplayName: t("hsm.placeholderDisplayName"),
        placeholderDisplayBot: t("hsm.placeholderDisplayBot"),
        noPreview: t("hsm.noPreview"),
        category: t("hsm.category"),
        confirmTitle: t("hsm.confirmTitle"),
        confirm: t("hsm.confirm"),
        preview: t("hsm.preview"),
        remember: t("hsm.remember"),
        confirmMsg: t("hsm.confirmMsg"),
        confirmQst: t("hsm.confirmQst"),
        edit: t("hsm.edit"),
        addButton: t("hsm.addButton"),
        lowerCase: t("hsm.lowerCase"),
        contentLength: t("hsm.contentLength"),
        nameLength: t("hsm.nameLength"),
        maxParams: t("hsm.maxParams"),
        yes: t("hsm.yes"),
        no: t("hsm.no"),
        paramsUnused: t("hsm.paramsUnused"),
        urlFormat: t("hsm.urlFormat"),
        phoneFormat: t("hsm.phoneFormat"),
        selectOtp: t("hsm.selectOPT"),
    };

    const handleSelect = (bot) => {
        setBot(bot);
    };
    const handleStatus = (statusObj) => {
        setStatus(statusObj);
    };
    const handleType = (typeObj) => {
        setTypes(typeObj);
    };
    const handleCategory = (typeCat) => {
        setCategoryChoose(typeCat);
    };
    useEffect(() => {
        if (isEmpty(teams)) {
            loadTeams();
        }
    }, []);

    useEffect(() => {
        if (!isEmpty(bots)) {
            setCurrentBotId(first(bots).id);
        }
    }, [bots]);

    useEffect(() => {
        if (!isEmpty(bots)) {
            setBot(initialBot);
            setCurrentBotId(first(bots).id);
        }
    }, [bots]);

    useEffect(() => {
        getHsmTemplate();
    }, [bot, templateName, row, pageLimit, status, types, categoryChoose]);

    useEffect(() => {
        setPageLimit(1);
    }, [bot, templateName, status, types]);

    const loadTeams = async () => {
        try {
            const companyId = get(company, "id");
            const { data } = await DashboardServer.get(`/companies/${companyId}/teams`);
            const results = get(data, "data", []);
            let teamArray = [{ id: -1, value: -1, name: "Todos" }];
            results.forEach((team) => {
                teamArray.push({ id: team.id, name: team.name });
            });
            setTeams(teamArray);
        } catch (error) {
            console.log(error);
        }
    };

    const downloadTemplates = async () => {
        try {
            setLoadingDownload(true);
            const { data } = await JelouApiV1.get(`bots/${get(bot, "id", "")}/templates`, {
                params: {
                    shouldPaginate: false,
                    download: true,
                    ...(templateName ? { query: templateName } : {}),
                    ...(status ? { status: status.id } : {}),
                    ...(types ? { type: types.id } : {}),
                    ...(categoryChoose ? { category: categoryChoose.id } : {}),
                },
                responseType: "blob",
            });
            setLoadingDownload(false);
            FileDownload(data, `templates_report_${dayjs().format("DD/MM/YYYY")}.xls`);
        } catch (error) {
            console.log(error);
        }
    };

    const openTemplateModal = (template, templateAction) => {
        if (templateAction === "view") {
            setIsViewModalOpen(true);
        } else if (templateAction === "update") {
            setIsUpdateModalOpen(true);
            setShowUpdateMessage(true);
        }
        setTemplate(template);
        setParamsNew([...template.params]);
        if (template.type === "IMAGE") {
            setFileType(".jpg, .png");
            setIsFileUploaded(true);
        }
        if (template.type === "DOCUMENT") {
            setFileType(".pdf");
            setIsFileUploaded(true);
        }
        if (template.type === "VIDEO") {
            setFileType(".mp4");
            setIsFileUploaded(true);
        }
        if (template.type === "HSM_QUICKREPLY") {
            setFileType("HSM_QUICKREPLY");
        }
    };

    const closeTemplateModal = () => {
        if (confirmTestHsm) {
            setConfirmTestHsm(false);
        } else {
            setSelectedType({ id: "QUICK_REPLY", name: t("hsm.QUICK_REPLY") });
            setHsmCategory("UTILITY");
            if (mediaFileName) {
                removeDocFile();
            }
            setIsCreateModalOpen(false);
            setIsViewModalOpen(false);
            setIsUpdateModalOpen(false);
            setParam([]);
            setChecked(false);
            setSubmitted(false);
            setFileType("HSM");
            setIsFileUploaded(false);
            setButtonInputsArray([1]);
            setIsImageUploaded(true);
            setParamsValidation(false);
            setValues({});
            setDisplayNameValidation(false);
            setIsPreviewImageUploaded(false);
        }
    };

    const close = () => {
        setOpenDelete(false);
    };

    const deleteTemplate = (template) => {
        setOpenDelete(true);
        setTemplate(template);
        setParamsNew([...template.params]);
    };

    const deleteTemplateModal = async () => {
        try {
            setLoadingDelete(true);
            const { botId, id } = template;
            await JelouApiV1.delete(`/bots/${botId}/templates/${id}`);
            setLoadingDelete(false);
            setOpenDelete(false);
            getHsmTemplate();
        } catch (error) {
            setLoadingDelete(false);
            console.log(error);
        }
    };

    const getHsmTemplate = async (refreshTable = false) => {
        try {
            if (refreshTable) {
                setLoadingRefresh(true);
            }
            if (!isEmpty(bot)) {
                setIsLoading(true);
                const { data } = await JelouApiV1.get(`/bots/${bot.id}/templates`, {
                    params: {
                        page: pageLimit,
                        limit: row,
                        ...(templateName ? { query: templateName } : {}),
                        ...(status ? { status: status.id } : {}),
                        ...(types ? { type: types.id } : {}),
                        ...(categoryChoose ? { category: categoryChoose.id } : {}),
                    },
                });
                if (!isEmpty(data.results)) {
                    const { results = [], pagination } = data;

                    results.forEach((param) => {
                        if (!isEmpty(param.params)) {
                            param.params.forEach((par) => {
                                const id = uuid();
                                par.id = id;
                            });
                        }
                    });
                    setOldParams(cloneDeep(get(data, "results", [])));
                    setData(
                        results.sort((a, b) => {
                            return new Date(b.createdAt) - new Date(a.createdAt);
                        })
                    );
                    setTotalResults(pagination.total);
                    setMaxPage(pagination.totalPages);
                    setLoadingRefresh(false);
                } else {
                    setData([]);
                }
                setIsLoading(false);
                setLoadingRefresh(false);
            }
        } catch (error) {
            setIsLoading(false);
            setLoadingRefresh(false);

            console.log(error);
        }
    };

    function validationElementName(value) {
        const regex = /[^a-zA-Z0-9_]/g;
        return regex.test(value);
    }

    useEffect(() => {
        if (!isEmpty(values.elementName)) {
            const elemName = validationElementName(values.elementName);
            setValidateElement(elemName);
        }
    }, [values]);

    const handleChange = (e) => {
        setCur(e.target.selectionStart);
        setState(e.target.value);
        // gives cursor index
        // this only shows cursor position if user types
        // I need to track the position of the cursor and add dropVal there
        setCur(e.target.selectionStart);
        function cleanElementName(value) {
            const regex = /[^a-zA-Z0-9\s_]/g;
            return value.replace(regex, "");
        }
        const { name } = e.target;
        let added = {};
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        if (e.target.type === "checkbox") {
            if (value) {
                setChecked(true);
                setIsChecked(true);
            } else {
                setChecked(false);
                setIsChecked(false);
            }
        }
        if (name === "paramsNumber") {
            addParameters(value);
        }
        if (name === "type") {
            if (mediaFileName) {
                removeDocFile();
            }
            handleTemplateType(e.target);
            added = { addButton: false };
        }
        if (name === "botId") {
            setCurrentBotId(value);
        }
        if (name === "displayName") {
            const elem = cleanElementName(value);
            added = { ...added, elementName: elem.toLowerCase().replaceAll(" ", "_") };
        }
        if (name === "elementName") {
            const elemName = validationElementName(value);
            setValidateElement(elemName);
            added = { ...added, elementName: value.toLowerCase() };
        }
        if (name === "template") setValues({ ...values, [name]: value, templateExample: value, ...added });
        else setValues({ ...values, [name]: value, ...added });
    };

    const onBlur = (e) => {
        setCur(e.target.selectionStart);
    };

    const addParamToContent = (option) => {
        setState(state.slice(0, cur) + `{{${option}}}` + state.slice(cur));
        const newObj = {
            ...values,
            template: state.slice(0, cur) + `{{${option}}}` + state.slice(cur),
            templateExample: state.slice(0, cur) + `{{${option}}}` + state.slice(cur),
        };
        setValues(newObj);
    };

    const handleUpdateChange = ({ target }) => {
        const { name } = target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        // if (name === "paramsNumber") {
        //     addParameters(value);
        // }
        if (name === "type") {
            if (mediaFileName) {
                removeDocFile();
            }
            handleTemplateType(target);
        }

        if (target.type === "checkbox") {
            if (value) {
                setChecked(true);
                setIsChecked(true);
            } else {
                setChecked(false);
                setIsChecked(false);
            }
        }
        setValues({ ...values, [name]: value });
    };

    const ParamsFormat = (templateObj) => {
        const parseTemplate = (template, params) => {
            let tempString = template;
            if (!isEmpty(params)) {
                params.forEach((param) => {
                    tempString = tempString.replaceAll(`{{${param.param}}}`, `${isEmpty(param.example) ? "" : param.example}`);
                });
                return tempString;
            }
            return template;
        };
        return parseTemplate(templateObj || "", paramsNew);
    };

    const parseParams = (params) => {
        let parsedParams = [];
        params.forEach((index) => {
            let finalArray = omit(index, ["id"]);
            parsedParams.push(finalArray);
        });
        return parsedParams;
    };

    const validateParams = (params, secondCheck = false) => {
        if (validateArray(params)) {
            setParamsValidation(true);
            return false;
        }
        for (let i = 0; i < params.length; i++) {
            if (params[i].label.trim() === "") {
                setParamsValidation(true);
                return false;
            }
            if (secondCheck && params[i].example === "") {
                setParamsValidation(true);
                return false;
            }
        }

        return true;
    };
    const validateDisplayName = (displayName) => {
        if (displayName === "") {
            setDisplayNameValidation(true);
            return false;
        }
        setDisplayNameValidation(false);
        return true;
    };
    const updateHsmTemplate = async () => {
        try {
            setSubmitted(true);
            const { botId, id } = template;
            const obj = {
                ...values,
                ...(values.teamId && values.teamId.id !== "noTeam" ? { teamId: values.teamId.id } : {}),
                ...(!isUndefined(values.isVisible) ? { isVisible: checked } : {}),
                params: parseParams(paramsNew),
            };
            validateDisplayName(values.displayName);
            validateParams(obj.params);
            if (validateDisplayName(values.displayName) && validateParams(obj.params) && isImageUploaded) {
                setLoadingUpdate(true);
                await JelouApiV1.patch(`/bots/${botId}/templates/${id}`, obj);
                setIsUpdateModalOpen(false);
                getHsmTemplate();
                setValues({});
                setLoadingUpdate(false);
                setSubmitted(false);
                setParamsValidation(false);
                setDisplayNameValidation(false);
                setMediaFileName(null);
                setWeightFile(null);
                setIsFileUploaded(false);
                setFileType("HSM");
            }
        } catch (error) {
            console.log(error);
        }
    };
    /* PARAMS */
    const addParameters = (value) => {
        if (isEmpty(value) || Number(value) === 0) {
            const number = Number(param.length);
            let i = 0;
            for (i; i < number; i++) {
                param.pop();
            }
            setParam(param);
        }

        if (Number(value) < param.length) {
            let newParam = [...param];

            let number = Number(param.length) - Number(value);

            let i = 0;

            for (i; i < number; i++) {
                newParam.pop();
            }
            setParam(newParam);
        }

        if (Number(value) > param.length) {
            let i = 0;
            const number = Number(value) - Number(param.length);

            let newParam = [...param];
            for (i; i < number; i++) {
                let obj = {
                    param: (i + 1).toString(),
                    label: "",
                };
                newParam.push(obj);
                setParam(newParam);
            }
        }

        if (Number(value) > param.length && param.length !== 0) {
            let i = 0;
            const number = Number(value) - Number(param.length);

            let newParam = [...param];
            for (i; i < number; i++) {
                let obj = {
                    param: (param.length + 1).toString(),
                    label: "",
                };
                newParam.push(obj);
                setParam(newParam);
            }
        }
    };

    const handleChangeParams = ({ target }) => {
        const { name, value } = target;

        if (isEmpty(value) || Number(value) === 0) {
            let newParam = [...paramsNew];
            const number = Number(newParam.length);
            let i = 0;
            for (i; i < number; i++) {
                newParam.pop();
            }
            setParamsNew(newParam);
        }

        if (value < paramsNew.length) {
            let newParam = [...paramsNew];

            let number = Number(paramsNew.length) - Number(value);

            let i = 0;
            for (i; i < number; i++) {
                newParam.pop();
            }
            setParamsNew(newParam);
        }

        if (value > paramsNew.length) {
            let i = 0;
            const number = Number(value) - Number(paramsNew.length);
            let newParam = [...paramsNew];
            for (i; i < number; i++) {
                let obj = {
                    id: uuid(),
                    param: "",
                    label: "",
                };
                newParam.push(obj);
                setParamsNew(newParam);
            }
        }
        setValues({ ...values, [name]: value });
    };

    const handleEditParams = ({ target }) => {
        const { value, name, id } = target;

        let parametros = paramsNew.map((item) => {
            if (item.id.toString() === name) {
                paramsNew[id - 1].label = value;
                paramsNew[id - 1].param = id;
                paramsNew[id - 1].example = "";
                // if (name === "replace") paramsNew[id - 1].modify = value;
                // else {
                //     paramsNew[id - 1].label = value;
                //     paramsNew[id - 1].modify = value;
                // }
            }
            if (`replace-${item.label}` === name) {
                paramsNew[id - 1].example = value;
            }
            return item;
        });
        setParamsNew(parametros);
    };

    const onChangeTemplateName = (evt) => {
        setTemplateName(evt);
    };

    useOnClickOutside(modalRef, () => setOpenDelete(false));

    const validateFileUploaded = () => {
        if (fileType === ".jpg, .png" || fileType === ".pdf" || fileType === ".mp4") {
            if (isFileUploaded) {
                return true;
            }
            return false;
        }
        return true;
    };

    const clickFilePicker = () => {
        // Sorry for this method... but it may be the easiest one 👯
        const filePicker = document.getElementById("file-picker");
        filePicker.click();
    };
    const removeDocFile = () => {
        const filePicker = document.getElementById("file-picker");
        if (filePicker) document.getElementById("file-picker").value = null;
        setMediaFileName(null);
        setWeightFile(null);
        setMediaUrlMessage(null);
        setIsFileUploaded(false);
        setIsImageUploaded(false);
    };
    // get extension from file string
    const getExtension = (file) => {
        const extension = file.split(".").pop();
        return extension;
    };
    const validateExtension = (file) => {
        const extension = getExtension(file).toLowerCase();
        const validDocExtensions = ["pdf"];
        const validImageExtensions = ["png", "jpg"];
        const validVideoExtensions = ["mp4"];

        if (fileType === ".pdf" && validDocExtensions.includes(extension)) {
            return true;
        }
        if (fileType === ".jpg, .png" && validImageExtensions.includes(extension)) {
            return true;
        }
        if (fileType === ".mp4" && validVideoExtensions.includes(extension)) {
            return true;
        }

        return false;
    };
    const getValidFileTypes = () => {
        switch (fileType) {
            case ".pdf":
                return ".pdf";
            case ".jpg, .png":
                return ".png, .jpg";
            case ".mp4":
                return ".mp4";
            default:
                return "";
        }
    };
    const handleDocFile = async (evt) => {
        const { files } = evt.target;
        const file = files[0];
        const fileNames = get(files, "[0].name");
        function MsgFile(fileType) {
            switch (fileType) {
                case ".pdf":
                    return "document";
                case ".jpg, .png":
                    return "image";
                case ".mp4":
                    return "video";
                default:
                    return "";
            }
        }
        if (!validateExtension(fileNames)) {
            toast.error(`${t("selectMessage.fileNotSupported")} ${t(`selectMessage.${MsgFile(fileType)}`)} (${getValidFileTypes()})`, {
                position: toast.POSITION.BOTTOM_RIGHT,
            });

            return;
        }
        try {
            setLoadingMedia(true);
            if (files && files.length) {
                let fileName = fileNames.replace(/ /g, "_");
                const path = `images/${fileName}`;
                const size = get(file, "size", "");
                const url = await prepareFile(file, path);
                setWeightFile(size);
                setMediaFileName(fileNames);
                setMediaUrlMessage(url);
                setLoadingMedia(false);
                setIsFileUploaded(true);
                setIsImageUploaded(true);
                setValues({ ...values, mediaUrl: url });
            }
        } catch (error) {
            console.log("error ==> ", error);
            setLoadingMedia(false);
        }
        setLoadingMedia(false);
    };

    const prepareFile = async (file, path) => {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("path", path);

        const url = await uploadFile(formData);

        return url;
    };
    const uploadFile = (formData) => {
        const config = {
            headers: {
                Authorization: "Basic cFM1T2lrUUt2SFUzM1YyaUN2STdVc0NnTGtaTzZFOUY6VHl4ZXhsUl9EUk53MEV4LWd2ZmZZcldaUmhZc3U0amM1LU9MbU5PS2pkQXVRMlY2YW95WFEyVXAybVA3aUFhbg==",
                "content-type": "multipart/form-data",
            },
        };
        return JelouApiV1.post(`/bots/${currentBotId}/images/upload/`, formData, config)
            .then(({ data }) => {
                return data;
            })
            .catch(({ err }) => {
                return err;
            });
    };

    const renderBeatLoader = () => {
        return (
            <div className="ml-2 flex h-6 w-12 flex-row">
                <BeatLoader size={"0.5rem"} color="#00B3C7" />
            </div>
        );
    };

    const handleUploadImage = () => {
        setIsPreviewImageUploaded(true);
    };

    const validateArray = (array) => {
        let result = false;
        if (array.some((obj) => obj.label.trim() === "")) {
            return;
        }
        array.forEach((obj, index) => {
            if (
                array.filter((obj2) => {
                    //Validate labels without spaces (no mutation)
                    let objCopy = { ...obj };
                    let obj2Copy = { ...obj2 };
                    objCopy.label = objCopy.label.replace(/\s/g, "");
                    obj2Copy.label = obj2Copy.label.replace(/\s/g, "").toLowerCase();
                    //
                    return obj2.label.toLowerCase() === obj.label.toLowerCase();
                }).length > 1
            ) {
                result = true;
            }
        });
        return result;
    };

    const clearFilter = (name) => {
        if (name === "status") {
            setStatus({});
        }
        if (name === "Category") {
            setCategoryChoose(null);
        }
        if (name === "type") {
            setTypes({});
        }
    };

    const refreshTable = () => {
        getHsmTemplate(true);
    };

    //Objeto filtro category

    const categoryType = [
        { id: "UTILITY", name: t("hsm.UTILITY") },
        { id: "MARKETING", name: t("hsm.MARKETING") },
        { id: "AUTHENTICATION", name: t("hsm.AUTHENTICATION") },
    ];

    if (templatePermissionArr.find((permission) => permission === "hsm:view_template")) {
        return (
            <div className="overflow-y-visible">
                <div className="flex w-full flex-col items-center justify-between px-2 lg:flex-row">
                    <div className="flex flex-1 space-x-6 p-2 py-4">
                        {bots.length > 1 && (
                            <div className="inline-flex w-2/12">
                                <label htmlFor="name" className="w-full">
                                    <ComboboxSelect
                                        options={bots}
                                        value={bot}
                                        placeholder={"Bots"}
                                        label={"Bots"}
                                        handleChange={handleSelect}
                                        name={"bot"}
                                        background={"#fff"}
                                        hasCleanFilter={false}
                                    />
                                </label>
                            </div>
                        )}
                        <div className="inline-flex w-2/12">
                            <TextFilter filter={"number"} onChange={onChangeTemplateName} background={"#fff"} label={t("hsm.template")} />
                        </div>
                        <div className="inline-flex w-2/12">
                            <label htmlFor="name" className="w-full">
                                <ComboboxSelect
                                    options={templateStatus.sort((a, b) => a.name.localeCompare(b.name))}
                                    value={status}
                                    placeholder={t("hsm.status")}
                                    label={t("hsm.status")}
                                    handleChange={handleStatus}
                                    name={"status"}
                                    background={"#fff"}
                                    hasCleanFilter={true}
                                    clearFilter={clearFilter}
                                />
                            </label>
                        </div>
                        <div className="inline-flex w-2/12">
                            <label htmlFor="name" className="w-full">
                                <ComboboxSelect
                                    options={categoryType}
                                    value={categoryChoose}
                                    placeholder={t("shop.table.category")}
                                    label={t("shop.table.category")}
                                    handleChange={handleCategory}
                                    name={"Category"}
                                    background={"#fff"}
                                    hasCleanFilter={true}
                                    clearFilter={clearFilter}
                                />
                            </label>
                        </div>
                        <div className="inline-flex w-2/12">
                            <label htmlFor="name" className="w-full">
                                <ComboboxSelect
                                    options={templateTypeOptions.sort((a, b) => a.name.localeCompare(b.name))}
                                    value={types}
                                    placeholder={t("hsm.type")}
                                    label={t("hsm.type")}
                                    handleChange={handleType}
                                    name={"type"}
                                    background={"#fff"}
                                    hasCleanFilter={true}
                                    clearFilter={clearFilter}
                                />
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center justify-end space-x-2 pl-4">
                        <Tippy content={t("hsm.refresh")} theme={"jelou"} placement={"bottom"} arrow={false}>
                            <button onClick={refreshTable} className="flex h-[1.90rem] w-[1.90rem] items-center justify-center rounded-full bg-gray-20 p-2 text-gray-425">
                                <RefreshIcon className={`text-gray-425  ${loadingRefresh ? "animate-spinother" : ""}`} width="1.25rem" height="1.25rem" fill="currentColor" />
                            </button>
                        </Tippy>
                        <Tippy content={t("clients.download")} theme={"jelou"} placement={"bottom"} arrow={false}>
                            <button className="color-gradient flex h-[1.90rem] w-[1.90rem] items-center justify-center rounded-full" onClick={downloadTemplates}>
                                {loadingDownload ? <ClipLoader color={"white"} size="1.1875rem" /> : <DownloadIcon width="0.813rem" height="0.875rem" fill="white" />}
                            </button>
                        </Tippy>
                    </div>
                </div>
                <div className="flex max-h-view flex-1 flex-col overflow-hidden">
                    <TemplatesTable
                        data={data}
                        totalResults={totalResults}
                        pageLimit={pageLimit}
                        setPageLimit={setPageLimit}
                        row={row}
                        setRows={setRows}
                        maxPage={maxPage}
                        deleteTemplate={deleteTemplate}
                        openTemplateModal={openTemplateModal}
                        templatePermissionArr={templatePermissionArr}
                        isLoading={isLoading}
                        lang={lang}
                    />
                </div>
                {openDelete && (
                    <DeleteTemplate
                        title={`${t("hsm.deleteTemplate")} ${template.displayName}?`}
                        onClose={close}
                        onConfirm={deleteTemplateModal}
                        refuseString={"hsm.cancel"}
                        agreeString={"hsm.deleteTemplate"}
                        className={"button button-danger focus:outline-none"}
                        loading={loadingDelete}
                        values={values}
                        template={template}
                        isPreviewImageUploaded={isPreviewImageUploaded}
                        paramsNew={paramsNew}
                        handleUploadImage={handleUploadImage}
                    />
                )}
                {isCreateModalOpen && (
                    <DiffusionCreateTemplateHsm2023
                        isCreateModalOpen={isCreateModalOpen}
                        setIsCreateModalOpen={setIsCreateModalOpen}
                        templateModalInputNames={templateModalInputNames}
                        handleChange={handleChange}
                        values={values}
                        handleCombobox={handleCombobox}
                        languageOptions={languageOptions}
                        botArray={bots}
                        teamOptions={teamOptions}
                        isChecked={isChecked}
                        hsmCategoryOptions={hsmCategoryOptions}
                        setHsmCategory={setHsmCategory}
                        hsmCategory={hsmCategory}
                        templateTypeOptions={templateTypeOptions}
                        fileType={fileType}
                        setFileType={setFileType}
                        loadingMedia={loadingMedia}
                        handleDocFile={handleDocFile}
                        clickFilePicker={clickFilePicker}
                        mediaUrlMessage={mediaUrlMessage}
                        removeDocFile={removeDocFile}
                        isFileUploaded={isFileUploaded}
                        mediaFileName={mediaFileName}
                        validateElement={validateElement}
                        getValidFileTypes={getValidFileTypes}
                        validateExtension={validateExtension}
                        getExtension={getExtension}
                        weightFile={weightFile}
                        onBlur={onBlur}
                        handleChangeParams={handleChangeParams}
                        paramsNew={paramsNew}
                        handleEditParams={handleEditParams}
                        addParamToContent={addParamToContent}
                        setValues={setValues}
                        setParamsNew={setParamsNew}
                        setButtonInputsArray={setButtonInputsArray}
                        setSelectedType={setSelectedType}
                        setOpcAuth={setOpcAuth}
                        opcAuth={opcAuth}
                        buttonTypes={buttonTypes}
                        selectedType={selectedType}
                        setButtonsHsm={setButtonsHsm}
                        buttonsHsm={buttonsHsm}
                        setIsChecked={setIsChecked}
                        setValidateElement={setValidateElement}
                        setWeightFile={setWeightFile}
                        company={company}
                        setSubmitted={setSubmitted}
                        currentBotId={currentBotId}
                        ParamsFormat={ParamsFormat}
                        validateFileUploaded={validateFileUploaded}
                        validateParams={validateParams}
                        checked={checked}
                        setLoadingCreate={setLoadingCreate}
                        JelouApiV1={JelouApiV1}
                        setConfirmTestHsm={setConfirmTestHsm}
                        setErrorMessage={setErrorMessage}
                        renderToastMessage={renderToastMessage}
                        lang={lang}
                        MESSAGE_TYPES={MESSAGE_TYPES}
                    />
                )}

                {isViewModalOpen && (
                    <ViewTemplate
                        title={t("hsm.viewTemplate")}
                        isChecked={isChecked}
                        onClose={closeTemplateModal}
                        template={template}
                        botArray={bots}
                        teamArray={teams}
                        paramsNew={paramsNew}
                        fileType={fileType}
                        buttonInputsArray={buttonInputsArray}
                        closeTemplateModal={closeTemplateModal}
                        templateTypeOptions={templateTypeOptions}
                        templateModalInputNames={templateModalInputNames}
                        renderBeatLoader={renderBeatLoader}
                        isPreviewImageUploaded={isPreviewImageUploaded}
                        handleUploadImage={handleUploadImage}
                        lang={lang}
                    />
                )}

                {isUpdateModalOpen && (
                    <UpdateTemplate
                        title={t("hsm.editTemplate")}
                        onClose={closeTemplateModal}
                        onConfirm={updateHsmTemplate}
                        template={template}
                        paramsNew={paramsNew}
                        values={values}
                        submitted={submitted}
                        fileType={fileType}
                        isFileUploaded={isFileUploaded}
                        closeTemplateModal={closeTemplateModal}
                        handleUpdateChange={handleUpdateChange}
                        loading={loadingUpdate}
                        handleEditParams={handleEditParams}
                        paramsValidation={paramsValidation}
                        displayNameValidation={displayNameValidation}
                        removeDocFile={removeDocFile}
                        isImageUploaded={isImageUploaded}
                        loadingMedia={loadingMedia}
                        handleDocFile={handleDocFile}
                        showUpdateMessage={showUpdateMessage}
                        templateModalInputNames={templateModalInputNames}
                        mediaFileName={mediaFileName}
                        renderBeatLoader={renderBeatLoader}
                        handleUploadImage={handleUploadImage}
                        isPreviewImageUploaded={isPreviewImageUploaded}
                        clickFilePicker={clickFilePicker}
                        isChecked={isChecked}
                        teamOptions={teamOptions}
                        handleCombobox={handleCombobox}
                        oldParams={oldParams}
                        setParamsNew={setParamsNew}
                    />
                )}
            </div>
        );
    } else return <div></div>;
};

export default DiffusionTemplates;
