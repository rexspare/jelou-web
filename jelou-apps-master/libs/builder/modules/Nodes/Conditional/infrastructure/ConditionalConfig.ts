import { nanoid } from "nanoid";

import { ListBoxElement } from "@builder/common/Headless/Listbox";
import { Condition, ConditionalOperator, ConditionalTerm } from "../domain/conditional.domain";

export class ConditionConfiguration {
    public static defaultCondition = "default-condition";

    public static generateNewCondition(): Condition {
        return {
            id: nanoid(),
            name: "",
            conditionPanelCollapsed: false,
            // operator: OPERATOR_ALL_COMBINATION.AND,
            terms: [this.getNewTerm()],
        };
    }

    public static getNewTerm(): ConditionalTerm {
        return {
            id: nanoid(),
            value1: "",
            value2: "",
            operator: ConditionalOperator.IS,
        };
    }

    public static sortConditionalOperatorsAlphabetically(operators: ListBoxElement<ConditionalOperator>[]) {
        return operators.sort((operatorA, operatorB) => {
            if (operatorA.name < operatorB.name) return -1;
            else if (operatorA.name > operatorB.name) return 1;
            return 0;
        });
    }
}
