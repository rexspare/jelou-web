import get from "lodash/get";
import orderBy from "lodash/orderBy";
import isEmpty from "lodash/isEmpty";
import { useSelector } from "react-redux";
import { BeatLoader } from "react-spinners";
import { useTranslation } from "react-i18next";
import React, { useState, useRef, useEffect } from "react";

import { JelouApiV1 } from "@apps/shared/modules";
import ReactSelect from "../react-select/react-select";
import FormModal from "../form-modal/form-modal";
import SelectMobile from "../select-mobile/select-mobile";

const ForwardPost = (props) => {
    const { closeModal, onChange, submitChange, success, operatorSelected, bot, loadingForwading } = props;
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [operators, setOperators] = useState([]);
    const [placeholder, setPlaceholder] = useState("Escoger operador");
    const currentPost = useSelector((state) => state.currentPost);
    const company = useSelector((state) => state.company);

    const parseOperators = (operatorsArray) => {
        let operators = [];
        let operatorTeam = "";
        operatorsArray.forEach((operator) => {
            if (!isEmpty(operator.team)) {
                operatorTeam = ` - ${operator.team}`;
            }
            if (operator.providerId !== userSession.providerId) {
                operators.push({
                    value: `${operator.providerId}`,
                    label: `${operator.names}${operatorTeam}`,
                    companyId: operator.companyId,
                });
            }
        });
        if (isEmpty(operators)) {
            setPlaceholder("No hay operadores conectados");
        }
        return operators;
    };

    const getOperators = () => {
        setLoading(true);
        let teams = getTeamIds();
        const botId = get(currentPost, "bot.id");
        const byScope = get(bot, "properties.operatorView.hasTeamAssignationScope")
            ? get(bot, "properties.operatorView.hasTeamAssignationScope")
            : get(company, "properties.operatorView.hasTeamAssignationScope", false);

        if (!botId) {
            return;
        }

        JelouApiV1.get(`/operators`, {
            params: {
                active: 1,
                status: "online",
                ...(byScope && !isEmpty(teams) ? { teams: [teams] } : {}),
            },
        })
            .then((res) => {
                if (res.data === "Servicio no disponible") {
                    return;
                }

                const data = parseOperators(res.data);
                setOperators(data);
                setLoading(false);
            })
            .catch((err) => {
                console.log("=== ERROR", err);
                setLoading(false);
            });
    };

    const wrapperRef = useRef(null);
    const userSession = useSelector((state) => state.userSession);

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

    const getTeamIds = () => {
        const TeamScopes = get(userSession, "TeamScopes", []);
        return TeamScopes.map((scope) => scope.teamId);
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
        return filterOperator(operators);
    };

    const selectTeam = ({ target }) => {
        const { value } = target;
        const operator = props.operators.find((operator) => value === operator.value);
        onChange(operator);
    };

    const disabled = isEmpty(operatorSelected);

    return (
        <FormModal title="Transferir Publicación" onClose={closeModal} maxWidth="md:min-w-560 md:max-w-560">
            <div className="flex w-full flex-col">
                {success && (
                    <div className="bg-whatsapp-dark text-whatsapp-darker mb-4 flex h-14 items-center rounded-default px-4 font-bold">
                        <svg width="25" height="25" className="mr-4" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M18.0256 8.53367C18.4071 8.91514 18.4071 9.5335 18.0256 9.91478L11.4742 16.4663C11.0928 16.8476 10.4746 16.8476 10.0931 16.4663L6.97441 13.3474C6.59294 12.9662 6.59294 12.3478 6.97441 11.9665C7.35569 11.585 7.97405 11.585 8.35533 11.9665L10.7836 14.3948L16.6445 8.53367C17.0259 8.15239 17.6443 8.15239 18.0256 8.53367ZM25 12.5C25 19.4094 19.4084 25 12.5 25C5.59063 25 0 19.4084 0 12.5C0 5.59063 5.59158 0 12.5 0C19.4094 0 25 5.59158 25 12.5ZM23.0469 12.5C23.0469 6.67019 18.329 1.95312 12.5 1.95312C6.67019 1.95312 1.95312 6.67095 1.95312 12.5C1.95312 18.3298 6.67095 23.0469 12.5 23.0469C18.3298 23.0469 23.0469 18.329 23.0469 12.5Z"
                                fill="#0CA010"
                            />
                        </svg>
                        {t("monitoring.Conversación tranferida correctamente.")}
                    </div>
                )}

                <div>
                    <ReactSelect
                        defaultValue={props.operatorSelected}
                        placeholder={placeholder}
                        onChange={onChange}
                        name="operator"
                        options={orderBy(getOptions(), ["name"], ["asc"])}
                        loading={loading}
                    />
                    <SelectMobile onChange={selectTeam} options={orderBy(getOptions(), ["name"], ["asc"])} placeholder={t("Seleccionar operador")} />
                </div>

                <div className="bg-modal-footer mt-0 flex w-full items-center justify-center rounded-b-lg pt-4 md:pt-8">
                    {loadingForwading ? (
                        <button className="btn-primary w-32 focus:outline-none">
                            <BeatLoader size={"0.625rem"} color="#ffff" />
                        </button>
                    ) : (
                        <button disabled={disabled} className="btn-primary w-32 font-bold focus:outline-none" onClick={submitChange}>
                            {t("Transferir")}
                        </button>
                    )}
                </div>
            </div>
        </FormModal>
    );
};

export default ForwardPost;
