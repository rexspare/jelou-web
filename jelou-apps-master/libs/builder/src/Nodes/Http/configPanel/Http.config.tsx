import { get } from "lodash";
import { useMemo } from "react";
import { Node, useReactFlow } from "reactflow";

import { SpinnerIcon } from "@builder/Icons";
import { TabHeadless } from "@builder/common/Headless/Tabs";
import { InputSelector, TextInput } from "@builder/common/inputs";
import { HTTP_INPUTS_NAMES, HTTP_METHODS_OPTIONS, HTTP_NAMES_ID, titleList } from "@builder/modules/Nodes/Http/constants.http";
import { Http } from "@builder/modules/Nodes/Http/http.domain";

import { AuthHttpConfig } from "./Auth/Auth.http-config";
import { BodyHttpBlock } from "./Body/body.http-config";
import { HeadersHttpConfig } from "./Headers/Header.http-config";
import { QueryHttpConfig } from "./Query/Query.http-config";
import { SettingsHttpConfig } from "./Settings/Settings-http-config";
import { useHttpConfig } from "./hook.http-config";

export const HttpConfig = ({ nodeId }: { nodeId: string }) => {
    const node = useReactFlow().getNode(nodeId) as Node<Http>;

    const { method = "", url = "", output = "" } = get(node, "data.configuration") ?? {};
    const { selectorRef, inputURLRef, handleChangeInputText, loadingCurl, handleChangeSelector } = useHttpConfig(nodeId);

    const queryBadgeNumber = get(node, "data.configuration.parameters").length ?? 0;
    const headersBadgeNumber = get(node, "data.configuration.headers").length ?? 0;

    const panelList = useMemo(
        () => [
            {
                id: HTTP_NAMES_ID.BODY,
                name: "Body",
                Content: () => <BodyHttpBlock nodeId={nodeId} />,
            },
            {
                id: HTTP_NAMES_ID.AUTH,
                name: "Autenticación",
                Content: () => <AuthHttpConfig nodeId={nodeId} />,
            },
            {
                id: HTTP_NAMES_ID.QUERY,
                name: "Query",
                Content: () => <QueryHttpConfig nodeId={nodeId} />,
            },
            {
                id: HTTP_NAMES_ID.HEADERS,
                name: "Headers",
                Content: () => <HeadersHttpConfig nodeId={nodeId} />,
            },
            {
                id: HTTP_NAMES_ID.SETTINGS,
                name: "Settings",
                Content: () => <SettingsHttpConfig nodeId={nodeId} />,
            },
        ],
        [nodeId]
    );

    return (
        <main className="text-gray-400">
            <div className="border-b-1 border-gray-230 p-6">
                <div className="mb-3 grid w-full grid-cols-[7rem_auto] items-end gap-3">
                    <InputSelector
                        hasError=""
                        selectorRef={selectorRef}
                        label="Método"
                        color="#006757"
                        defaultValue={method}
                        name={HTTP_INPUTS_NAMES.METHOD}
                        options={HTTP_METHODS_OPTIONS}
                        placeholder="Selecciona un método"
                        onChange={handleChangeSelector(HTTP_INPUTS_NAMES.METHOD)}
                    />

                    <TextInput ref={inputURLRef} label="URL" defaultValue={url} name={HTTP_INPUTS_NAMES.URL} placeholder="https://example.com" onChange={handleChangeInputText} />
                </div>

                <TextInput
                    label="Variable"
                    defaultValue={output}
                    name={HTTP_INPUTS_NAMES.OUTPUT}
                    placeholder="Escribe una variable de salida"
                    onChange={handleChangeInputText}
                />
            </div>
            {loadingCurl ? (
                <div className="grid h-40 w-full place-content-center text-primary-200">
                    <SpinnerIcon />
                </div>
            ) : (
                <TabHeadless
                    classNamePanel=""
                    enableBorder={false}
                    panelList={panelList}
                    titleList={titleList}
                    queryBadgeNumber={queryBadgeNumber}
                    headersBadgeNumber={headersBadgeNumber}
                    styleTabNotSelected="hover:text-teal-953"
                    classNameNav="border-b-1 border-gray-230 py-4"
                    styleTabSelected="text-teal-953 bg-[#ECFFFC] hover:text-teal-953 rounded-md px-2 py-0"
                />
            )}
        </main>
    );
};
