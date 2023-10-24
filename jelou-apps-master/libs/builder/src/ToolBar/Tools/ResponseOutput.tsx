import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { FailedIcon, SpinnerIcon, SuccessIcon } from "@builder/Icons";
import { DiclosureHeadless } from "@builder/common/Headless/Disclosure";
import { OUTPUT_TYPES } from "@builder/modules/OutputTools/domain/contants.output";

import { JsonPreview } from "../../common/code/JsonPreview.code";
import { OutputExecution } from "../../pages/Home/ToolKits/types.toolkits";
import { ToolExecutionRepository } from "../../services/tools";

type ResponseOutputProps = {
    outputExecuted: OutputExecution;
};

type Log = {
    _id: string;
    appId: string;
    name: string;
    type: string;
    executionTime: number;
    executionId: string;
    nodeId: string;
    nodeTypeId: string;
    initialState?: object;
    finalState?: object;
    createdAt: string;
    updatedAt: string;
};

export const ResponseOutput = ({ outputExecuted }: ResponseOutputProps) => {
    const { executionId } = outputExecuted;

    const [logs, setLogs] = useState<Log[]>([]);
    const [ref] = useAutoAnimate();

    const isLogVisible = logs && logs.length > 0;

    const { isLoading: isLoadingLogs } = useQuery(["execution", "logs", executionId], () => ToolExecutionRepository.getLogs(executionId), {
        refetchInterval: Infinity,
        enabled: Boolean(executionId),
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,

        onSuccess: (data) => {
            let intervalId: NodeJS.Timer;
            if (data && data.length > 0) {
                const logs = [...data];
                const log = logs.shift();
                setLogs((prevLogs) => [...prevLogs, log]);

                intervalId = setInterval(() => {
                    if (logs.length === 0) {
                        clearInterval(intervalId);
                        return;
                    }

                    const log = logs.shift();
                    setLogs((prevLogs) => [...prevLogs, log]);
                }, 1000);
            }
        },
    });

    useEffect(() => {
        return () => setLogs([]);
    }, []);

    return (
        <div ref={ref} className="flex h-[37.5rem] flex-col overflow-y-scroll p-8 text-gray-400">
            <h1 className="mb-4 flex items-center gap-2 text-lg font-semibold text-primary-200">
                Output
                {isLoadingLogs && <SpinnerIcon />}
            </h1>
            <ul ref={ref} className="space-y-4">
                {isLogVisible &&
                    logs.map((log) => {
                        const { name, _id, type, initialState, finalState } = log;
                        const color = type === OUTPUT_TYPES.SUCCESS ? "text-green-960" : "text-[#F12B2C]";

                        const hasOnlyInitialState = initialState && !finalState;
                        const hasOnlyFinalState = !initialState && finalState;

                        return (
                            <li key={_id} ref={ref}>
                                <DiclosureHeadless
                                    idButton={_id}
                                    defaultOpen={false}
                                    classNameButton={color}
                                    classNamePanel="pl-4 space-y-2"
                                    LabelButton={() => (
                                        <div className={`flex items-center gap-2 ${color}`}>
                                            {type === OUTPUT_TYPES.SUCCESS ? <SuccessIcon width={20} height={20} /> : <FailedIcon width={20} height={20} />}
                                            <h4>{name}</h4>
                                        </div>
                                    )}
                                >
                                    <div className="ml-[0.90rem] mt-1 flex flex-col gap-2">
                                        {hasOnlyInitialState && <JsonPreview src={initialState} />}
                                        {hasOnlyFinalState && <JsonPreview src={finalState} />}

                                        {!hasOnlyInitialState && initialState && (
                                            <DiclosureHeadless LabelButton="Estado Inicial" idButton="initialState" defaultOpen={false}>
                                                <JsonPreview src={initialState} />
                                            </DiclosureHeadless>
                                        )}
                                        {!hasOnlyFinalState && finalState && (
                                            <DiclosureHeadless LabelButton="Estado Final" idButton="finalState" defaultOpen={false}>
                                                <JsonPreview src={finalState} />
                                            </DiclosureHeadless>
                                        )}
                                    </div>
                                </DiclosureHeadless>
                            </li>
                        );
                    })}
            </ul>
            {/* {showVisualOutput && (
        <div className={`mt-4 ${colorOutput}`}>
          <DiclosureHeadless
            defaultOpen={false}
            idButton="visualOutput"
            LabelButton={() => (
              <div className="flex items-center gap-2">
                {output.type === OUTPUT_TYPES.SUCCESS ? <SuccessIcon width={20} height={20} /> : <FailedIcon width={20} height={20} />}
                <h4>Tool Output</h4>
              </div>
            )}>
            <VisualOutput output={output} />
          </DiclosureHeadless>
        </div>
      )} */}
        </div>
    );
};

// /**
//  * @param {{
//  * output: OutputExecution['output']
//  * }} props
//  */
// export function VisualOutput({ output }) {
//   const { name, type, description, value = "undefined" } = output ?? {};

//   useEffect(() => {
//     if (value === "undefined") {
//       renderMessage("No se ha establecido el valor de salida. Asegurate de establecer la variable 'output' en tu código", TYPE_ERRORS.WARNING);
//     }
//   }, [value]);

//   return (
//     <div className="flex flex-col gap-4 mt-4">
//       <div>
//         <div className="flex items-center gap-2">
//           <span className="block mb-1 text-sm font-medium text-gray-400">Tipo:</span>
//           <Tippy theme="jelou" placement="top" animation="shift-away" content="Tipo de output en el termino la ejecucción del tool">
//             <button className="h-fit w-fit">
//               <QuestionIcon color="#00B3C7" width={15} height={15} />
//             </button>
//           </Tippy>
//         </div>
//         <p className="min-h-[2rem] rounded-10 border-1 border-gray-330 bg-white px-2 py-2 text-13 text-gray-400">{OUTPUTS_TYPES_LABELS[type]}</p>
//       </div>

//       <div>
//         <span className="block mb-1 text-sm font-medium text-gray-400">Variable:</span>
//         <p className="line-clamp-2 min-h-[2rem] break-words rounded-10 border-1 border-gray-330 bg-white px-2 py-2 text-13 text-gray-400">{name}</p>
//       </div>
//       <div>
//         <span className="block mb-1 text-sm font-medium text-gray-400">Descripción:</span>
//         <p className="line-clamp-5 max-h-[7rem] min-h-[2rem] break-words rounded-10 border-1 border-gray-330 bg-white px-2 py-2 text-13 text-gray-400">
//           {description}
//         </p>
//       </div>

//       <div className="relative">
//         <span className="block mb-1 text-sm font-medium text-gray-400">Respuesta:</span>
//         <PreviewCode content={JSON.stringify(value, null, 2)} className="max-h-md w-82" />
//       </div>
//     </div>
//   );
// }
