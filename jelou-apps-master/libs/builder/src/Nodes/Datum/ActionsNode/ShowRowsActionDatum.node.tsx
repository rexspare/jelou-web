import { SpinnerIcon } from "@builder/Icons";
import { Switch } from "@builder/common/Headless/conditionalRendering";
import { type IDatum } from "@builder/modules/Nodes/Datum/domain/datum.domain";
import { useDatumNode } from "@builder/modules/Nodes/Datum/infrastructure/datumNode.hook";

type Props = {
    nodeId: string;
    databaseId?: number;
    row?: IDatum["configuration"]["row"];
};
export function ShowRowsActionNode({ row, nodeId, databaseId }: Props) {
    const { isLoading, dbColums } = useDatumNode({ nodeId, databaseId, row });

    return (
        <>
            <h4 className="text-13 font-bold leading-4 text-gray-400">COLUMNAS</h4>
            <div className="rounded-4 bg-white px-3 text-gray-610">
                <Switch>
                    <Switch.Case condition={isLoading}>
                        <div className="flex h-20 items-center justify-center text-primary-200">
                            <SpinnerIcon />
                        </div>
                    </Switch.Case>
                    <Switch.Case condition={dbColums.length > 0}>
                        <ul>
                            {dbColums.map((colum) => {
                                const { id, key } = colum;
                                const value = row?.data[key] ?? "Sin valor";

                                return (
                                    <li key={id} className="border-b-1 border-gray-330 last:border-0">
                                        <h5 className="py-4 text-xs font-semibold">
                                            <span className="break-all line-clamp-3">{key}:</span> <span className="ml-2 font-normal text-[#CDD7E7] break-all line-clamp-3">{value}</span>
                                        </h5>
                                    </li>
                                );
                            })}
                        </ul>
                    </Switch.Case>
                </Switch>
            </div>
        </>
    );
}
