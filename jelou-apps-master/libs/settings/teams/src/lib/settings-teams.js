import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import get from "lodash/get";
import Fuse from "fuse.js";

import first from "lodash/first";
import isEmpty from "lodash/isEmpty";
import toUpper from "lodash/toUpper";
import GeneralSettings from "./components/teams-general-settings/teams-general-settings";
import { TEAMS_SETTINGS } from "@apps/shared/constants";
import TeamsSidebar from "./components/teams-sidebar";
import TeamsSettingsMenu from "./components/teams-settings-menu/teams-settings-menu";
import { JelouApiV1 } from "@apps/shared/modules";

export function SettingsTeams(props) {
    const {
        monitorAllTeams,
        settingsSection,
        setSettingsSection,
        getBotConfig,
        selectedTeam,
        setSelectedTeam,
        company,
        loadingSettings,
        setOpenRestoreConfigModal,
        setKeysToRestore,
        settingsBodyRef,
        configSettingsBody,
        allBotConfig,
        bots,
        loadingUpdateEntity,
        setActualBot,
        settingsBody,
        handleSubmitConfig,
        noBodyData,
    } = props;

    const [allowSectionChange, setAllowSectionChange] = useState(true);
    const [openChangeConfigModal, setOpenChangeConfigModal] = useState(false);
    const [nextSection, setNextSection] = useState();
    const teamScopes = useSelector((state) => state.teamScopes);
    const [teamsList, setTeamsList] = useState([]);
    const [loadingTeams, setLoadingTeams] = useState(false);
    const [searchTeamValue, setSearchTeamValue] = useState("");
    const [teamsSearchResult, setTeamsSearchResult] = useState("");

    const getTeams = () => {
        const { id } = company;
        setLoadingTeams(true);
        JelouApiV1.get(`/company/${id}/teams`, {
            params: {
                limit: 150,
            },
        })
            .then(({ data }) => {
                const results = get(data, "results", []);
                if (monitorAllTeams) {
                    setTeamsList(results);
                    return;
                }
                const temporalTeamsList = results.filter((team) => teamScopes.some((teamScope) => teamScope === team.id));
                setTeamsList(temporalTeamsList);
            })
            .catch((err) => {
                setLoadingTeams(false);
                console.log(err);
            });
        setLoadingTeams(false);
    };

    useEffect(() => {
        setSelectedTeam(first(teamsList));
    }, [teamsList]);

    useEffect(() => {
        if (!isEmpty(selectedTeam)) {
            configSettingsBody();
        }
    }, [selectedTeam]);

    useEffect(() => {
        if (!isEmpty(selectedTeam)) {
            getBotConfig();
        }
    }, [selectedTeam]);

    useEffect(() => {
        setSettingsSection(TEAMS_SETTINGS.GENERAL);
    }, []);

    useEffect(() => {
        if (company) {
            getTeams();
        }
    }, [company]);

    const handleSearchTeam = ({ target }) => {
        const { value } = target;
        setSearchTeamValue(value);
        const fuse = new Fuse(teamsList, {
            keys: ["name"],
        });
        const result = fuse.search(value);
        const resultFiltered = result.map((result) => result.item);

        setTeamsSearchResult(resultFiltered);
    };

    const handleCleanSearch = () => {
        setSearchTeamValue("");
    };

    const handleChangeSection = (section) => {
        if (!allowSectionChange && settingsSection !== section) {
            setOpenChangeConfigModal(true);
            setNextSection(section);
        } else {
            setSettingsSection(section);
        }
    };

    const switchSection = (section) => {
        switch (toUpper(section)) {
            case TEAMS_SETTINGS.GENERAL:
                return (
                    <GeneralSettings
                        company={company}
                        loadingSettings={loadingSettings}
                        loadingUpdateEntity={loadingUpdateEntity}
                        setOpenRestoreConfigModal={setOpenRestoreConfigModal}
                        setKeysToRestore={setKeysToRestore}
                        handleSubmitConfig={handleSubmitConfig}
                        noBodyData={noBodyData}
                        bots={bots}
                        setActualBot={setActualBot}
                        settingsBodyRef={settingsBodyRef}
                        allBotConfig={allBotConfig}
                        settingsBody={settingsBody}
                        configSettingsBody={configSettingsBody}
                    />
                );
            default:
                break;
        }
    };
    return (
        <>
            <TeamsSidebar
                teamsSearchResult={teamsSearchResult}
                searchTeamValue={searchTeamValue}
                handleSearchTeam={handleSearchTeam}
                handleCleanSearch={handleCleanSearch}
                setSelectedTeam={setSelectedTeam}
                company={company}
                loadingTeams={loadingTeams}
                teamsList={teamsList}
            />
            <TeamsSettingsMenu settingsSection={settingsSection} handleChangeSection={handleChangeSection} setSettingsSection={setSettingsSection} />
            <div className="flex-1 rounded-r-1 bg-white">{switchSection(settingsSection)}</div>
        </>
    );
}
export default SettingsTeams;
