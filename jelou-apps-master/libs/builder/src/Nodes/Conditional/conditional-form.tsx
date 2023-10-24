// import { InputSelector, TextInput } from "@builder/common/inputs";
// import { Term } from "@builder/modules/Nodes/If/IF.domain";
// import { NAMES_IF_INPUTS, OPTIONS_CONDITION_TYPE, OPTIONS_OPERATOR } from "@builder/modules/Nodes/If/constants.If-config";
// import { useConditionalForm } from "./conditional-form.hook";
// import { Condition } from "@builder/modules/Nodes/Conditional/domain/conditional.domain";

// type Props = {
//     term: Term;
//     nodeId: string;
//     condition: Condition;
//     conditions: Condition[];
//     shouldDisplayLabels?: boolean;
// };

// export const ConditionalForm = ({ term, nodeId, shouldDisplayLabels, condition, conditions }: Props) => {
//     const { id, operator, type, value1, value2 } = term;
//     const { formDataRef, handleChange, handleChangeText, isOperatorEmptyOrNotEmpty, conditionTypeSelected } = useConditionalForm(nodeId);

//     const operatorOptions = OPTIONS_OPERATOR[conditionTypeSelected ?? type];

//     return (
//         <form ref={formDataRef} className="grid w-full grid-cols-[7rem_12rem_8rem_12rem] items-center gap-2">
//             <InputSelector
//                 hasError=""
//                 label={shouldDisplayLabels ? "Dato" : ""}
//                 name={NAMES_IF_INPUTS.CONDITION_TYPE}
//                 options={OPTIONS_CONDITION_TYPE}
//                 defaultValue={type}
//                 placeholder="Tipo"
//                 onChange={handleChange(condition, id, NAMES_IF_INPUTS.CONDITION_TYPE)}
//             />

//             <TextInput
//                 hasError=""
//                 label={shouldDisplayLabels ? "Primer Valor" : ""}
//                 name={NAMES_IF_INPUTS.VALUE_1}
//                 placeholder="Valor 1"
//                 defaultValue={value1}
//                 onChange={handleChangeText(condition, id, NAMES_IF_INPUTS.VALUE_1)}
//             />

//             <InputSelector
//                 hasError=""
//                 label={shouldDisplayLabels ? "Operador" : ""}
//                 name={NAMES_IF_INPUTS.OPERATOR}
//                 options={operatorOptions}
//                 defaultValue={operator}
//                 placeholder="Operador"
//                 onChange={handleChange(condition, id, NAMES_IF_INPUTS.OPERATOR)}
//             />
//             {!isOperatorEmptyOrNotEmpty && (
//                 <TextInput
//                     hasError=""
//                     label={shouldDisplayLabels ? "Segundo Valor" : ""}
//                     name={NAMES_IF_INPUTS.VALUE_2}
//                     placeholder="Valor 2"
//                     defaultValue={value2}
//                     onChange={handleChangeText(condition, id, NAMES_IF_INPUTS.VALUE_2)}
//                 />
//             )}
//         </form>
//     );
// };
