import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import orderBy from "lodash/orderBy";
import { useEffect, useRef, useState } from "react";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { BeatLoader } from "react-spinners";

import { useOnClickOutside } from "@apps/shared/hooks";
import { JelouApiV1 } from "@apps/shared/modules";
import ReactSelect from "../select/ReactSelect";

const ForwardModal = (props) => {
    const {
        closeForwardModal,
        onChange,
        submitChange,
        success,
        operatorSelected,
        loadingForwading,
        t,
        teamOptions,
        notAssignedTab = false,
        useAllOperators = false,
        isPost = false,
        sortField = true,
    } = props;
    const userSession = useSelector((state) => state.userSession);
    const company = useSelector((state) => state.company);

    const [operators, setOperators] = useState([]);
    const [loading, setLoading] = useState(false);

    const byTeam = get(company, "properties.operatorView.byTeam", false);
    const place = byTeam ? "Seleccione equipo" : "Seleccione operador";
    const [placeholder, setPlaceholder] = useState(place);

    const wrapperRef = useRef(null);

    const getOptions = () => {
        if (byTeam) {
            return teamOptions;
        } else {
            return filterOperator(operators);
        }
    };

    const parseOperators = (operatorsArray) => {
        let operators = [];
        let operatorTeam = "";
        let idToUse = !isEmpty(userSession) ? userSession.providerId : userSession.providerId;
        operatorsArray.forEach((operator) => {
            if (!isEmpty(operator.team)) {
                operatorTeam = ` - ${operator.team}`;
            }
            if (useAllOperators) {
                operators.push({
                    value: `${operator?.providerId}`,
                    names: `${operator?.names}${operatorTeam}`,
                    id: operator?.id,
                    companyId: operator?.companyId,
                    userId: operator.User?.id,
                    providerId: operator.User?.providerId,
                });
            } else if (operator.providerId !== idToUse) {
                operators.push({
                    value: `${operator.providerId}`,
                    names: `${operator.names}${operatorTeam}`,
                    id: operator.id,
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

        JelouApiV1.get(`/company/${company.id}/operators`, {
            params: {
                status: "online",
                active: 1,
                ...(sortField ? { sortField: "actualNotReplied" } : {}),
                sortOrder: "desc",
                ...(!isEmpty(teamOptions) ? { teams: [teamOptions.map((team) => team.id)] } : {}),
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
        const companyId = get(userSession, "companyId", false);
        if (!companyId) {
            return operators;
        }
        return operators.filter((operator) => {
            return operator.companyId === companyId;
        });
    };

    const ref = useRef();
    useOnClickOutside(ref, closeForwardModal);

    return (
        <div
            className={`relative min-w-[30rem] max-w-sm transform rounded-[1.375rem] bg-white px-4 pb-4 pt-5 shadow-modal transition-all sm:p-6`}
            ref={ref}>
            <div className="text-left text-base font-bold text-gray-400 md:text-xl">{notAssignedTab ? t("Asignar") : t("Transferir")}</div>
            <div className="flex flex-col items-center space-y-3">
                <button className="absolute right-0 top-0 mr-4 mt-4" onClick={() => closeForwardModal()}>
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
                                {`${notAssignedTab ? t("Estás a punto de asignar") : t("Estás a punto de transferir")} ${
                                    isPost ? t("este post") : t("este ticket")
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
                            {notAssignedTab ? t("Conversación asignada correctamente") : t("Conversación tranferida correctamente")}
                        </div>
                    )}

                    <div className="border-b-default border-gray-100/25" ref={wrapperRef}>
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
                            onClick={() => closeForwardModal()}>
                            {t("No")}
                        </button>
                        <button
                            disabled={success}
                            className="h-[2.1037rem] w-[5.7663rem] rounded-[1rem] bg-primary-200 px-2 text-15 font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
                            onClick={submitChange}>
                            {loadingForwading ? <BeatLoader size={"0.625rem"} color="#ffff" /> : t("Sí")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withTranslation()(ForwardModal);
