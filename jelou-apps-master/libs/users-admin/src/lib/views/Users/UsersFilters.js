import React, { useEffect } from "react";

import { Role, Clean, Circle, TeamIcon, DownloadIcon } from "@apps/shared/icons";

import MultiCheckboxSelect from "../Component/Common/MultiCheckboxSelect";

const UsersFilters = (props) => {
    const { teamsList, rolesList, loadUsers, selectedOptions, setSelectedOptions, INITIAL_FILTERS } = props;

    const activeOptions = [
        { value: true, label: "Activo" },
        { value: false, label: "Desactivado" },
    ];

    function onChange(value, event) {
        if (event.action === "select-option" && event.option.value === "*") {
            setSelectedOptions({ ...selectedOptions, [event.name]: this.options });
        } else if (event.action === "deselect-option" && event.option.value === "*") {
            setSelectedOptions({ ...selectedOptions, [event.name]: [] });
        } else if (event.action === "deselect-option") {
            //  setSelectedOptions(value.filter((o) => o.value !== "*"));
            setSelectedOptions({
                ...selectedOptions,
                [event.name]: value.filter((o) => o.value !== "*"),
            });
        } else if (value.length === this.options.length - 1) {
            setSelectedOptions({ ...selectedOptions, [event.name]: this.options });
            // setSelectedOptions(this.options);
        } else {
            setSelectedOptions({ ...selectedOptions, [event.name]: value });

            // setSelectedOptions(value);
        }
    }

    useEffect(() => {
        loadUsers();
    }, [selectedOptions]);

    return (
        <div className="flex p-2">
            <div className="flex flex-1 items-center">
                <div className="relative">
                    <Circle width="1rem" fill="white" />
                </div>
                <MultiCheckboxSelect
                    id="estados"
                    name="states"
                    placeholderButtonLabel={"Estado"}
                    options={activeOptions}
                    value={selectedOptions.states}
                    placeholder={"Estado"}
                    onChange={onChange}
                    className={"react-select"}
                />
            </div>

            <div className="flex flex-1 items-center">
                <div className="relative -mb-px">
                    <Role width="18" fill="white" />
                </div>
                <MultiCheckboxSelect
                    id="roles"
                    name="roles"
                    placeholderButtonLabel={"Roles"}
                    options={rolesList}
                    value={selectedOptions.roles}
                    placeholder={"Roles"}
                    onChange={onChange}
                    className={"react-select"}
                />
            </div>

            <div className="flex flex-1 items-center">
                <div className="relative -mb-px">
                    <TeamIcon width="18" fill="white" title={"false"} />
                </div>
                <MultiCheckboxSelect
                    id="equipos"
                    name="teams"
                    placeholderButtonLabel={"Equipos"}
                    options={teamsList}
                    value={selectedOptions.teams}
                    placeholder="Equipos"
                    onChange={onChange}
                    className={"react-select"}
                />
            </div>

            <div className="flex items-center justify-end space-x-2">
                <button
                    className="focus:outline-none flex w-full items-center rounded-full bg-green-960 p-2"
                    onClick={() => setSelectedOptions(INITIAL_FILTERS)}>
                    <Clean className="fill-current text-white" width="1.188rem" height="1.188rem" />
                </button>
                <button className="focus:outline-none flex items-center rounded-full bg-primary-200 p-2">
                    <DownloadIcon width="1rem" fill="white" />
                </button>
            </div>
        </div>
    );
};

export default UsersFilters;
