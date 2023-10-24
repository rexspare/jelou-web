/* lodash */
import get from "lodash/get";
import omit from "lodash/omit";
import orderBy from "lodash/orderBy";
import isEmpty from "lodash/isEmpty";
import toUpper from "lodash/toUpper";
import includes from "lodash/includes";

import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";

import HsmTable from "./hsm-table/hsm-table";
import { JelouApiV1 } from "@apps/shared/modules";
import { QR_CONST } from "@apps/shared/constants";
import { getBotsMonitoring } from "@apps/redux/store";
import EditTemplate from "./edit-template/edit-template";
import CreateTemplate from "./create-template/create-template";
import DeleteQuickreply from "./delete-quickreply/delete-quickreply";

const QuickReplies = (props) => {
    const dispatch = useDispatch();
    const bots = useSelector((state) => state.botsMonitoring);
    const userSession = useSelector((state) => state.userSession);
    const company = useSelector((state) => state.company);
    const [bot, setBot] = useState({});
    const [loadingData, setLoadingData] = useState(true);
    const [values, setValues] = useState({});

    /* Table stuffs */
    const [row, setRows] = useState(20);
    const [data, setData] = useState([]);
    const [query, setQuery] = useState("");
    const [maxPage, setMaxPage] = useState(null);
    const [pageLimit, setPageLimit] = useState(1);
    const [totalResults, setTotalResults] = useState("--");

    /** edits & deletes */
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [isGlobalParam, setIsGlobalParam] = useState(false);

    const [errors, setErrors] = useState([]);
    const [template, setTemplate] = useState({});
    const [paramsNew, setParamsNew] = useState([]);
    const [cancelToken, setCancelToken] = useState();
    const [teamOptions, setTeamOptions] = useState([]);
    const [multipleBot, setMultipleBot] = useState([]);
    const [multipleTeam, setMultipleTeam] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState([]);
    const [teamSelected, setTeamSelected] = useState([]);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [param, setParam] = useState([]); //array for parameters number
    const [submitAllowed, setSubmitAllowed] = useState();

    const { t } = useTranslation();

    const botIdReference = useRef(bot.id);
    botIdReference.current = bot.id;

    const bottomViewRef = useRef(null);

    const goToBottom = () => {
        bottomViewRef.current.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (!isEmpty(company) && !isEmpty(userSession)) {
            dispatch(getBotsMonitoring());
            getTeamOptions();
        }
    }, [company, userSession]);

    const getTeamOptions = async () => {
        try {
            if (!isEmpty(company) && !isEmpty(userSession)) {
                const userId = get(userSession, "id", {});
                const { id } = company;
                const { data } = await JelouApiV1.get(`/company/${id}/teams`, {
                    params: {
                        operatorId: userId,
                        limit: 200,
                    },
                });
                let { results } = data;
                if (!isEmpty(userSession.teamScopes)) {
                    const teamScopes = userSession.teamScopes;
                    results = results.filter((team) => includes(teamScopes, team.id));
                }
                results = results.filter((team) => team.state === true);
                setTeamOptions(results);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const filterByTeam = (team) => {
        setTeamSelected(team.id);
    };

    useEffect(() => {
        readHsmTemplate();
    }, [bots, bot, row, pageLimit, query, teamSelected]);

    const changeBot = (bot) => {
        setBot(bot);
    };

    const handleChange = ({ target }) => {
        const { name, value } = target;

        if (name === "paramsNumber") {
            addParameters(value);
        }

        setValues({ ...values, [name]: value });
    };

    const handleBot = (bot) => {
        handleChange({ target: { name: "botIds", value: get(bot, "id") } });
    };

    const handleMultipleBots = (bot) => {
        if (!isEmpty(bot)) {
            setSubmitAllowed(true);
        }
        setMultipleBot(bot);
    };

    const handleMultipleTeams = (team) => {
        if (!isEmpty(bot)) {
            setSubmitAllowed(team);
        }
        setMultipleTeam(team);
    };

    const cleanBots = () => {
        setMultipleBot([]);
    };

    const handleCombobox = (team) => {
        handleChange({ target: { name: "teamId", value: get(team, "id", "") } });
    };

    const cleanTeams = () => {
        setTeamSelected("");
    };
    const cleanTeamsFilter = () => {
        setSelectedTeam("");
    };

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

    const handleParams = ({ target }) => {
        const { value, name } = target;
        let parametros = param.map((item) => {
            if (item.param.toString() === name) {
                param[name - 1].label = value;
            }
            return item;
        });
        setParamsNew(parametros);
    };

    const handleChangeParams = ({ target }) => {
        const { name, value } = target;

        if (isEmpty(value) || Number(value) === 0) {
            const number = Number(paramsNew.length);
            let i = 0;
            for (i; i < number; i++) {
                paramsNew.pop();
            }
            setParamsNew(paramsNew);
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
                    id: uuidv4(),
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
            if (item.label.toString() === name) {
                paramsNew[id - 1].label = value;
                paramsNew[id - 1].param = id;
            }
            return item;
        });
        setParamsNew(parametros);
    };

    const openCreateTemplateModal = () => {
        setOpenCreateModal(true);
    };

    const closeTemplateModal = () => {
        setSubmitAllowed(undefined);
        setParam([]);
        setValues({});
        setParamsNew([]);
        setMultipleBot([]);
        setOpenCreateModal(false);
    };

    const openEditTemplateModal = (template) => {
        setOpenEditModal(true);
        setTemplate(template);
        setParamsNew(template.params);
    };

    const closeTemplateEditModal = () => {
        setSubmitAllowed(undefined);
        handleMultipleBots([]);
        handleMultipleTeams([]);
        setValues({});
        setParamsNew([]);
        setOpenEditModal(false);
    };

    const openDeleteTemplateModal = () => {
        setOpenDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setOpenDeleteModal(false);
    };

    const deleteTemplate = (template) => {
        setOpenDeleteModal(true);
        setTemplate(template);
    };

    const readHsmTemplate = async () => {
        if (!isEmpty(cancelToken)) {
            await cancelToken.cancel("Cancelling");
        }
        const source = axios.CancelToken.source();
        setCancelToken(source);
        setLoadingData(true);
        try {
            {
                const { data } = await JelouApiV1.get(`companies/${company.id}/macros/templates`, {
                    params: {
                        page: pageLimit,
                        limit: row,
                        ...(!isEmpty(query) ? { displayName: query } : {}),
                        ...(!isEmpty(teamSelected) ? { teams: teamSelected } : {}),
                        ...(!isEmpty(bot) ? { bots: bot.id } : {}),
                        shoulPaginate: true,
                        ...(isEmpty(teamSelected) && isEmpty(bot) ? { joinMacros: false } : { joinMacros: true }),
                    },
                    cancelToken: source.token,
                });
                const { results = [], pagination } = data;
                const resultsParsed = results.map((param) => {
                    const { bots: botsList } = param;
                    const botsNames = [];
                    botsList.forEach((botId) => {
                        const botsMatched = bots.forEach((bot) => {
                            if (bot.id === botId) {
                                botsNames.push(bot.name);
                            }
                        });
                        return botsMatched;
                    });
                    const { teams: teamsList } = param;
                    const teamsNames = [];
                    teamsList.forEach((teamId) => {
                        const teamsMatched = teamOptions.forEach((team) => {
                            if (team.id === teamId) {
                                teamsNames.push(team.name);
                            }
                        });
                        return teamsMatched;
                    });

                    const botsInfo = { ...param, botsNames, teamsNames };
                    return botsInfo;
                });
                setData(resultsParsed);

                setTotalResults(pagination.total);
                setMaxPage(pagination.totalPages);
            }
            setLoadingData(false);
        } catch (error) {
            if (toUpper(error.message) === "CANCELLING") {
                setLoadingData(true);
            } else {
                setLoadingData(false);
                console.log(error);
            }
        }
    };

    const parseParams = (params) => {
        let parsedParams = [];
        params.forEach((index) => {
            let finalArray = omit(index, ["id"]);
            parsedParams.push(finalArray);
        });
        return parsedParams;
    };

    const updateHsmTemplate = async (event) => {
        const botIds = multipleBot.map((bot) => {
            return bot.id;
        });
        const teamIds = multipleTeam.map((team) => {
            return team.id;
        });

        if (isEmpty(multipleBot) && isEmpty(multipleTeam) && !isGlobalParam) {
            event.preventDefault();
            setTimeout(() => {
                goToBottom();
            }, 500);
            setSubmitAllowed(false);
            return;
        }

        setSubmitAllowed(undefined);
        try {
            event.preventDefault();
            // const botIds = get(values, "botId", botIdReference.current);
            const mediaUrl = get(values, "mediaUrl", get(template, "mediaUrl", ""));
            setLoadingUpdate(true);
            const { id } = template;
            const paramsNumber = paramsNew.length;
            await JelouApiV1.patch(`companies/${company.id}/macros/templates/${id}`, {
                displayName: values.displayName,
                body: values.template,
                isGlobal: isGlobalParam,
                params: parseParams(paramsNew),
                paramsNumber: paramsNumber,
                isVisible: QR_CONST.isVisible,
                ...(!isEmpty(mediaUrl) ? { type: "IMAGE" } : { type: "TEXT" }),
                teamId: Number(values.teamId),
                language: QR_CONST.language,
                bots: botIds,
                teams: teamIds,
                companyId: userSession.companyId,
                ...(!isEmpty(mediaUrl) ? { mediaUrl } : !isEmpty(get(template, "mediaUrl", [])) && isEmpty(mediaUrl) ? { mediaUrl: "" } : {}),
            });
            setLoadingUpdate(false);
            setIsGlobalParam(true);
            handleMultipleBots([]);
            handleMultipleTeams([]);
            setOpenEditModal(false);
            readHsmTemplate();
            setValues({});
            setParamsNew([]);
            notify(t("monitoring.Plantilla editada correctamente"));
        } catch (error) {
            setLoadingUpdate(false);
            console.log(error);
        }
    };

    const deleteTemplateModal = async (event) => {
        event.preventDefault();
        try {
            if (!isEmpty(company)) {
                setLoadingDelete(true);
                const { id } = template;
                await JelouApiV1.delete(`companies/${company.id}/macros/templates/${id}`);
                setLoadingDelete(false);
                setOpenDeleteModal(false);
                readHsmTemplate();
                notify(t("monitoring.Plantilla eliminada correctamente"));
            }
        } catch (error) {
            console.log(error);
            setLoadingDelete(false);
        }
    };

    const notify = (msg) => {
        toast.success(
            <div className="relative flex items-center justify-between">
                <div className="flex">
                    <svg className="mr-2" width="1.4rem" height="1.4rem" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M18.0256 8.53367C18.4071 8.91514 18.4071 9.5335 18.0256 9.91478L11.4742 16.4663C11.0928 16.8476 10.4746 16.8476 10.0931 16.4663L6.97441 13.3474C6.59294 12.9662 6.59294 12.3478 6.97441 11.9665C7.35569 11.585 7.97405 11.585 8.35533 11.9665L10.7836 14.3948L16.6445 8.53367C17.0259 8.15239 17.6443 8.15239 18.0256 8.53367ZM25 12.5C25 19.4094 19.4084 25 12.5 25C5.59063 25 0 19.4084 0 12.5C0 5.59063 5.59158 0 12.5 0C19.4094 0 25 5.59158 25 12.5ZM23.0469 12.5C23.0469 6.67019 18.329 1.95312 12.5 1.95312C6.67019 1.95312 1.95312 6.67095 1.95312 12.5C1.95312 18.3298 6.67095 23.0469 12.5 23.0469C18.3298 23.0469 23.0469 18.329 23.0469 12.5Z"
                            fill="#0CA010"
                        />
                    </svg>
                    <div className="text-15">{msg}</div>
                </div>
            </div>,
            {
                position: toast.POSITION.BOTTOM_RIGHT,
            }
        );
    };

    return (
        <div>
            <ToastContainer />
            <div className="mx-auto pb-12">
                <HsmTable
                    setBot={setBot}
                    row={row}
                    bot={bot}
                    data={orderBy(data, ["createdAt"], ["desc"])}
                    query={query}
                    setRows={setRows}
                    maxPage={maxPage}
                    botOptions={bots}
                    setQuery={setQuery}
                    pageLimit={pageLimit}
                    loading={loadingData}
                    changeBot={changeBot}
                    cleanTeams={cleanTeams}
                    teamOptions={teamOptions}
                    totalResults={totalResults}
                    setPageLimit={setPageLimit}
                    selectedTeam={selectedTeam}
                    filterByTeam={filterByTeam}
                    deleteTemplate={deleteTemplate}
                    setMultipleBot={setMultipleBot}
                    setTeamSelected={setTeamSelected}
                    openDeleteModal={openDeleteTemplateModal}
                    deleteTemplateModal={deleteTemplateModal}
                    openEditTemplateModal={openEditTemplateModal}
                    openCreateTemplateModal={openCreateTemplateModal}
                />
            </div>

            {openCreateModal && (
                <CreateTemplate
                    bottomViewRef={bottomViewRef}
                    setSubmitAllowed={setSubmitAllowed}
                    goToBottom={goToBottom}
                    submitAllowed={submitAllowed}
                    bots={bots}
                    param={param}
                    values={values}
                    errors={errors}
                    notify={notify}
                    teams={teamOptions}
                    setParam={setParam}
                    paramsNew={paramsNew}
                    setErrors={setErrors}
                    setValues={setValues}
                    cleanTeams={cleanTeamsFilter}
                    multipleBot={multipleBot}
                    multipleTeam={multipleTeam}
                    setMultipleTeam={setMultipleTeam}
                    setMultipleBot={setMultipleBot}
                    userSession={userSession}
                    handleChange={handleChange}
                    teamSelected={teamSelected}
                    handleParams={handleParams}
                    setParamsNew={setParamsNew}
                    onClose={closeTemplateModal}
                    handleCombobox={handleCombobox}
                    handleMultipleBots={handleMultipleBots}
                    handleMultipleTeams={handleMultipleTeams}
                    company={company}
                    readHsmTemplate={readHsmTemplate}
                    mediaUrl={get(values, "mediaUrl", "")}
                    setOpenCreateModal={setOpenCreateModal}
                />
            )}
            {openEditModal && (
                <EditTemplate
                    bottomViewRef={bottomViewRef}
                    submitAllowed={submitAllowed}
                    cleanBots={cleanBots}
                    setIsGlobalParam={setIsGlobalParam}
                    isGlobalParam={isGlobalParam}
                    botArray={bots}
                    notify={notify}
                    template={template}
                    teams={teamOptions}
                    handleBot={handleBot}
                    paramsNew={paramsNew}
                    loading={loadingUpdate}
                    cleanTeams={cleanTeamsFilter}
                    handleChange={handleChange}
                    onConfirm={updateHsmTemplate}
                    company={company}
                    handleCombobox={handleCombobox}
                    onClose={closeTemplateEditModal}
                    handleEditParams={handleEditParams}
                    title={t("monitoring.Editar mensaje rápido")}
                    mediaUrl={get(values, "mediaUrl", "")}
                    handleChangeParams={handleChangeParams}
                    handleMultipleBots={handleMultipleBots}
                    multipleBot={multipleBot}
                    handleMultipleTeams={handleMultipleTeams}
                    multipleTeam={multipleTeam}
                    setMultipleBot={setMultipleBot}
                    setMultipleTeam={setMultipleTeam}
                />
            )}
            {openDeleteModal && (
                <DeleteQuickreply
                    title={`${t("monitoring.Eliminar mensaje rápido")} ${template.displayName}?`}
                    template={template}
                    onClose={closeDeleteModal}
                    onSubmit={deleteTemplateModal}
                    loading={loadingDelete}
                />
            )}
        </div>
    );
};
export default QuickReplies;
