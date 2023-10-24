import get from "lodash/get";
import orderBy from "lodash/orderBy";
import isEmpty from "lodash/isEmpty";
import includes from "lodash/includes";
import { useSelector } from "react-redux";
import { BeatLoader } from "react-spinners";
import { useTranslation, withTranslation } from "react-i18next";
import React, { useState, useRef, useEffect } from "react";

import Select from "../react-select/react-select";
import SelectMobile from "../select-mobile/select-mobile";
import { JelouApiV1 } from "@apps/shared/modules";
import FormModal from "../form-modal/form-modal";
import userTeams from "libs/redux/store/src/lib/reducers/userTeams";

const SwitchOperator = (props) => {
    const {
        closeModal,
        handleChange,
        submitChange,
        loading,
        loadingOptions,
        getOnlineOperators,
        byTeam,
        success,
        getAll,
        getAllTeams,
        getAllMyTeams,
        placeholder,
        noOptionsMessage,
        operators,
        tempOperator,
    } = props;
    const { t } = useTranslation();
    const [teams, setTeams] = useState([]);
    const [loadingTeams, setloadingTeams] = useState(false);
    const teamName = byTeam || getAllTeams ? t("pma.Seleccionar team") : t("pma.Seleccionar operador");
    const [team, setTeam] = useState(teamName);
    const noOptionName = byTeam || getAllTeams ? t("pma.No hay teams disponibles") : t("pma.No hay operadores disponibles");
    const noOption = useState(noOptionName);
    const wrapperRef = useRef(null);
    const userSession = useSelector((state) => state.userSession);
    const userTeams = useSelector((state) => state.userTeams);

    const handleClickInside = (event) => {
        if (!(wrapperRef.current && !wrapperRef.current.contains(event.target))) {
            getOnlineOperators();
        }
    };

    useEffect(() => {
        if (userTeams) {
            getTeams();
            // Bind the event listener
            document.addEventListener("mousedown", handleClickInside);

            return () => {
                // Unbind the event listener on clean up
                document.removeEventListener("mousedown", handleClickInside);
            };
        }
    }, [userTeams]);

    const getTeams = () => {
        const companyId = get(userSession, "companyId", false);

        JelouApiV1.get(`/company/${companyId}/teams/`, {
            params: {
                limit: 150,
            },
        })
            .then(({ data }) => {
                const { results } = data;
                const teamIds = getTeamIds();
                let activeTeams = [];
                setloadingTeams(false);
                if (isEmpty(teamIds) || getAllMyTeams) {
                    activeTeams = results.filter((result) => result.state === true);
                    setTeams(activeTeams);
                    return;
                }
                // const scopedTeams = results.filter((result) => includes(teamIds, result.id));
                activeTeams = results.filter((result) => result.state === true);

                setTeams(activeTeams);
            })
            .catch((err) => {
                console.log(err);
                setloadingTeams(false);
            });
    };

    const getTeamIds = () => {
        return userTeams.map((scope) => scope.id);
    };

    const filterOperator = (operators) => {
        const companyId = get(userSession, "companyId", false);
        if (!companyId) {
            return operators;
        }
        return operators.filter((operator) => {
            return operator.companyId === companyId;
        });
    };
    const getOptions = () => {
        if (byTeam || getAllTeams || getAllMyTeams) {
            if (userSession.teams) {
                const filteredTeams = getAllTeams ? teams : getAllMyTeams ? teams.filter((team) => includes(userSession.teams, team.id)) : teams;

                return filteredTeams;
            }
        } else {
            return filterOperator(operators);
        }
    };

    const selectOption = (option) => {
        setTeam(option);
        handleChange(option);
    };

    const selectTeam = ({ target }) => {
        const { value } = target;
        if (byTeam || getAllTeams) {
            let team = teams.find((team) => Number(value) === team.id);
            if (!isEmpty(team)) {
                team = { value: team.id, label: team.name };
                handleChange(team);
            }
        } else {
            const operator = operators.find((operator) => value === operator.value);
            handleChange(operator);
        }
    };

    const disabled = tempOperator === null ? true : false;

    return (
        <FormModal title="Transferir Chat" onClose={closeModal} maxWidth="md:min-w-560 md:max-w-560" wrapperRef={wrapperRef}>
            <div className="flex w-full flex-col">
                {success && (
                    <div className="mb-4 flex h-14 items-center rounded-default bg-whatsapp-200 px-4 font-bold text-whatsapp-350">
                        <svg width="1.563rem" height="1.563rem" className="mr-4" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M18.0256 8.53367C18.4071 8.91514 18.4071 9.5335 18.0256 9.91478L11.4742 16.4663C11.0928 16.8476 10.4746 16.8476 10.0931 16.4663L6.97441 13.3474C6.59294 12.9662 6.59294 12.3478 6.97441 11.9665C7.35569 11.585 7.97405 11.585 8.35533 11.9665L10.7836 14.3948L16.6445 8.53367C17.0259 8.15239 17.6443 8.15239 18.0256 8.53367ZM25 12.5C25 19.4094 19.4084 25 12.5 25C5.59063 25 0 19.4084 0 12.5C0 5.59063 5.59158 0 12.5 0C19.4094 0 25 5.59158 25 12.5ZM23.0469 12.5C23.0469 6.67019 18.329 1.95312 12.5 1.95312C6.67019 1.95312 1.95312 6.67095 1.95312 12.5C1.95312 18.3298 6.67095 23.0469 12.5 23.0469C18.3298 23.0469 23.0469 18.329 23.0469 12.5Z"
                                fill="#0CA010"
                            />
                        </svg>
                        {t("monitoring.Conversación tranferida correctamente.")}
                    </div>
                )}
                {!loadingTeams ? (
                    <div ref={wrapperRef}>
                        <Select
                            className="hidden w-full sm:block"
                            onChange={selectOption}
                            value={team}
                            name="operator"
                            options={orderBy(getOptions(), ["name"], ["asc"])}
                            placeholder={placeholder}
                            noOption={noOption}
                            statusDot={getAll}
                            loading={loadingOptions}
                            noOptionsMessage={noOptionsMessage}
                        />
                        <SelectMobile
                            onChange={selectTeam}
                            options={orderBy(getOptions(), ["name"], ["asc"])}
                            placeholder={byTeam || getAllTeams ? t("pma.Seleccionar team") : t("pma.Seleccionar operador")}
                        />
                    </div>
                ) : (
                    <div className="flex items-center justify-center">
                        <BeatLoader size={"0.625rem"} color="#00b3c7" />
                    </div>
                )}
                <div className="bg-modal-footer mt-0 flex w-full items-center justify-center rounded-b-lg pt-4 md:pt-8">
                    {loading ? (
                        <button className="btn-primary w-32 focus:outline-none">
                            <BeatLoader size={"0.625rem"} color="#ffff" />
                        </button>
                    ) : (
                        <button disabled={disabled} className="btn-primary w-32 font-bold focus:outline-none" onClick={submitChange}>
                            {t("pma.Transferir")}
                        </button>
                    )}
                </div>
            </div>
        </FormModal>
    );
};

export default withTranslation()(SwitchOperator);
