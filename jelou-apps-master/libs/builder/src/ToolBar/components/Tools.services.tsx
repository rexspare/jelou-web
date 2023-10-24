import { memo, useMemo, useState } from "react";

import { ServiceMenuIcon, SpinnerIcon, ToolKitIcon } from "@builder/Icons";

import { ToolbarMenu, type ListItems } from "@builder/common/Headless/Menu/Toolbar.Menu";
import { ToolsNodesInitialData } from "@builder/modules/Nodes/Tool/domain/tool.domain";
import { NODE_TYPES } from "@builder/modules/Nodes/domain/constants";

import { validatedMessageListNodes } from "@builder/modules/Nodes/message/domain/messagesByChannels.validation";
import { useQueryMyPublishedTools } from "@builder/pages/Home/ToolKits/hooks/useQueryTools";
import { getThumbnailsIcon } from "@builder/shared/utils";

import { MESSAGE_LIST_NODES, QUESTIONS_LIST_NODES } from "../constants.toolbar";
import { ActionsList } from "./ItemsList.toolbar";
import { MarkerplaceModal } from "./Marketplace/MarkerplaceModal";

const size = 20;

const ToolsServicesPanel = () => {
    return (
        <section className="absolute left-[0.6rem] top-[5rem] z-10 flex w-[64px] flex-col gap-y-2">
            <div className="flex h-14 w-full flex-col items-center justify-center rounded-10 bg-white p-1 shadow-[4px_4px_5px_rgba(184,_189,_201,_0.25)] transition-all duration-300 ease-out">
                <SkillsOptionsMenu />
            </div>
            <div className="flex h-fit w-[64px] flex-col items-center rounded-10 bg-white p-1 shadow-[4px_4px_5px_rgba(184,_189,_201,_0.25)] transition-all duration-300 ease-out">
                <div className="mb-2 w-full border-b-1 border-gray-34 pb-2">
                    <ActionsList list={QUESTIONS_LIST_NODES} showText showTooltip={false} />
                </div>
                <ActionsList list={MESSAGE_LIST_NODES} showText showTooltip={false} />
                <Toolkits />
            </div>
        </section>
    );
};

export default memo(ToolsServicesPanel);

function SkillsOptionsMenu() {
    const list = validatedMessageListNodes();

    return (
        <ToolbarMenu className="-top-[3.25rem] left-[4rem] h-[532px] !w-[250px] overflow-y-scroll">
            <ToolbarMenu.Button
                IconMenu={() => <ServiceMenuIcon height={size} width={size} />}
                className="flex h-[48px] w-full cursor-pointer flex-col items-center justify-center rounded-[8px] text-10 font-semibold"
                label="Mensaje"
                size={size}
            />
            <ToolbarMenu.CustomList>
                <ul className="flex h-fit flex-col pt-[6px]">
                    <ActionsList list={list} isContextual showTooltip={false} />
                </ul>
            </ToolbarMenu.CustomList>
        </ToolbarMenu>
    );
}

function Toolkits() {
    const { data: tools, isLoading } = useQueryMyPublishedTools();
    const [openMarketplaceModal, setOpenMarketplaceModal] = useState(false);

    const list = useMemo<ListItems<ToolsNodesInitialData>[]>(() => {
        return tools.map(({ id, name, configuration, toolkitId }) => {
            const { thumbnail } = configuration;
            const Icon = getThumbnailsIcon(thumbnail);

            return {
                id,
                text: name,
                nodeType: NODE_TYPES.TOOL,
                Icon,
                initialData: {
                    toolId: id,
                    toolkitId,
                    toolName: name,
                    ...configuration,
                },
            };
        });
    }, [tools]);

    const IconMenu = isLoading ? SpinnerIcon : ToolKitIcon;

    return (
        <>
            <ToolbarMenu className="bottom-0 left-[4rem] h-[30rem]">
                <ToolbarMenu.Button
                    IconMenu={() => <IconMenu width={size} />}
                    className="flex h-[48px] w-full cursor-pointer flex-col items-center justify-center rounded-[8px] text-10 font-semibold"
                    label="Tools"
                    size={size}
                />
                {/* <ToolbarMenu.Header title="Tools" className="h-[3.25rem] bg-[#E6F6FA] text-secondary-300" IconMenu={ToolKitIcon} size={size} /> */}
                <ToolbarMenu.List list={list} size={size} className="[&_li]:border-b-1 [&_li]:border-gray-330 hover:[&_li]:text-secondary-300" />
                <ToolbarMenu.Footer onClick={() => setOpenMarketplaceModal(true)} className="mb-2 h-8 w-full rounded-full bg-secondary-300 text-blue-20">
                    Marketplace
                </ToolbarMenu.Footer>
            </ToolbarMenu>

            <MarkerplaceModal onClose={() => setOpenMarketplaceModal(false)} isOpen={openMarketplaceModal} />
        </>
    );
}
