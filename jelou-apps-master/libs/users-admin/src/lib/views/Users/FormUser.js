import { Input, Label, ModalHeadless, MultiCheckboxSelect, MultiFormCombobox, renderMessage } from "@apps/shared/common";
import { MESSAGE_TYPES } from "@apps/shared/constants";
import { CheckmarkIcon, CloseIcon, EyesOffIcon, EyesOnIcon, IconQuestion, SearchIcon } from "@apps/shared/icons";
import { DashboardServer } from "@apps/shared/modules";
import { Menu, Transition } from "@headlessui/react";
import Tippy from "@tippyjs/react";
import Fuse from "fuse.js";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import orderBy from "lodash/orderBy";
import toUpper from "lodash/toUpper";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Switch from "react-switch";
import { toast } from "react-toastify";
import timezones from "timezones-list";
import "tippy.js/themes/light.css";
import { v4 as uuidv4 } from "uuid";

const inputCheckboxCheck =
    "mt-1 mr-2 h-5 w-5 border-1 border-gray-300 text-primary-200 checked:border-transparent checked:bg-primary-200 hover:checked:bg-primary-200 focus:ring-primary-200 focus:ring-opacity-25 focus:checked:bg-primary-200 disabled:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:ring-0 disabled:border-gray-300 disabled:checked:bg-gray-200 disabled:checked:border-gray-300 disabled:checked:cursor-not-allowed disabled:checked:opacity-50 disabled:checked:ring-0";

const renderErrors = (errors, t) => {
    if (!isEmpty(errors)) {
        return <span className="text-xs font-normal text-red-675">{errors}</span>;
    }
};

const initialState = {
    eightMinVal: false,
    oneMayusVal: false,
    oneMinusVal: false,
    oneCharSpecialVal: false,
    oneNumberVal: false,
};

const FormUser = (props) => {
    const { user, loadUsers, setOpen, setUser, editPermission, newUser, query, defaultRoles, legacyRoles, company, isImpersonate, openModal } = props;
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [errorsObj, setErrorsObj] = useState({});
    const [teamsList, setTeamsList] = useState([]);
    const [filteredTeamScopes, setFilteredTeamScopes] = useState([]);
    const [rolesList, setRolesList] = useState([]);
    const [teamsSelect, setTeamsSelect] = useState([]);
    const [teamScopeSelect, setTeamScopeSelect] = useState([]);
    const [rolesSelect, setRolesSelect] = useState([]);
    const [userState, setUserState] = useState(true);
    const { t } = useTranslation();
    const companyId = get(company, "id");
    const [seeAllUsers, setSeeAllUsers] = useState(false);
    const userSession = useSelector((state) => state.userSession);
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";
    const [TeamsScopeValidation, setTeamsScopeValidation] = useState(false);
    const [monitorAllTeams, setMonitorAllTeams] = useState(get(user, "monitorAllTeams", false));
    const [isGlobalParam, setIsGlobalParam] = useState(get(user, "monitorAllTeams", false));
    const [noOptionsMessage, setNoOptionsMessage] = useState(t("common.No hay opciones disponibles"));
    //* estados time zone
    const timezoneBrowserModal = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const [currentTimezoneMod, setCurrentTimezoneMod] = useState({ tzCode: timezoneBrowserModal });
    const [timeZoneListMod, setTimeZoneListMod] = useState([]);
    const [queryTimezoneMod, setQueryTimezoneMod] = useState("");
    const [cambioTimeZoneEditar, setCambioTimeZoneEditar] = useState(false);

    const [stateValPassword, setStateValPassword] = useState(initialState);
    const [valCharSpecial, setValCharSpecial] = useState(null);
    const [lockedButton, setLockedButton] = useState(true);

    const onClose = () => {
        setOpen(false);
    };

    const notify = (msg) => {
        toast.success(
            <div className="relative flex items-center justify-between">
                <div className="flex">
                    <svg className="-mt-px ml-4 mr-2" width="1.563rem" height="1.563rem" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
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

    const escFunction = (event) => {
        if (event.keyCode === 27) {
            setOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, []);

    const loadTeams = async () => {
        try {
            const resp = await DashboardServer.get(`/companies/${companyId}/teams?state=1`);
            const data = get(resp, "data.data", []);
            const array = [];

            data.forEach((team) => {
                array.push({ value: team.id, label: team.name, state: team.state, name: team.name, id: team.id });
            });

            setTeamsList(array);
            mapOptions(array);
            mapOptionsTeamScopes(array);
            if (isEmpty(data)) {
                setNoOptionsMessage(t("common.No hay equipos configurados"));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const loadRoles = async () => {
        try {
            const resp = await DashboardServer.get(`/companies/${companyId}/roles/permissions`, {
                params: {
                    state: 1,
                    ...(defaultRoles || isImpersonate ? { defaultRoles: true } : { defaultRoles: false }),
                    ...(legacyRoles || isImpersonate ? { legacyRoles: true } : { legacyRoles: false }),
                },
            });

            const { data } = resp;
            const arrayTemp = data.data.results;
            let array = [];
            arrayTemp.forEach((role) => {
                const name = isEmpty(role.displayNames) ? role.name : role.displayNames[lang];
                array.push({ id: role.id, value: role.id, label: name, name: name });
            });
            const arrayOrderAsc = orderBy(array, ["name"], ["asc"]);
            setRolesList(arrayOrderAsc);
            mapOptionsRoles(arrayOrderAsc);
        } catch (error) {
            console.log(error);
        }
    };

    const mapOptions = (list) => {
        let teamsArr = [];
        let teamObj = "";
        if (user && user.Teams) {
            user.Teams.forEach((team) => {
                teamObj = list.find((x) => x.value === team.id);
                if (!isEmpty(teamObj)) {
                    teamsArr.push(teamObj);
                }
            });
            if (teamsArr.length === list.length) {
                teamsArr.push({ value: "*" });
            }
            setTeamsSelect(teamsArr);
        } else {
            setTeamsSelect([]);
        }
    };

    const mapOptionsTeamScopes = (list) => {
        let teamsArr = [];
        let teamObj = "";
        if (user && user.TeamScopes) {
            user.TeamScopes.forEach((team) => {
                teamObj = list.find((x) => x.value === team.teamId);
                if (!isEmpty(teamObj)) {
                    teamsArr.push(teamObj);
                }
            });
            setTeamScopeSelect(teamsArr);
        } else {
            setTeamScopeSelect([]);
        }
    };

    const mapOptionsRoles = (options) => {
        const rolesArr = [];
        let roleObj = "";

        const roles = get(user, "roles", []);
        roles.forEach((role) => {
            roleObj = options.find((x) => x.value === role);
            if (!isEmpty(roleObj)) {
                rolesArr.push(roleObj);
            }
        });
        if (rolesArr.length === options.length) {
            rolesArr.push({ value: "*" });
        }
        setRolesSelect(rolesArr);
    };

    useEffect(() => {
        resetForm();
        setTeamsSelect([]);
        setRolesSelect([]);
        loadTeams();
        setName(get(user, "names"));
        setEmail(get(user, "email"));
        setPassword("");
        setUserState(get(user, "state", true));
    }, [user]);

    useEffect(() => {
        if (!isEmpty(company)) {
            loadRoles();
        }
    }, [user, company]);

    function onChange(value, event) {
        const { name, option, action } = event;
        let optionsList = [];

        if (action === "select-option" && option.value === "*") {
            optionsList = this.options;
        } else if (action === "deselect-option" && option.value === "*") {
            optionsList = [];
        } else if (action === "deselect-option") {
            optionsList = value.filter((o) => o.value !== "*");
        } else if (value.length === this.options.length - 1) {
            optionsList = this.options;
        } else {
            optionsList = value;
        }

        switch (name) {
            case "teams":
                setTeamsSelect([...optionsList]);
                break;
            case "roles":
                setRolesSelect([...optionsList]);
                break;
        }
    }

    const resetForm = () => {
        try {
            const frm = document.getElementsByName("formUser")[0];
            frm?.reset();
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const allValPasswordCompleted = Object.values(stateValPassword).every((param) => param === true);
        setLockedButton(!(allValPasswordCompleted && valCharSpecial));
    }, [stateValPassword, valCharSpecial]);

    const validationPassword = (value) => {
        const regexLetterMinus = /[a-z]/;
        const regexLetterMayus = /[A-Z]/;
        const regexCharSpecial = /[@$!%*?&.#&_-]/;
        const regexLetterNumber = /[0-9]/;

        setStateValPassword({
            ...stateValPassword,
            eightMinVal: value.length >= 10,
            oneMinusVal: regexLetterMinus.test(value),
            oneMayusVal: regexLetterMayus.test(value),
            oneCharSpecialVal: regexCharSpecial.test(value),
            oneNumberVal: regexLetterNumber.test(value),
        });
    };

    const validationCharSpecial = (value) => {
        const regexLettersNumb = /^([a-zA-Z0-9@$!%*?&.#&\-_\s]+$)/;
        setValCharSpecial(regexLettersNumb.test(value));
    };

    const handleChange = ({ target }) => {
        const { value, name } = target;

        if (name === "email") {
            setEmail(value);
        }

        if (name === "name") {
            setName(value);
        }

        if (name === "password") {
            validationPassword(value);
            validationCharSpecial(value);
            setPassword(value);
        }
    };

    const getTeamScopes = async () => {
        try {
            const teamScopes = get(userSession, "teamScopes", []);
            const filteredArray = teamsList.filter((team) => teamScopes.includes(team.value));
            setFilteredTeamScopes(filteredArray);
            if (isEmpty(filteredArray) || monitorAllTeams) {
                setSeeAllUsers(true);
            } else {
                setSeeAllUsers(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getTeamScopes();
    }, [teamsList]);

    const editUser = async (obj) => {
        setLoading(true);
        try {
            await DashboardServer.patch(`/companies/${companyId}/users/${user.id}`, obj).then(() => {
                loadUsers(query);
                notify(t("usersForm.successEditUser"));
                setLoading(false);
                setOpen(false);
                setUser(null);
            });
        } catch (error) {
            const { response } = error;
            const msg = get(response, "data.error.clientMessages", {});
            renderMessage(get(msg, lang, t("registerBusiness.errorPhrase")), MESSAGE_TYPES.ERROR);
            setLoading(false);
        }
    };

    const createUser = async (user) => {
        setLoading(true);
        user.lang = lang;
        try {
            await DashboardServer.post(`/companies/${companyId}/users`, user).then(() => {
                loadUsers();
                notify(t("usersForm.successCreateUser"));
                setErrorsObj({});
                setLoading(false);
                setOpen(false);
                setUser(null);
            });
        } catch (error) {
            const { response } = error;
            const { data } = response;
            const msg = get(response, "data.error.clientMessages", {});
            const validations = get(data, "validationError", {});
            if (!isEmpty(validations)) {
                setErrorsObj(validations);
            }
            renderMessage(get(msg, lang, t("registerBusiness.errorPhrase")), MESSAGE_TYPES.ERROR);
            setLoading(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let teams = [];
        let teamScopes = [];
        let roles = [];
        teamsSelect.forEach((t) => {
            t.value !== "*" && teams.push(t.value);
        });
        teamScopeSelect.forEach((t) => {
            teamScopes.push(t.value);
        });
        rolesSelect.forEach((t) => {
            t.value !== "*" && roles.push(t.value);
        });

        let userObj = {
            names: name,
            username: email,
            timezone: get(currentTimezoneMod, "tzCode"),
            email,
            teams,
            teamScopes,
            roles,
            state: userState,
            monitorAllTeams,
        };

        if (!isEmpty(password)) {
            userObj.password = password;
            userObj.confirmPassword = password;
        }

        if (get(user, "id")) {
            if (isEmpty(teamScopeSelect) && isEmpty(teams) && !isEmpty(filteredTeamScopes)) {
                setTeamsScopeValidation(true);
                setTimeout(() => {
                    setTeamsScopeValidation(false);
                }, 5000);
            } else {
                editUser(userObj);
            }
        } else {
            if (isEmpty(teamScopeSelect) && isEmpty(teams) && !isEmpty(filteredTeamScopes)) {
                setTeamsScopeValidation(true);
                setTimeout(() => {
                    setTeamsScopeValidation(false);
                }, 5000);
            } else {
                createUser(userObj);
            }
        }
    };

    const handleChangeSw = (checked) => {
        setUserState(checked);
    };

    const handleAll = ({ target }) => {
        const { checked, name } = target;

        if (toUpper(name) === "MONITORALL") {
            setMonitorAllTeams(checked);
            setTeamScopeSelect([]);
        }
        if (toUpper(name) === "MONITORALLFALSE") {
            setMonitorAllTeams(false);
        }
        setIsGlobalParam(!isGlobalParam);
    };

    const handleMultipleTeams = (team) => {
        setTeamScopeSelect(team);
    };

    //*********** Time Zone **************/
    const getTimeZoneListMod = () => {
        let objList = [];
        objList = timezones.sort((a, b) => {
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            return 0;
        });
        setTimeZoneListMod(objList);
        return objList;
    };

    const fuseOptionsMod = {
        threshold: 0.3,
        includeMatches: true,
        ignoreLocation: true,
        keys: ["name", "label", "tzcCode"],
    };

    const findTimezoneMod = (event) => {
        setQueryTimezoneMod(event.target.value);
    };

    const getFilteredTimezoneMod = () => {
        if (isEmpty(queryTimezoneMod)) {
            return timeZoneListMod;
        }
        const fuseMod = new Fuse(timeZoneListMod, fuseOptionsMod);
        const result = fuseMod.search(queryTimezoneMod);

        let timezoneSearchMod = [];
        result.map((tz) => {
            return timezoneSearchMod.push(tz.item);
        });
        return timezoneSearchMod;
    };

    const filteredTimezoneMod = getFilteredTimezoneMod();

    const handleUserTimezoneMod = (tz) => {
        setCurrentTimezoneMod(tz);
        if (!isEmpty(user)) {
            setCambioTimeZoneEditar(true);
        } else {
            setCambioTimeZoneEditar(false);
        }
    };
    useEffect(() => {
        const timezonesMod = getTimeZoneListMod();
        const timezone = get(userSession, "timezone", timezoneBrowserModal);
        const defaultTmz = timezonesMod.find((tz) => tz.tzCode === timezone);
        setCurrentTimezoneMod(defaultTmz);
    }, [userSession]);

    const validationDefaultValueTimeZone = () => {
        if (!isEmpty(user)) {
            return cambioTimeZoneEditar ? currentTimezoneMod?.name && get(currentTimezoneMod, "name", "-") : filteredTimezoneMod.find((timezone) => get(user, "timezone") === timezone.tzCode)?.name;
        } else {
            return currentTimezoneMod?.name && get(currentTimezoneMod, "name", "-");
        }
    };

    const [passVisibility, setPassVisibility] = useState(false);

    const togglePasswordVisibility = (setterPassword) => {
        setterPassword((prevState) => !prevState);
    };
    const readEmail = !isEmpty(user) ? true : false;
    const disabledCreation = !isEmpty(user) ? false : isEmpty(name) || isEmpty(email) || isEmpty(password) || lockedButton;

    const oneSpecialCharMsg = (
        <div className="flex">
            <p className="p-4 text-15 ">
                {t("password.instructionChar")} <span className="font-bold">@$!%*?&.#&-_</span>
            </p>
        </div>
    );

    return (
        <ModalHeadless
            isShowModal={openModal}
            closeModal={onClose}
            className={"relative inline-block max-h-[80vh] min-h-[75vh] w-[35vw] transform overflow-hidden overflow-y-auto rounded-20 bg-white text-left align-middle shadow-xl transition-all"}
            titleClassName={"font-bold text-gray-400 px-5"}
            titleModal={!isEmpty(user) ? t("AdminFilters.viewEditUser") : newUser ? t("AdminFilters.createUser") : t("AdminFilters.viewUser")}
            icon={<CloseIcon className="fill-current text-gray-400" width="1rem" height="1rem" />}
            showButtons={editPermission}
            textButtonSecondary={t("usersForm.cancel")}
            handleClickPrimaryButton={handleSubmit}
            textButtonPrimary={t("common.save")}
            disablePrimaryBtn={disabledCreation}
            loading={loading}
            classNamePrimaryButton="flex h-10 min-w-1 items-center justify-center rounded-20 bg-primary-200 px-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
            classNameSecondaryButton="h-10 min-w-1 rounded-20 bg-primary-700 px-4 font-semibold text-gray-400 disabled:cursor-not-allowed disabled:opacity-40"
            containerClass="w-[45vw]"
        >
            <div className="relative space-y-5 p-5">
                <div className="flex w-full items-center space-x-6">
                    <Label name={t("usersForm.names")} className="w-28" labelClassName="text-sm font-bold text-gray-400 text-opacity-75" />
                    <Input
                        id="nombre"
                        type="text"
                        className="h-34 w-full flex-1 rounded-xs border-transparent bg-primary-700 px-2 text-15 text-gray-400 outline-none ring-transparent focus:border-transparent focus:ring-transparent"
                        required={true}
                        name="name"
                        onChange={handleChange}
                        defaultValue={get(user, "names", "")}
                        autoFocus={!isEmpty(get(user, "names", "")) ? false : true}
                    />
                </div>
                {!isEmpty(errorsObj) && !isEmpty(get(errorsObj, "names", [])) && <div className="pt-1 text-right">{errorsObj.names.map((err) => renderErrors(`${err[lang]} `))}</div>}
                <div className="flex w-full items-center space-x-6">
                    <Label name={t("usersForm.email")} className="w-28" labelClassName="text-sm font-bold text-gray-400 text-opacity-75" />
                    <Input
                        id="email"
                        type="text"
                        className="h-34 w-full flex-1 rounded-xs border-transparent bg-primary-700 px-2 text-15 text-gray-400 outline-none ring-transparent focus:border-transparent focus:ring-transparent"
                        required={true}
                        disabled={readEmail}
                        name="email"
                        defaultValue={get(user, "email", "")}
                        onChange={handleChange}
                        autoComplete="off"
                    />
                </div>
                {!isEmpty(errorsObj) && !isEmpty(get(errorsObj, "email", [])) && <div className="pt-1 text-right">{errorsObj.email.map((err) => renderErrors(`${err[lang]} `))}</div>}

                <div className="relative flex w-full items-center space-x-6">
                    <Label name={t("usersForm.password")} className="w-28" labelClassName="text-sm font-bold text-gray-400 text-opacity-75" />
                    <Input
                        id="password"
                        type={passVisibility === true ? "text" : "password"}
                        required={isEmpty(user) ? true : false}
                        className="h-34 w-full flex-1 rounded-xs border-transparent bg-primary-700 px-2 text-15 text-gray-400 outline-none ring-transparent focus:border-transparent focus:ring-transparent"
                        name="password"
                        onChange={handleChange}
                        placeholder={"........"}
                    />

                    <button className="absolute right-1 flex items-center" type="button" onClick={() => togglePasswordVisibility(setPassVisibility)}>
                        {passVisibility && <EyesOnIcon className="fill-current text-gray-400" width="20" height="20" />}
                        {!passVisibility && <EyesOffIcon className="fill-current text-gray-400" width="20" height="20" />}
                    </button>
                </div>
                {valCharSpecial === false && !isEmpty(password) && (
                    <div className="flex w-full items-center space-x-6">
                        <div className="invisible w-28">.</div>
                        <span className="text-sm font-bold text-red-601">{t("password.charNotValid")}</span>
                    </div>
                )}

                {!isEmpty(password) && (
                    <div className="relative flex w-full items-center space-x-6">
                        <div className="invisible w-28">.</div>
                        <div className="flex flex-1 items-start justify-start gap-5 sm:flex">
                            <div className="flex flex-col items-start justify-start text-left">
                                <div className="flex py-2">
                                    <CheckmarkIcon fill={stateValPassword.eightMinVal ? "#18BA81" : "#727C94"} width="15" height="15" />
                                    <h4 className={`whitespace-nowrap ${stateValPassword.eightMinVal ? "text-gray-610" : "text-gray-400"} pl-1 text-xs font-bold`}>{t("password.minimumChar")}</h4>
                                </div>
                                <div className="flex py-2">
                                    <CheckmarkIcon fill={stateValPassword.oneMayusVal ? "#18BA81" : "#727C94"} width="15" height="15" />
                                    <h4 className={`whitespace-nowrap ${stateValPassword.oneMayusVal ? "text-gray-610" : "text-gray-400"} pl-1 text-xs font-bold`}>{t("password.oneMayus")}</h4>
                                </div>
                                <div className="flex py-2">
                                    <CheckmarkIcon fill={stateValPassword.oneMinusVal ? "#18BA81" : "#727C94"} width="15" height="15" />
                                    <h4 className={`whitespace-nowrap ${stateValPassword.oneMinusVal ? "text-gray-610" : "text-gray-400"} pl-1 text-xs font-bold`}>{t("password.oneMinus")}</h4>
                                </div>
                            </div>
                            <div className="flex flex-col items-start justify-start text-left">
                                <div className="flex py-2">
                                    <CheckmarkIcon fill={stateValPassword.oneCharSpecialVal ? "#18BA81" : "#727C94"} width="15" height="15" />
                                    <h4 className={`whitespace-nowrap ${stateValPassword.oneCharSpecialVal ? "text-gray-610" : "text-gray-400"} pl-1 pr-1 text-xs font-bold`}>
                                        {t("password.oneCharSpecial")}
                                    </h4>

                                    <Tippy content={oneSpecialCharMsg} animation="scale-subtle" theme="light" interactive={true} trigger="click">
                                        <span className="bg-app-body relative mr-2 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full text-xs text-gray-450 opacity-75 hover:opacity-100">
                                            <IconQuestion className="fill-current text-gray-400" width="15" height="15" />
                                        </span>
                                    </Tippy>
                                </div>
                                <div className="flex py-2">
                                    <CheckmarkIcon fill={stateValPassword.oneNumberVal ? "#18BA81" : "#727C94"} width="15" height="15" />
                                    <h4 className={`whitespace-nowrap ${stateValPassword.oneNumberVal ? "text-gray-610" : "text-gray-400"} pl-1 text-xs font-bold`}>{t("password.oneNumber")}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* <div className="flex flex-col items-start justify-start pt-2"> */}
                {/* </div> */}

                {isEmpty(errorsObj) && !isEmpty(get(errorsObj, "password", [])) && <div className="pt-1 text-right">{errorsObj.password.map((err) => renderErrors(`${err[lang]} `))}</div>}
                <div className="flex w-full items-center space-x-6">
                    <Label name={t("AdminFilters.state")} className="w-28" labelClassName="text-sm font-bold text-gray-400 text-opacity-75" />
                    <Switch
                        checked={userState}
                        onChange={handleChangeSw}
                        onColor="#00B3C7"
                        onHandleColor="#ffffff"
                        uncheckedIcon={false}
                        checkedIcon={false}
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                        height={22}
                        width={41}
                        className="react-switch flex-1"
                    />
                </div>
                {/* *************** time zone ************* */}
                <Menu as="div" className="">
                    <div className="flex w-full items-center space-x-6">
                        <label htmlFor="Nombre" className="max-w-[7rem] flex-1">
                            <div className="mb-1 block text-sm font-bold text-gray-400 text-opacity-75">{t("schedule.timezone")}</div>
                        </label>
                        <div className="bd-react-select bd-react-top flex flex-1">
                            <Menu.Button className="h-auto w-full flex-1 rounded-xs border-transparent bg-primary-700 px-2 py-2 text-15 text-gray-400 outline-none ring-transparent focus:border-transparent focus:ring-transparent">
                                <div className="flex items-center justify-between">
                                    <span className="pr-5 text-left">{validationDefaultValueTimeZone()}</span>
                                    <span className="h-[7px] w-[7px] origin-top-right -translate-y-1/2 rotate-45 transform border-b-2 border-r-2 border-solid border-gray-400"></span>
                                </div>
                            </Menu.Button>
                        </div>
                    </div>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute left-[27%] right-0 top-[39%] z-50  mt-0 max-h-[30vh] w-74 divide-y-1 divide-gray-400/10 overflow-y-auto rounded-lg bg-white text-gray-400 shadow-lg focus:outline-none xl:max-h-[25vh]">
                            <div className="sticky top-0 z-20 flex w-full items-center bg-white p-3" key={uuidv4()}>
                                <div className="absolute left-3">
                                    <SearchIcon className="fill-current" width="1rem" height="1rem" />
                                </div>
                                <Input
                                    className="flex h-10 w-full max-w-xs rounded-full border-gray-100/50 pl-10 outline-none focus:ring-transparent"
                                    type="search"
                                    autoFocus={true}
                                    placeholder={t("schedule.placeHolderTimeZ")}
                                    onChange={findTimezoneMod}
                                    value={queryTimezoneMod}
                                />
                            </div>
                            {filteredTimezoneMod.map((timezone, id) => {
                                const { name } = timezone;
                                return (
                                    <Menu.Item key={id}>
                                        {({ active }) => (
                                            <button
                                                type={"button"}
                                                onClick={() => handleUserTimezoneMod(timezone)}
                                                className={`group relative flex w-full cursor-pointer items-center space-x-3 px-5 py-2 text-left text-sm text-gray-400 ${
                                                    currentTimezoneMod === timezone ? "font-semibold text-primary-200" : ""
                                                } ${active ? " bg-[#E5F7F9]" : ""}`}
                                            >
                                                {name}
                                            </button>
                                        )}
                                    </Menu.Item>
                                );
                            })}
                        </Menu.Items>
                    </Transition>
                </Menu>
                <div className="flex w-full items-center space-x-6">
                    <label className="max-w-[7rem] flex-1">
                        <div className="mb-1 flex items-center">
                            <p className="flex flex-1 text-sm font-bold text-gray-400 text-opacity-75"> {t("usersForm.team")}</p>
                            <Tippy content={t("usersForm.teamsHelpInfo")} animation="scale-subtle" placement="bottom-start" theme="light" interactive={true} trigger="click">
                                <span className="bg-app-body relative mr-2 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full text-xs text-gray-450 opacity-75 hover:opacity-100">
                                    <IconQuestion className="fill-current text-gray-400" width="16" height="16" />
                                </span>
                            </Tippy>
                        </div>
                    </label>
                    <div className="bd-react-select flex flex-1">
                        <MultiCheckboxSelect
                            id="equipos"
                            name="teams"
                            showName={false}
                            placeholderButtonLabel={t("componentCommonSidebar.teams")}
                            options={seeAllUsers ? teamsList : filteredTeamScopes}
                            value={teamsSelect}
                            placeholder={"Equipos"}
                            onChange={onChange}
                        />
                    </div>
                </div>

                <div className="flex w-full items-center space-x-6">
                    <Label name={t("usersForm.roles")} className="w-28" labelClassName="text-sm font-bold text-gray-400 text-opacity-75" />
                    <div className="bd-react-select bd-react-top flex flex-1">
                        <MultiCheckboxSelect
                            id="roles"
                            name="roles"
                            showName={false}
                            placeholderButtonLabel={t("componentCommonSidebar.roles")}
                            options={rolesList}
                            value={rolesSelect}
                            placeholder={"Roles"}
                            onChange={onChange}
                        />
                    </div>
                </div>

                <div className="mt-4 border-b-default border-gray-200"></div>

                <div className="mt-4">
                    <p className="mb-1 font-bold text-gray-400">{t("usersAdmin.Supervisión de Equipos")}</p>
                    <p className="text-sm text-gray-400">{t("usersForm.teamsScopeHelpInfo")}</p>
                </div>

                <div className="flex items-center sm:pt-3">
                    <div className="mr-2 flex">
                        <input
                            id="allSelection"
                            checked={isGlobalParam}
                            onChange={handleAll}
                            name="monitorAll"
                            type="radio"
                            className={inputCheckboxCheck}
                            disabled={!isEmpty(get(userSession, "teamScopes", []))}
                        />
                    </div>
                    <Label
                        name={t("usersAdmin.monitoringAll")}
                        className="flex items-center"
                        labelClassName={`${!isEmpty(get(userSession, "teamScopes", [])) ? "cursor-not-allowed text-sm text-gray-400 opacity-50 " : "text-sm text-gray-400"}`}
                    />
                </div>

                <div className="flex items-center">
                    <div className="mr-2 flex">
                        <input id="individualSelection" checked={!isGlobalParam} onChange={handleAll} name="monitorAllFalse" type="radio" className={inputCheckboxCheck} />
                    </div>
                    <Label name={t("usersAdmin.monitoringAllFalse")} className="flex" labelClassName="text-sm text-gray-400" />
                </div>

                {!isGlobalParam && (
                    <div className="flex w-full items-center space-x-6">
                        <Label name={t("usersForm.teamScopes")} className="w-28" labelClassName="text-sm text-gray-400 text-opacity-75" />
                        <div className="flex flex-1 flex-col">
                            <div className="flex items-center">
                                <MultiFormCombobox
                                    position="top"
                                    handleChange={handleMultipleTeams}
                                    name="team"
                                    value={teamScopeSelect}
                                    options={
                                        seeAllUsers
                                            ? teamsList.map((team) => {
                                                  return { value: team.value, name: team.label, id: team.value };
                                              })
                                            : filteredTeamScopes.map((team) => {
                                                  return { value: team.value, name: team.label, id: team.value };
                                              })
                                    }
                                    placeholder={t("monitoring.chooseATeam")}
                                    noOptionsMessage={noOptionsMessage}
                                    hasCleanFilter={false}
                                />
                            </div>

                            {TeamsScopeValidation && (
                                <div className="mt-2 text-right">
                                    <p className="text-xs font-normal text-red-675">{t("usersForm.teamsOrTeamsScopeNotice")}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </ModalHeadless>
    );
};

export default FormUser;
