import { get } from "lodash";
import { useRef } from "react";
import { useReactFlow } from "reactflow";

import { TextInput } from "@builder/common/inputs";
import { useBasicAuthHttp } from "./basic.auth-http.hook";

export const BasicHttp = ({ nodeId }: { nodeId: string }) => {
    const dataNode = useReactFlow().getNode(nodeId);
    const { password = null, username = null } = get(dataNode, "data.configuration.authentication") ?? {};

    const formElementRef = useRef<HTMLFormElement>({} as HTMLFormElement);
    const { handleInputChange } = useBasicAuthHttp(nodeId);

    return (
        <form ref={formElementRef} className="grid gap-4 px-6">
            <TextInput defaultValue={username} hasError="" label="Usuario" name="username" onChange={handleInputChange(formElementRef)} placeholder="Usuario" />
            <TextInput defaultValue={password} hasError="" label="Contraseña" name="password" onChange={handleInputChange(formElementRef)} placeholder="Contraseña" />
        </form>
    );
};
