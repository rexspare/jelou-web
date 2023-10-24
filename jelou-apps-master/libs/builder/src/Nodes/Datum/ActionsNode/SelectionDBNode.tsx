import { useQueryDatumOneDatabase } from "@builder/modules/Nodes/Datum/infrastructure/queryDatum";

import { DatumNodeIcon } from "@builder/Icons";

import { ACTIONS_DATUM } from "@builder/modules/Nodes/Datum/domain/datum.domain";
import { ACTIONS_ICONS, ACTIONS_LABELS } from "@builder/modules/Nodes/Datum/domain/datum.node.constants";

type Props = {
    action?: ACTIONS_DATUM;
    databaseId?: number;
};

export function SelectionDBNode({ action, databaseId }: Props) {
    const { data: databaseSelected } = useQueryDatumOneDatabase(databaseId);

    const IconAction = ACTIONS_ICONS[action as ACTIONS_DATUM] ?? DatumNodeIcon;

    return (
        <>
            <h4 className="text-13 font-bold leading-4 text-gray-400">BASE DE DATOS</h4>
            <div className="grid h-20 grid-cols-[1.5rem_10rem] items-center gap-3 rounded-4 bg-white pl-4 text-gray-610">
                <IconAction width={20} height={20} />
                <div>
                    <p className="text-13 font-semibold line-clamp-2">{databaseSelected?.name}</p>
                    <p className="text-11 font-medium">{ACTIONS_LABELS[action as ACTIONS_DATUM]}</p>
                </div>
            </div>
        </>
    );
}
