import type { IfErrorNode } from "@builder/modules/Nodes/domain/nodes";
import { get } from "lodash";
import { useReactFlow, type Node } from "reactflow";

import { ListBoxHeadless, type ListBoxElement } from "@builder/common/Headless/Listbox";
import { useCustomsNodes } from "../../hook/customNodes.hook";
import { ERRORS_PMA } from "../PMA/constants.pma";

const IF_ERROR_NAMES = {
    ORIGIN: "origin",
    TYPE_ERROR_VALUE: "value",
};

type Props = {
    nodeId: string;
};

export const IfErrorConfigNode = ({ nodeId }: Props) => {
    const node = useReactFlow().getNode(nodeId) as Node<IfErrorNode>;
    const { terms = [] } = get(node, "data.configuration") ?? {};
    const { updateLocalNode } = useCustomsNodes();

    const errorValue = terms[0]?.value2;
    const defatultOptionSelected = ERRORS_PMA.find((error) => error.value === errorValue) || undefined;
    const errorsOptions = ERRORS_PMA.filter((error) => error.value !== errorValue);

    const handleChangeTypeErrorValue = (errorSelected: ListBoxElement) => {
        const newTerms = terms.map((term) => ({ ...term, value2: errorSelected.value }));

        const config = {
            ...node.data.configuration,
            terms: newTerms,
        };

        updateLocalNode(node.id, { configuration: config });
    };

    return (
        <article className="grid w-full gap-4 p-4 text-13 font-medium text-gray-400">
            <p className="rounded-12 border-1 border-gray-230 p-3 text-13 shadow-[4px_4px_5px_rgba(184,_189,_201,_0.25)]">Conectar a Jelou Connect</p>
            <ListBoxHeadless
                slideover
                list={errorsOptions}
                defaultValue={defatultOptionSelected}
                label="Acción del botón"
                name={IF_ERROR_NAMES.TYPE_ERROR_VALUE}
                placeholder="Selecione un error"
                setValue={handleChangeTypeErrorValue}
            />
        </article>
    );
};
