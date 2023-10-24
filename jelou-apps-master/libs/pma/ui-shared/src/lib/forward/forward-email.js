import get from "lodash/get";
import orderBy from "lodash/orderBy";
import isEmpty from "lodash/isEmpty";
import includes from "lodash/includes";
import first from "lodash/first";
import { useSelector } from "react-redux";
import { BeatLoader } from "react-spinners";
import { useTranslation } from "react-i18next";
import React, { useState, useRef, useEffect } from "react";
import { useOnClickOutside } from "@apps/shared/hooks";
import NewFormModal from "../new-form-modal/new-form-modal";
import ReactSelect from "../react-select/react-select";
import { JelouApiV1 } from "@apps/shared/modules";

const ForwardEmail = (props) => {
    const { closeModal, onChange, submitChange, success, operatorSelected, bot, loadingForwading, number } = props;
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [operators, setOperators] = useState([]);
    const [placeholder, setPlaceholder] = useState("Escoger operador");
    const currentEmail = useSelector((state) => state.currentEmail);
    const userTeams = useSelector((state) => state.userTeams);
    const allOperators = useSelector((state) => state.users);
    const company = useSelector((state) => state.company);
    const userSession = useSelector((state) => state.userSession);
    const byTeam = get(bot, "properties.supportTicketByTeam", false);

    const parseOperators = (operatorsArray) => {
        let operators = [];
        operatorsArray.forEach((operator) => {
            if (operator.providerId !== userSession.providerId) {
                const operatorTeam = first(get(operator, "Teams", []));
                operators.push({
                    value: operator.id,
                    label: `${operator.names}${operatorTeam ? ` - ${get(operatorTeam, "name", "")}` : ""}`,
                    companyId: operator.companyId,
                });
            }
        });
        if (isEmpty(operators)) {
            setPlaceholder("No hay operadores conectados");
        }
        return operators;
    };

    const getTicketTeams = () => {
        const teamIds = get(bot, "properties.supportTickets.teams", "");
        const ticketTeams = userTeams.filter((team) => includes(teamIds, team.id));
        if (!isEmpty(ticketTeams)) {
            return parseTeams(ticketTeams);
        } else {
            return [];
        }
    };

    const parseTeams = (teamsArray) => {
        let teams = [];
        teamsArray.forEach((team) => {
            teams.push({
                value: team.id,
                label: team.name,
                companyId: team.companyId,
            });
        });
        if (isEmpty(teams)) {
            setPlaceholder("No hay equipos disponibles");
        }
        return teams;
    };

    const getOperators = async () => {
        setLoading(true);
        const botId = get(bot, "id");
        const companyId = get(company, "id");
        const teams = get(bot, "properties.supportTickets.teams", "");

        if (!botId) {
            return;
        }

        try {
            const { data: response } = await JelouApiV1.get(`/company/${companyId}/teams/operators`, {
                params: {
                    active: 1,
                    status: "online",
                    teams,
                },
            });

            let data = get(response, "data", []);

            setOperators(parseOperators(data));
            setLoading(false);
        } catch (error) {
            console.log("=== ERROR", error);
            setLoading(false);
        }
    };

    const wrapperRef = useRef(null);

    const ref = useRef();
    useOnClickOutside(ref, closeModal);

    const handler = (e) => {
        if (e.keyCode === 27) {
            closeModal();
        }
    };

    useEffect(() => {
        document.addEventListener("keyup", handler);
        return () => {
            document.removeEventListener("keyup", handler);
        };
    }, []);

    const handleClickInside = (event) => {
        if (!(wrapperRef.current && !wrapperRef.current.contains(event.target))) {
            getOperators();
        }
    };

    useEffect(() => {
        // Bind the event listener
        document.addEventListener("mousedown", handleClickInside);
        document.addEventListener("touchend", handleClickInside);

        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickInside);
            document.removeEventListener("touchend", handleClickInside);
        };
    }, []);

    const filterOperator = (operators) => {
        if (byTeam) {
            return getTicketTeams();
        }
        const companyId = get(userSession, "companyId", false);
        if (!companyId) {
            return operators;
        }
        return operators.filter((operator) => {
            return operator.companyId === companyId;
        });
    };

    const getOptions = () => {
        return filterOperator(operators);
    };

    const disabled = operatorSelected === null ? true : false;

    return (
        <NewFormModal onClose={closeModal}>
            <div
                className={`relative min-w-[30rem] max-w-sm transform rounded-[1.375rem] bg-white px-4 pb-4 pt-5 shadow-modal transition-all sm:p-6 ${
                    operatorSelected ? "" : "pb-2"
                }`}
                ref={ref}>
                <div className="text-left text-base font-bold text-gray-400 md:text-xl">{t("pma.Transferir")}</div>
                <div className="flex flex-col items-center space-y-3">
                    <button className="absolute right-0 top-0 mr-4 mt-4" onClick={() => closeModal()}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M0.744913 12.7865L3.2609 15.3025L8.02135 10.5421L12.7605 15.2812L15.2737 12.768L10.5346 8.02887L15.2817 3.28171L12.7657 0.765728L8.01857 5.51289L3.25284 0.747158L0.73964 3.26036L5.50537 8.02609L0.744913 12.7865Z"
                                fill="#D7D7D7"
                            />
                        </svg>
                    </button>
                    <div className="flex w-full flex-col">
                        {operatorSelected && (
                            <div className="flex flex-col space-y-1">
                                <div className="whitespace-pre-line text-xl font-bold leading-snug text-primary-200 md:text-xl">
                                    {`${t("pma.Estás apunto de transferir")} ${
                                        !isEmpty(currentEmail) ? t("este email") : `${number} ${number > 1 ? "emails" : "email"}`
                                    }`}
                                </div>
                                <div className="pb-3 text-15 font-bold text-gray-400">{t("pma.Seguro que deseas hacerlo?")}</div>
                            </div>
                        )}

                        {success && (
                            <div className="mb-4 flex h-14 items-center rounded-default bg-whatsapp-200 px-4 font-bold text-whatsapp-350">
                                <svg width="25" height="25" className="mr-4" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M18.0256 8.53367C18.4071 8.91514 18.4071 9.5335 18.0256 9.91478L11.4742 16.4663C11.0928 16.8476 10.4746 16.8476 10.0931 16.4663L6.97441 13.3474C6.59294 12.9662 6.59294 12.3478 6.97441 11.9665C7.35569 11.585 7.97405 11.585 8.35533 11.9665L10.7836 14.3948L16.6445 8.53367C17.0259 8.15239 17.6443 8.15239 18.0256 8.53367ZM25 12.5C25 19.4094 19.4084 25 12.5 25C5.59063 25 0 19.4084 0 12.5C0 5.59063 5.59158 0 12.5 0C19.4094 0 25 5.59158 25 12.5ZM23.0469 12.5C23.0469 6.67019 18.329 1.95312 12.5 1.95312C6.67019 1.95312 1.95312 6.67095 1.95312 12.5C1.95312 18.3298 6.67095 23.0469 12.5 23.0469C18.3298 23.0469 23.0469 18.329 23.0469 12.5Z"
                                        fill="#0CA010"
                                    />
                                </svg>
                                {t("monitoring.Conversación tranferida correctamente.")}
                            </div>
                        )}

                        <div ref={wrapperRef}>
                            <ReactSelect
                                defaultValue={props.operatorSelected}
                                placeholder={placeholder}
                                onChange={onChange}
                                name="operator"
                                options={orderBy(getOptions(), ["name"], ["asc"])}
                                loading={loading}
                                onBlur={(event) => event.preventDefault()}
                            />
                        </div>

                        <div className="mt-8 flex w-full justify-end space-x-2">
                            <button
                                className="h-[2.1037rem] w-[5.7663rem] rounded-[1rem] bg-gray-10 px-2 text-15 font-bold text-gray-400"
                                onClick={() => closeModal()}>
                                {t("pma.No")}
                            </button>
                            <button
                                disabled={disabled}
                                className="h-[2.1037rem] w-[5.7663rem] rounded-[1rem] bg-primary-200 px-2 text-15 font-bold text-white"
                                onClick={submitChange}>
                                {loadingForwading ? <BeatLoader size={"0.625rem"} color="#ffff" /> : t("pma.Sí")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </NewFormModal>
    );
};

export default ForwardEmail;
