import get from "lodash/get";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { JelouApiV1 } from "@apps/shared/modules";
import { updateRoomById, updateStoredParams } from "@apps/redux/store";
import Plugins from "@apps/plugins";
// import plugins from "./plugins";

const PluginRenderer = (props) => {
    const { bot, usersId } = props;
    const currentRoom = useSelector((state) => state.currentRoom);
    const userTeams = useSelector((state) => state.userTeams);
    const [plugin, setPlugin] = useState(get(bot, "properties.operatorView.plugin"));
    // const Plugin = plugins[plugin];
    const dispatch = useDispatch();

    const isGEACabinaTeam = userTeams.some((team) => team.id === 603);

    useEffect(() => {
        const { bot } = props;
        const pluginName = isGEACabinaTeam ? "@01labec/gea-ecuador" : get(bot, "properties.operatorView.plugin");
        setPlugin(pluginName);
    }, []);

    const updateName = async (name) => {
        const { id } = currentRoom;
        JelouApiV1.put(`/rooms/${id}`, { name })
            .then(() => {
                dispatch(updateRoomById({ ...currentRoom, names: name, name }));
            })
            .catch((err) => {
                console.log("error", err);
            });
    };

    return (
        <div className="w-full">
            {plugin ? (
                <Plugins
                    plugin={plugin}
                    currentRoom={props.currentRoom}
                    storeParams={props.storeParams}
                    userSession={props.userSession}
                    setStatus={props.setStatus}
                    setSidebarChanged={props.setSidebarChanged}
                    sidebarStatus={props.sidebarStatus}
                    setSidebarStatus={props.setSidebarStatus}
                    readOnly={props.readOnly || false}
                    teams={props.teams}
                    company={props.company}
                    sidebarChanged={props.sidebarChanged}
                    showSidebar={props.showSidebar}
                    toggleShowSidebar={props.toggleShowSidebar}
                    dispatch={dispatch}
                    updateUserData={updateStoredParams}
                    updateName={updateName}
                    bot={bot}
                    usersId={usersId}
                />
            ) : (
                <div></div>
            )}
        </div>
    );
};

export default PluginRenderer;
