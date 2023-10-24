import { CloseIcon, SearchIcon } from "@apps/shared/icons";
import { Tab } from "@headlessui/react";
import isEmpty from "lodash/isEmpty";
import { DebounceInput } from "react-debounce-input";
import { useTranslation } from "react-i18next";
import { BeatLoader } from "react-spinners";

export function TeamsSidebar(props) {
    const { loadingTeams, searchTeamValue, teamsSearchResult, handleSearchTeam, handleCleanSearch, teamsList, setSelectedTeam } = props;
    const DEFAULT_LOGO = "/assets/illustrations/teams_default_logo.svg";
    const { t } = useTranslation();

    const handleSelectTeam = (team) => {
        setSelectedTeam(team);
    };

    return (
        <div className="mr-3 w-74 rounded-1 bg-white xl:w-[19rem]">
            <div className="relative flex flex-1 items-center rounded-t-1 border-b-0.5 border-gray-5 bg-white p-5">
                <div className="absolute left-4">
                    <SearchIcon fill={"#a6b4d0"} width="15" height="15" />
                </div>
                <DebounceInput
                    autoFocus={true}
                    className="outline-none focus:ring-[#a6b4d0]"
                    style={{
                        border: "1px solid rgba(166, 180, 208, 0.5)",
                        borderRadius: "1.5em",
                        resize: "none",
                        flex: "1",
                        height: "1.313rem",
                        padding: "1rem 0.75rem 1rem 2.5rem",
                        fontSize: "0.875rem",
                    }}
                    minLength={2}
                    value={searchTeamValue}
                    debounceTimeout={500}
                    placeholder={`${t("settings.bots.searchTeam")}`}
                    onChange={handleSearchTeam}
                />
                {!isEmpty(searchTeamValue) && (
                    <button className="absolute right-4" onClick={() => handleCleanSearch()}>
                        <CloseIcon className="cursor-pointer fill-current text-[#727C94] opacity-50" width="12" height="12" />
                    </button>
                )}
            </div>
            {loadingTeams ? (
                <div className="flex h-full items-center justify-center">
                    <div className={"-translate-y-20 transform"}>
                        <BeatLoader color={"#00B3C7"} size={"0.625rem"} />
                    </div>
                </div>
            ) : (
                <Tab.Group as="div" className="h-[72vh] overflow-auto">
                    <Tab.List>
                        {(searchTeamValue ? teamsSearchResult : teamsList)?.map((team, index) => {
                            return (
                                <Tab
                                    key={index}
                                    className="w-full"
                                    onClick={() => {
                                        handleSelectTeam(team);
                                    }}
                                >
                                    {({ selected }) => (
                                        <div className={`flex w-full items-center border-b-0.5 border-y-gray-5 px-5 py-3 ${selected ? "border-r-5 border-x-primary-200 bg-teal-5" : null}`}>
                                            <img className="mr-4 h-full w-12 rounded-full object-contain" src={DEFAULT_LOGO} alt="Logo_image" />
                                            <div>
                                                <p className="text-left text-base font-bold text-gray-400">{team.name}</p>
                                                <div className="flex items-center rounded-100"></div>
                                            </div>
                                        </div>
                                    )}
                                </Tab>
                            );
                        })}
                    </Tab.List>
                </Tab.Group>
            )}
        </div>
    );
}
export default TeamsSidebar;
