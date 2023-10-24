/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ReactSelect } from "@apps/shared/common";
import { BeatLoader } from "react-spinners";

import get from "lodash/get";
import orderBy from "lodash/orderBy";
import isEmpty from "lodash/isEmpty";
import isNumber from "lodash/isNumber";
import toUpper from "lodash/toUpper";
import { withTranslation } from "react-i18next";

import { JelouApiV1 } from "@apps/shared/modules";
import { useOnClickOutside, useOperatorData } from "@apps/shared/hooks";
import { Modal } from "@apps/shared/common";

import { deleteConversation } from "@apps/redux/store";

import { JelouLogoIcon, CloseIcon } from "@apps/shared/icons";

const SwitchOperator = (props) => {
    const { setForward, conversation, actualCases = true, textObj = {}, t } = props;
    const company = useSelector((state) => state.company);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [placeholder, setPlaceholder] = useState(t("Escoger operador"));
    const [operators, setOperators] = useState([]);
    const [teamSelected, setTeamSelected] = useState("");
    const [tempOperator, setTempOperator] = useState(null);
    const dispatch = useDispatch();

    const wrapperRef = useRef(null);

    const {
        isLoading: isLoadingOperators,
        data: operatorsData = [],
        status: statusOperator,
        refetch,
    } = useOperatorData(company, { shouldPaginate: false, status: "online" });

    const parseOperators = (operatorsArray) => {
        const operatorSelected = get(conversation, "operator.providerId", "");
        let operators = [];
        let operatorTeam = "";
        operatorsArray.forEach((operator) => {
            const teams = get(operator, "Teams", []);
            if (!isEmpty(teams)) {
                let _teams = [];
                teams.map((team) => {
                    _teams.push(team.name);
                });
                operatorTeam = ` - ${_teams.join()}`;
            }
            if (operator.providerId !== operatorSelected) {
                operators.push({
                    id: `${operator.providerId}`,
                    name: `${operator.names}${operatorTeam}`,
                    companyId: operator.companyId,
                    operatorId: operator.id,
                });
            }
        });
        if (isEmpty(operators)) {
            setPlaceholder("No hay operadores conectados");
        }
        return operators;
    };

    useMemo(() => {
        if (statusOperator === "success" && !isEmpty(operatorsData)) {
            const data = parseOperators(operatorsData);
            setOperators(data);
        }
    }, [statusOperator, operatorsData]);

    const handleClickInside = (event) => {
        if (!(wrapperRef.current && !wrapperRef.current.contains(event.target))) {
            refetch();
        }
    };

    useEffect(() => {
        // Bind the event listener
        document.addEventListener("mousedown", handleClickInside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickInside);
        };
    }, []);

    const filterOperator = (operators) => {
        const companyId = get(company, "id", false);
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

    const onClose = () => {
        setForward(false);
        setTempOperator(null);
    };

    const ref = useRef();
    useOnClickOutside(ref, onClose);

    const handler = (e) => {
        if (e.keyCode === 27) {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener("keyup", handler);
        return () => {
            document.removeEventListener("keyup", handler);
        };
    }, []);

    const selectTeamId = (teamId) => {
        setTeamSelected(teamId);
        setTempOperator(teamId);
    };

    const submitChange = () => {
        setLoading(true);
        let botId = get(conversation, "bot.id", {});

        const userId = get(conversation, "user.id", {});
        const _id = get(conversation, "_id", "");
        const { clientId: username, clientSecret: password } = company;
        if (!botId && !userId) {
            return;
        }
        const id = get(tempOperator, "id", "");
        const operatorId = get(tempOperator, "operatorId", "");

        if (actualCases) {
            JelouApiV1.post(
                `/conversations/${botId}/transfer`,
                {
                    userId: userId,
                    operatorId: id,
                },
                {
                    auth: {
                        username,
                        password,
                    },
                }
            )
                .then((res) => {
                    const { data } = res;
                    const type = get(data, "data.type", "");
                    if (type === "OPERATOR_NOT_FOUND") {
                        console.log("OH NO!!");
                    }
                    setOperators([]);
                    setLoading(false);
                    setSuccess(true);
                    onClose();
                    dispatch(deleteConversation(_id));
                })
                .catch((err) => {
                    console.error("ERROR", err);
                    setOperators([]);
                    setTempOperator(null);
                    setLoading(false);
                });
        } else {
            const companyId = get(tempOperator, "companyId", null);
            botId = get(conversation, "bot.id", {});
            const botType = get(conversation, "bot.type", {});
            const teamId = get(conversation, "assignationMethod.teamId", "");

            switch (toUpper(botType)) {
                case "TWITTER_REPLIES":
                case "FACEBOOK_FEED":
                    return JelouApiV1.get(`/company/${companyId}/tickets/take`, {
                        params: {
                            ticketId: _id,
                            type: "reply",
                            ...(!isEmpty(operators) ? { operatorId: operatorId } : {}),
                        },
                    })
                        .then((res) => {
                            const { data } = res;
                            const type = get(data, "data.type", "");
                            if (type === "OPERATOR_NOT_FOUND") {
                                console.log("OH NO!");
                            }
                            setOperators([]);
                            setLoading(false);
                            setSuccess(true);
                            onClose();
                            dispatch(deleteConversation(_id));
                        })
                        .catch((err) => {
                            console.error("ERROR", err);
                            setOperators([]);
                            setTempOperator(null);
                            setLoading(false);
                        });
                default:
                    return JelouApiV1.get(`/company/${companyId}/tickets/take`, {
                        params: {
                            ticketId: _id,
                            ...(!isEmpty(operators) ? { operatorId: operatorId } : {}),
                            ...(isNumber(teamId) ? { teamId: teamId } : {}),
                        },
                    })
                        .then((res) => {
                            const { data } = res;
                            const type = get(data, "data.type", "");
                            if (type === "OPERATOR_NOT_FOUND") {
                                console.log("OH NO!");
                            }
                            setOperators([]);
                            setLoading(false);
                            setSuccess(true);
                            onClose();
                            dispatch(deleteConversation(_id));
                        })
                        .catch((err) => {
                            console.error("ERROR", err);
                            setOperators([]);
                            setTempOperator(null);
                            setLoading(false);
                        });
            }
        }
    };

    const disabled = tempOperator === null ? true : false;

    return (
        <Modal>
            <div className="fixed inset-x-0 top-0 z-120 overflow-auto sm:inset-0 sm:flex sm:items-center sm:justify-center">
                <div className="fixed inset-0 transition-opacity">
                    <div className="absolute inset-0 z-20 bg-gray-490/75" />
                </div>
                <div className="min-w-125 transform rounded-3xl bg-white px-6 pb-4 pt-5 shadow-modal transition-all" ref={ref}>
                    <div className="mb-3 flex items-center justify-between pb-4">
                        <div className="flex items-center">
                            <div className="bg-primary mr-2 flex items-center justify-center rounded-full md:mr-4">
                                <JelouLogoIcon width="1.875rem" height="2.5rem" />
                            </div>
                            <div className="max-w-md text-xl font-bold text-gray-400">{t("monitoring.Transferir")}</div>
                        </div>
                        <span onClick={onClose}>
                            <CloseIcon className="cursor-pointer fill-current text-gray-400 hover:text-gray-400" width="1rem" height="1rem" />
                        </span>
                    </div>
                    {success && (
                        <div className="mb-4 flex h-14 items-center rounded-default bg-whatsapp-200 px-4 font-bold text-whatsapp-350">
                            <svg width="25" height="25" className="mr-4" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M18.0256 8.53367C18.4071 8.91514 18.4071 9.5335 18.0256 9.91478L11.4742 16.4663C11.0928 16.8476 10.4746 16.8476 10.0931 16.4663L6.97441 13.3474C6.59294 12.9662 6.59294 12.3478 6.97441 11.9665C7.35569 11.585 7.97405 11.585 8.35533 11.9665L10.7836 14.3948L16.6445 8.53367C17.0259 8.15239 17.6443 8.15239 18.0256 8.53367ZM25 12.5C25 19.4094 19.4084 25 12.5 25C5.59063 25 0 19.4084 0 12.5C0 5.59063 5.59158 0 12.5 0C19.4094 0 25 5.59158 25 12.5ZM23.0469 12.5C23.0469 6.67019 18.329 1.95312 12.5 1.95312C6.67019 1.95312 1.95312 6.67095 1.95312 12.5C1.95312 18.3298 6.67095 23.0469 12.5 23.0469C18.3298 23.0469 23.0469 18.329 23.0469 12.5Z"
                                    fill="#0CA010"
                                />
                            </svg>
                            {!isEmpty(textObj) ? textObj.success : t("monitoring.Conversación tranferida correctamente.")}
                        </div>
                    )}

                    <div className="flex justify-center">
                        <div className="mx-auto w-full max-w-sm pb-5">
                            <div className="mt-2">
                                <div className="border-b-default border-gray-100/25">
                                    <ReactSelect
                                        className="w-full"
                                        value={teamSelected}
                                        onChange={selectTeamId}
                                        name="operator"
                                        options={orderBy(getOptions(), ["name"], ["asc"])}
                                        placeholder={t(placeholder)}
                                        loading={isLoadingOperators}
                                    />
                                </div>
                                <div className="flex w-full justify-center pt-5">
                                    <button type="submit" className="button-primary w-32" disabled={disabled} onClick={submitChange}>
                                        {loading ? (
                                            <BeatLoader color={"white"} size={"0.625rem"} />
                                        ) : !isEmpty(textObj) ? (
                                            textObj.button
                                        ) : (
                                            t("Transferir")
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default withTranslation()(SwitchOperator);
