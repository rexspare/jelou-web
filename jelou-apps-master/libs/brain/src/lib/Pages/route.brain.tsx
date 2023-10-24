import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes } from "react-router-dom";

import { Skills } from "@builder/pages/Home/Skills";
import { ToolKits } from "@builder/pages/Home/ToolKits";
import { SkillWorkflow } from "@builder/pages/SkillsWorkflow";
import { ToolsWorkflow } from "@builder/pages/ToolsWorkflow";
import { VariablesPage } from "@builder/pages/Variables";

import Blocks from "../Components/Blocks";
import DatasourcesView from "../Components/Datasources";
import WidgetPreviewAllScreen from "../Components/Datasources/Channels/editChannel/Widget/WidgetPreviewAllScreen";
import Datastores from "../Components/Datastores";
import { HomeOneBrain } from "./HomeOneBrain";

enum ROUTER_PATH {
    BRAINS = "/",
    ONE_BRAIN = "/:datastoreId",
    KNOWLEDGE = "/:datastoreId/knowledge",
    CHANNELS = "/:datastoreId/channels",
    BLOCKS = "/:datastoreId/:datasourceId",
    WIDGET_ALL_SCREEN = "/:datastoreId/channels/:channelId/widget/:previewscreen",
    EDIT_CHANNEL = "/:datastoreId/channels/:channelId/edit",
    // --------------  SKILLS AND TOOLS ----------------
    SKILLS = "/:datastoreId/skills",
    TOOLS = "/:datastoreId/tools",
    SELECTED_TOOL_VARIABLES = "/:datastoreId/tools/:toolkitId/:toolId/variables",
    SELECTED_TOOL = "/:datastoreId/tools/:toolkitId/:toolId",
    SELECTED_WORKFLOW_WITH_ID = "/:datastoreId/skills/:serviceId",
}

const client = new QueryClient();

export function RouteBrain() {
    return (
        <QueryClientProvider client={client}>
            <Routes>
                <Route path="/" element={<Datastores />} />
                <Route path={ROUTER_PATH.ONE_BRAIN} element={<HomeOneBrain />} />
                <Route path={ROUTER_PATH.KNOWLEDGE} element={<DatasourcesView />} />
                <Route path={ROUTER_PATH.CHANNELS} element={<DatasourcesView />} />

                <Route path={ROUTER_PATH.SKILLS} element={<Skills />} />
                <Route path={ROUTER_PATH.TOOLS} element={<ToolKits />} />

                <Route path={ROUTER_PATH.SELECTED_WORKFLOW_WITH_ID} element={<SkillWorkflow />} />
                <Route path={ROUTER_PATH.SELECTED_TOOL} element={<ToolsWorkflow />} />
                <Route path={ROUTER_PATH.SELECTED_TOOL_VARIABLES} element={<VariablesPage />} />

                <Route path={ROUTER_PATH.BLOCKS} element={<Blocks />} />
                <Route path={ROUTER_PATH.EDIT_CHANNEL} element={<DatasourcesView />} />
                <Route path={ROUTER_PATH.WIDGET_ALL_SCREEN} element={<WidgetPreviewAllScreen />} />
            </Routes>
        </QueryClientProvider>
    );
}
