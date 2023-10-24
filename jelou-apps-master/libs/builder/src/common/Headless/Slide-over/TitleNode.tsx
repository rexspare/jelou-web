import get from "lodash/get";
import { useMemo, useState } from "react";
import { useReactFlow, type Node } from "reactflow";

import { CheckIcon, SpinnerIcon } from "@builder/Icons";
import { TYPE_ERRORS, renderMessage } from "@builder/common/Toastify";
import { useCustomsNodes } from "@builder/hook/customNodes.hook";
import { NODE_TYPES } from "@builder/modules/Nodes/domain/constants";
import { BaseConfiguration } from "@builder/modules/Nodes/domain/nodes";
import { IconsNodesConfig } from "@builder/modules/SlideOver-Configuration/titleNode/iconsNodes";

import { Switch } from "../conditionalRendering";

type TitleNodeProps = {
    nodeId: string;
};

const NOT_CUSTOMIZABLE_TITLE_NODES = [NODE_TYPES.TOOL, NODE_TYPES.EMPTY];

export function TitleNode({ nodeId }: TitleNodeProps) {
    const { getNode } = useReactFlow();
    const currentNodeSelected = getNode(nodeId) as Node<{ configuration: BaseConfiguration }>;
    const defaultTitle = get(currentNodeSelected, "data.configuration.title", "Haz doble click para editar") as string;

    const { updateLocalNode } = useCustomsNodes();

    const [showInput, setShowInput] = useState(false);
    const [loading, setLoading] = useState(false);

    const Icon = useMemo(() => {
        const iconsNodesConfig = new IconsNodesConfig();
        return iconsNodesConfig.getIcon(currentNodeSelected);
    }, [currentNodeSelected]);

    const handleShowInput = () => {
        const nodeType = currentNodeSelected.type as NODE_TYPES;
        if (NOT_CUSTOMIZABLE_TITLE_NODES.includes(nodeType)) return renderMessage("No puede customizar el nombre de este nodo", TYPE_ERRORS.ERROR);
        setShowInput(true);
    };

    const handleCloseInput = () => setShowInput(false);

    const handleChangeNameNode = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        const formData = new window.FormData(event.currentTarget);
        const title = formData.get("title");

        if (!title) {
            handleCloseInput();
            setLoading(false);
            return;
        }

        const updateConfigNode = {
            configuration: {
                ...currentNodeSelected.data.configuration,
                title,
            },
        };

        updateLocalNode(nodeId, updateConfigNode)
            .catch(() => renderMessage("Error al actualizar el nombre del nodo", TYPE_ERRORS.ERROR))
            .finally(() => {
                setLoading(false);
                handleCloseInput();
            });
    };

    return (
        <div className="flex items-center gap-2">
            <Switch>
                <Switch.Case condition={Boolean(loading)}>
                    <SpinnerIcon />
                </Switch.Case>
                <Switch.Default>
                    <Icon width={26} height={26} />
                </Switch.Default>
            </Switch>

            <Switch>
                <Switch.Case condition={Boolean(showInput)}>
                    <form onSubmit={handleChangeNameNode} className="border-[currentColor] flex w-73 justify-between overflow-hidden rounded-xs border-1.5 pr-2">
                        <input
                            defaultValue={defaultTitle}
                            placeholder="Personaliza el nombre de tu nodo"
                            name="title"
                            autoFocus
                            className="my-1 w-full bg-inherit px-2 text-xs font-semibold placeholder:text-xs placeholder:font-medium placeholder:text-inherit focus:outline-none"
                        />
                        <div>
                            <button type="submit">
                                <CheckIcon />
                            </button>
                        </div>
                    </form>
                </Switch.Case>
                <Switch.Default>
                    <button onDoubleClick={handleShowInput}>
                        <span className="text-base font-medium text-current">{defaultTitle}</span>
                    </button>
                </Switch.Default>
            </Switch>
        </div>
    );
}
