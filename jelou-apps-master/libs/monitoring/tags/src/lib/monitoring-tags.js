/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import { withTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useEventTracking } from "@apps/shared/hooks";

/* lodash */
import get from "lodash/get";
import orderBy from "lodash/orderBy";
import isEmpty from "lodash/isEmpty";
import includes from "lodash/includes";

import { CreateTag, TagsTable, DeleteTag, EditTag, FilterTags, Tag } from "../index.js";
import { JelouApiV1 } from "@apps/shared/modules";

const Tags = (props) => {
    const { company, teamsArray } = props;
    const bots = useSelector((state) => state.bots);
    const userSession = useSelector((state) => state.userSession);
    const botsMonitoring = useSelector((state) => state.botsMonitoring);
    const [allTeams, setAllTeams] = useState([]);
    const [teamsOptions, setTeamsOptions] = useState(teamsArray);
    const botEmail = botsMonitoring.find((bot) => bot.type === "email");
    const listTeamIdsEmail = get(botEmail, "properties.supportTickets.teams", []);
    const [loadingData, setLoadingData] = useState(true);
    const [loading, setLoading] = useState(false);
    const [color, setColor] = useState("#aabbcc");
    const [values, setValues] = useState({});
    const [addButton, setAddButton] = useState(true);
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [selectedBots, setSelectedBots] = useState([]);
    const [messageErrorCheckBox, setMessageErrorCheckBox] = useState("");
    const [messageErrorName, setMessageErrorName] = useState("");
    const trackEvent = useEventTracking();

    const onChangeTeams = (teams) => {
        setSelectedTeams(teams);
    };

    const onChangeBots = (bots) => {
        setSelectedBots(bots);
    };

    /* Table stuffs */
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [rows, setRows] = useState(20);
    const [maxPage, setMaxPage] = useState(null);

    /** edits & deletes */
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    /**  */

    const [tag, setTag] = useState({});

    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [loadingCreate, setLoadingCreate] = useState(false);

    const { t } = props;

    useEffect(() => {
        getTeams();
    }, []);

    useEffect(() => {
        if (!isEmpty(company)) {
            getTags();
        } else {
            setLoadingData(false);
        }
    }, [company, rows, page, teamsArray, teamsOptions]);

    const handleChange = ({ target }) => {
        const { name, value } = target;
        setValues({ ...values, [name]: value });
    };

    const openTagModal = () => {
        setSelectedBots([]);
        setSelectedTeams([]);
        setOpenModal(true);
        setMessageErrorCheckBox("");
        setMessageErrorName("");
    };

    const closeTemplateModal = () => {
        setOpenModal(false);
        setColor("#aabbcc");
        setValues({});
    };

    const openEditTagModal = (tag) => {
        setTag(tag);
        setColor(tag.color);
        setAddButton(tag.isGlobal);
        setSelectedTeams(tag.teams);
        setSelectedBots(tag.bots);
        setOpenEditModal(true);
    };

    const closeTagEditModal = () => {
        setOpenEditModal(false);
        setColor("#aabbcc");
        setValues({});
    };

    const openDeleteModal = () => {
        setOpenDelete(true);
    };

    const close = () => {
        setOpenDelete(false);
    };

    const deleteCurrentTag = (tag) => {
        setOpenDelete(true);
        setTag(tag);
    };

    const getTeams = () => {
        const { id } = company;
        const teamScopes = get(userSession, "teamScopes", []);
        JelouApiV1.get(`/company/${id}/teams`, {
            params: {
                limit: 200,
            },
        })
            .then(({ data }) => {
                const { results } = data;
                setAllTeams(results);
                if (!isEmpty(teamScopes)) {
                    const teamScopesFiltered = results.filter((team) => !includes(listTeamIdsEmail, team.id) && includes(teamScopes, team.id));
                    setTeamsOptions(teamScopesFiltered);
                } else {
                    const listTeamsIds = results.filter((team) => !includes(listTeamIdsEmail, team.id));
                    const listTeams = isEmpty(listTeamsIds) ? results : listTeamsIds;
                    setTeamsOptions(listTeams);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getTags = async () => {
        try {
            if (!isEmpty(company)) {
                setLoadingData(true);
                const teamIds = teamsOptions.map((team) => get(team, "id"));
                const companyId = get(company, "id");
                const { data } = await JelouApiV1.get(`/company/${companyId}/tags`, {
                    params: {
                        shouldPaginate: true,
                        page,
                        limit: rows,
                        joinTags: true,
                        ...(!isEmpty(teamsOptions) ? { teams: teamIds } : {}),
                    },
                });
                const { results = [], pagination = {} } = data;
                const tags = get(results, "rows", []);
                const _tags = tags.map((tag) => {
                    const isGlobal = get(tag, "isGlobal");
                    if (!isGlobal) {
                        const botsId = get(tag, "bots");
                        const _bot = botsId.map((botId) => bots.find((bot) => bot.id === botId));
                        const teamsId = get(tag, "teams");
                        const _team = teamsId.map((teamsId) => allTeams.find((team) => team.id === teamsId));
                        return { ...tag, bots: _bot, teams: _team };
                    }
                    return tag;
                });
                setData(orderBy(_tags, ["createdAt"], ["desc"]));
                setTotalResults(get(pagination, "total", 0));
                setMaxPage(get(pagination, "totalPages", 1));
                setLoadingData(false);
            }
        } catch (error) {
            setLoadingData(false);
            console.log(error);
        }
    };

    const createTag = async (event) => {
        event.preventDefault();

        trackEvent("Tag Created");

        try {
            const companyId = get(company, "id");
            const eitherOneEmpty = !isEmpty(selectedTeams) || !isEmpty(selectedBots);
            const validateTeamsBots = (!addButton && eitherOneEmpty) || addButton;
            if (!validateTeamsBots) {
                return setMessageErrorCheckBox(t("monitoring.Please select at least one team or one bot"));
            } else {
                setMessageErrorCheckBox("");
            }
            if (isEmpty(values.name)) {
                return setMessageErrorName(t("monitoring.Please set name tag"));
            }
            if (!isEmpty(company)) {
                setLoadingCreate(true);
                const botsId = selectedBots.map((bot) => bot.id);
                const teamsId = selectedTeams.map((team) => team.id);
                await JelouApiV1.post(`/company/${companyId}/tags`, {
                    name: { en: "", es: values.name },
                    color: color,
                    isGlobal: addButton,
                    ...(!addButton && { bots: botsId, teams: teamsId }),
                });
                setLoadingCreate(false);
                setOpenModal(false);
                getTags();
                setValues({});
            }
        } catch (error) {
            setLoadingCreate(false);
        }
    };

    const updateTag = async (event) => {
        event.preventDefault();
        try {
            const eitherOneEmpty = !isEmpty(selectedTeams) || !isEmpty(selectedBots);
            const validateTeamsBots = (!addButton && eitherOneEmpty) || addButton;
            if (!validateTeamsBots) {
                return setMessageErrorCheckBox(t("monitoring.Please select at least one team or one bot"));
            } else {
                setMessageErrorCheckBox("");
            }
            const { id } = tag;
            setLoadingUpdate(true);
            const companyId = get(company, "id");
            const botsId = selectedBots.map((bot) => bot.id);
            const teamsId = selectedTeams.map((team) => team.id);
            await JelouApiV1.patch(`/company/${companyId}/tags/${id}`, {
                ...(!isEmpty(values) ? { name: { en: "", es: values.name } } : {}),
                color: color,
                isGlobal: addButton,
                ...(!addButton && { bots: botsId, teams: teamsId }),
            });
            setLoadingUpdate(false);
            setOpenEditModal(false);
            getTags();
            setValues({});
        } catch (error) {
            console.log(error.response);
            setLoadingUpdate(false);
            console.log(error);
        }
    };

    const deleteTag = async (event) => {
        event.preventDefault();
        try {
            const companyId = get(company, "id");
            const { id } = tag;
            if (!isEmpty(company)) {
                await JelouApiV1.delete(`/company/${companyId}/tags/${id}`);
                setOpenDelete(false);
                getTags();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleAll = () => {
        onChangeBots([]);
        onChangeTeams([]);
        setAddButton(!addButton);
    };

    const cleanTeamFilter = () => {
        onChangeTeams([]);
    };
    const cleanBotFilter = () => {
        onChangeBots([]);
    };

    return (
        <div>
            <div className="py-8">
                <FilterTags openTagModal={openTagModal} />
            </div>
            <main>
                <div className="mx-auto pb-12">
                    <TagsTable
                        data={data}
                        page={page}
                        bots={bots}
                        nrows={rows}
                        setPage={setPage}
                        setRows={setRows}
                        maxPage={maxPage}
                        teams={teamsOptions}
                        loading={loadingData}
                        totalResults={totalResults}
                        sortAscClassName={"sort-asc"}
                        sortDescClassName={"sort-desc"}
                        openDeleteModal={openDeleteModal}
                        deleteCurrentTag={deleteCurrentTag}
                        openEditTagModal={openEditTagModal}
                    />
                </div>
            </main>
            {openModal && (
                <CreateTag
                    bots={bots}
                    color={color}
                    company={company}
                    setColor={setColor}
                    onSubmit={createTag}
                    teams={teamsOptions}
                    addButton={addButton}
                    handleAll={handleAll}
                    setLoading={setLoading}
                    title={t("Crear etiqueta")}
                    handleChange={handleChange}
                    onChangeBots={onChangeBots}
                    selectedBots={selectedBots}
                    onClose={closeTemplateModal}
                    onChangeTeams={onChangeTeams}
                    selectedTeams={selectedTeams}
                    cleanBotFilter={cleanBotFilter}
                    cleanTeamFilter={cleanTeamFilter}
                    loading={loadingCreate || loading}
                    messageErrorName={messageErrorName}
                    messageErrorCheckBox={messageErrorCheckBox}
                />
            )}
            {openEditModal && (
                <EditTag
                    tag={tag}
                    bots={bots}
                    color={color}
                    setColor={setColor}
                    onSubmit={updateTag}
                    teams={teamsOptions}
                    addButton={addButton}
                    handleAll={handleAll}
                    loading={loadingUpdate}
                    handleChange={handleChange}
                    onClose={closeTagEditModal}
                    selectedBots={selectedBots}
                    onChangeBots={onChangeBots}
                    title={t("Editar etiqueta")}
                    selectedTeams={selectedTeams}
                    onChangeTeams={onChangeTeams}
                    cleanBotFilter={cleanBotFilter}
                    cleanTeamFilter={cleanTeamFilter}
                    messageErrorName={messageErrorName}
                    messageErrorCheckBox={messageErrorCheckBox}
                />
            )}
            {openDelete && (
                <DeleteTag
                    title={
                        <div className="flex flex-row items-center">
                            {`¿${t("Eliminar etiqueta")}`}
                            <Tag tag={tag} />
                            {"?"}
                        </div>
                    }
                    onClose={close}
                    onSubmit={deleteTag}
                />
            )}
        </div>
    );
};
export default withTranslation()(Tags);
