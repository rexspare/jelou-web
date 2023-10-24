import get from "lodash/get";
import "tippy.js/dist/tippy.css";
import { DashboardServer } from "@apps/shared/modules";
import { toast } from "react-toastify";
import isEmpty from "lodash/isEmpty";
import React, { useState, useRef, useEffect } from "react";

import TeamFields from "./TeamFields";
import { useTranslation } from "react-i18next";
import { CloseIcon } from "@apps/shared/icons";
import { useOnClickOutside } from "@apps/shared/hooks";
import { useSelector } from "react-redux";

const renderErrors = (errors, t) => {
    if (!isEmpty(errors)) {
        return <span className="text-xs font-normal text-red-675">{errors}</span>;
    }
};

const FormTeam = (props) => {
    const { team, loadTeams, setActiveTeam, setOpenForm, newTeam, setNewTeam, query, permissionsList, setTeamSidebar, tab, setTab, handleTeam } =
        props;
    const [loading, setLoading] = useState(false);
    const [properties] = useState({ ...get(team, "properties", {}) });
    const [name, setName] = useState();
    const [errors, setErrors] = useState("");
    const ref = useRef();
    const company = useSelector((state) => state.company);
    const companyId = get(company, "id");
    const [errorsObj, setErrorsObj] = useState({});
    const [teamState, setTeamState] = useState(true);
    const updatePermission = !!permissionsList.find((data) => data === "team:update_team");
    const { t } = useTranslation();

    const lang = useSelector((state) => state.userSession?.lang) ?? "es";

    useOnClickOutside(ref, () => setOpenForm(false));

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, []);

    const escFunction = (event) => {
        if (event.keyCode === 27) {
            setOpenForm(false);
        }
    };

    const notify = (msg) => {
        toast.success(
            <div className="relative flex items-center justify-between">
                <div className="flex">
                    <svg
                        className="-mt-px ml-4 mr-2"
                        width="1.563rem"
                        height="1.563rem"
                        viewBox="0 0 25 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
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

    const notifyError = (error) => {
        toast.error(
            <div className="relative flex items-center justify-between">
                <div className="flex">
                    <div className="text-15">{error}</div>
                </div>

            </div>,
            {
                position: toast.POSITION.BOTTOM_RIGHT,
            }
        );
    };

    const resetForm = () => {
        const frm = document.getElementsByName("formUser")[0];
        frm.reset();
        setErrors("");
    };

    const mapOptions = () => {
        if (team) {
            setName(team.name);
        } else {
            setName("");
        }
    };

    useEffect(() => {
        //  setTab("generales");
        resetForm();
        if (!isEmpty(team)) {
            mapOptions();
        } else {
            setName("");
        }
    }, [team]);

    useEffect(() => {
        setNewTeam(true);
    }, [newTeam]);

    const handleChange = ({ target }) => {
        const { value, name } = target;
        if (name === "name") {
            setName(value);
        }
    };

    const editTeam = async (obj) => {
        setLoading(true);
        try {
            const { data } = await DashboardServer.patch(`/companies/${companyId}/teams/${team.id}`, obj);
            loadTeams(query);
            setTab("generales");
            handleTeam(get(data, "data", {}));
            notify(t("teamsForm.successEditTeam"));
            setLoading(false);
            setOpenForm(false);
        } catch (error) {
            console.log(error);
            const { response } = error;
            const { data } = response;
            const msg = get(response, "data.error.clientMessages", {});
            const validations = get(data, "validationError", {});
            if (!isEmpty(validations)) {
                setErrorsObj(validations);
            }
            notifyError(get(msg, lang, t("registerBusiness.errorPhrase")));
            setLoading(false);
        }
    };

    const createTeam = async (obj) => {
        setLoading(true);
        try {
            const resp = await DashboardServer.post(`/companies/${companyId}/teams/create`, obj);
            const { data } = resp;

            loadTeams();
            setTab("generales");
            handleTeam(get(data, "data", {}));
            notify(t("teamsForm.successCreateTeam"));
            setLoading(false);
            setTeamSidebar({ id: get(data, "data.id", null) });
            setOpenForm(false);
        } catch (error) {
            const { response } = error;
            const { data } = response;
            const msg = get(response, "data.error.clientMessages", {});
            const validations = get(data, "validationError", {});
            if (!isEmpty(validations)) {
                setErrorsObj(validations);
            }
            notifyError(get(msg, lang, t("registerBusiness.errorPhrase")));
            setLoading(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        let userObj = {
            name: name,
            state: teamState,
            properties,
        };

        if (team) {
            editTeam(userObj);
        } else {
            createTeam(userObj);
        }
    };

    const handleCancel = async (event) => {
        setOpenForm(false);
        setActiveTeam(null);
    };

    const inactiveTeam = !isEmpty(team) && team.state === 0 && teamState === 0 ? true : false;

    return (
        <div className="fixed inset-x-0 top-0 z-120 sm:inset-0 sm:flex sm:items-center sm:justify-center">
            <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 z-20 bg-gray-490/75" />
            </div>
            <div className="w-4/12 transform rounded-20 bg-white px-6 pb-7 pt-5 shadow-outline-modal transition-all" ref={ref}>
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="max-w-md font-bold text-gray-400">
                            {!isEmpty(team) ? t("AdminFilters.viewEditTeam") : newTeam ? t("AdminFilters.createTeam") : t("AdminFilters.viewTeam")}
                        </div>
                    </div>
                    <button onClick={handleCancel}>
                        <CloseIcon className="fill-current text-gray-400" width="1rem" height="1rem" />
                    </button>
                </div>
                <div>
                    <div className={`displ pt-8 ${tab === "generales" ? "block" : "hidden"}`}>
                        <form onSubmit={handleSubmit} method="POST" name="formUser" action="">
                            <TeamFields
                                teamState={teamState}
                                setTeamState={setTeamState}
                                handleSubmit={handleSubmit}
                                handleChange={handleChange}
                                handleCancel={handleCancel}
                                team={team}
                                errorsObj={errorsObj}
                                t={t}
                                renderErrors={renderErrors}
                                loading={loading}
                                updatePermission={updatePermission}
                                error={errors}
                                inactiveTeam={inactiveTeam}
                                teamName={name}
                            />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormTeam;
