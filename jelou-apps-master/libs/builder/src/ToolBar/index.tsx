import { useContext, useState } from "react";

import { ExecuteHttpNodeModal } from "@builder/Nodes/Http/configPanel/ExecuteHttpNodeModal";
import { useExecuteNodeStore } from "@builder/Stores/nodeConfigStore";
import { Switch } from "@builder/common/Headless/conditionalRendering/Switch";
import { useQueryTool } from "@builder/pages/Home/ToolKits/hooks/useQueryTools";
import { FROM_PAGE } from "@builder/pages/constants.home";

import { DeleteNodeModal } from "@builder/common/Headless/Modal/DeleteNode";
import { FromPageContext } from "@builder/pages/Workflow";
import { ConfigPanel } from "../Nodes/shere/SliderOver-ConfigPanels";
import { CreateInput } from "./Tools/Createinput";
import { OutputsAdmin } from "./Tools/OutputsAdmin";
import { TestTool } from "./Tools/Test.tools";
import { Breadcrumb } from "./components/Breadcrumb";
import { GlobalSave } from "./components/GlobalSave";
import { ToolsToolkitPanel } from "./components/Tools.Toolkit";
import ToolsServicesPanel from "./components/Tools.services";
import { TopMenu } from "./components/TopMenu.toolbar";

const ToolBar = () => {
    const { setIsExecuteHttpNodeModalOpen, setSelectedNodeId, isExecuteHttpNodeModalOpen } = useExecuteNodeStore();

    const { revalidateTool } = useQueryTool();

    const fromPage = useContext(FromPageContext);
    const isToolsView = fromPage === FROM_PAGE.TOOL;

    const [isOpenTestTool, setIsOpenTestTool] = useState<boolean>(false);

    const handleCloseTestTool = () => setIsOpenTestTool(false);

    const handleOpenTestTool = () => {
        revalidateTool();
        setIsOpenTestTool(true);
    };

    const handleCloseExecuteHttpModal = () => {
        setIsExecuteHttpNodeModalOpen(false);
        setSelectedNodeId(null);
    };

    const isOnVariablesPage = new RegExp(/.*variables$/g).test(window.location.pathname);

    return (
        <>
            <Switch>
                <Switch.Case condition={!isOnVariablesPage && isToolsView}>
                    <ToolsToolkitPanel />
                </Switch.Case>
                <Switch.Case condition={!isOnVariablesPage && !isToolsView}>
                    <ToolsServicesPanel />
                </Switch.Case>
            </Switch>

            <section className="absolute left-[0.6rem] right-[0.6rem] top-[0.6rem] z-10 flex h-14 items-center justify-between rounded-10 bg-white px-6 shadow-[4px_4px_5px_rgba(184,_189,_201,_0.25)]">
                <div className="flex items-center gap-5">
                    <Breadcrumb />
                    <GlobalSave />
                    {/*                    <Switch>
                        <Switch.Case condition={!isOnVariablesPage && !isToolsView}>
                            <ChannelsSelector />
                        </Switch.Case>
    </Switch>*/}
                </div>
                {isToolsView && <TopMenu handleOpenTestTool={handleOpenTestTool} />}
            </section>
            {isToolsView && <OutputsAdmin />}
            <ConfigPanel />
            <CreateInput />
            <DeleteNodeModal />
            <TestTool onClose={handleCloseTestTool} isOpenTestTool={isOpenTestTool} />

            {isExecuteHttpNodeModalOpen && <ExecuteHttpNodeModal isOpen={isExecuteHttpNodeModalOpen} onClose={handleCloseExecuteHttpModal} />}
        </>
    );
};

export default ToolBar;
