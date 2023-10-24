import { SpinnerIcon } from "@builder/Icons";
import { Switch } from "@builder/common/Headless/conditionalRendering";
import { ConditionalIconsByOperator, DATUM_FILTER_OPTIONS } from "@builder/modules/Nodes/Conditional/domain/conditional.domain";
import { DatumQuery, type IDatum } from "@builder/modules/Nodes/Datum/domain/datum.domain";
import { useDatumNode } from "@builder/modules/Nodes/Datum/infrastructure/datumNode.hook";

type Props = {
    nodeId: string;
    databaseId?: number;
    row?: IDatum["configuration"]["row"];
    query: DatumQuery[];
    variable?: string;
};
export function ShowQueryDatumNode({ row, nodeId, databaseId, query, variable }: Props) {
    const { isLoading } = useDatumNode({ nodeId, databaseId, row });

    return (
        <>
            {query && query.length > 0 && <h4 className="pr-2 font-bold leading-4 text-gray-400 text-13">REGISTRO</h4>}
            <div className="bg-white rounded-4 text-gray-610">
                <Switch>
                    <Switch.Case condition={isLoading}>
                        <div className="flex items-center justify-center h-20 text-primary-200">
                            <SpinnerIcon />
                        </div>
                    </Switch.Case>
                    <Switch.Case condition={query && query.length > 0}>
                        <div className="items-center justify-center text-primary-200">
                            {query && query.length > 0
                                ? query.map((q, index) => (
                                      <div key={q.id} className={`mx-3 items-center border-gray-300 bg-white ${index !== query.length - 1 ? "mb-2 border-b-1" : ""}`}>
                                          <Query key={q.id} term={q} />
                                      </div>
                                  ))
                                : null}
                        </div>
                    </Switch.Case>
                </Switch>
            </div>
        </>
    );
}

type QueryProps = {
    term: DatumQuery;
};

const Query = ({ term }: QueryProps) => {
    const { operator, field, value } = term;

    const showCondition = field && value && operator;
    const Icon = ConditionalIconsByOperator[operator];

    const getNameForValue = (value: string) => {
        const option = DATUM_FILTER_OPTIONS.find((option) => option.value === value);
        return option ? option.name : null;
    };

    const operatorName = getNameForValue(operator);

    return (
        <p className="flex items-center justify-start gap-1 py-1 my-3 text-xs text-gray-400 break-words bg-white h-fit rounded-10">
            {showCondition ? (
                <>
                    <span className="break-all line-clamp-1">{field}</span>
                    <span className="font-bold [&_svg]:inline">
                        {Icon ? (
                            <div className="mr-2">
                                <Icon />
                            </div>
                        ) : (
                            operatorName || operator
                        )}
                    </span>{" "}
                    <span className="break-all line-clamp-1">{value}</span>
                </>
            ) : (
                "Configura esta condición"
            )}
        </p>
        // </div>
    );
};
