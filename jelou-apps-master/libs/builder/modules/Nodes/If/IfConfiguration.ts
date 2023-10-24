import { IF, Operator, Term } from "./IF.domain";

export class IfConfiguration {
    constructor(private readonly data: IF) {}

    getTerms(): Term[] {
        return this.data.configuration.terms || [];
    }

    updateTermsConfig(newTerms: Term[]) {
        const newConfiguration: IF = {
            configuration: {
                ...this.data.configuration,
                terms: newTerms,
            },
        };

        return newConfiguration;
    }

    updataOperatorConfig(newOperator: Operator) {
        const newConfiguration: IF = {
            configuration: {
                ...this.data.configuration,
                operator: newOperator,
            },
        };

        return newConfiguration;
    }

    AddNewTerm() {
        const newTerm: Term = {
            id: crypto.randomUUID(),
            type: "string",
            value1: "",
            value2: "",
            operator: "equal",
        };

        const terms = this.getTerms();

        return [...terms, newTerm];
    }

    updateTerms(termId: string, newTermValue: Term) {
        const terms = this.getTerms();
        return terms.map((term) => (term.id === termId ? { ...term, ...newTermValue } : term));
    }

    deleteTerm(termId: string) {
        const terms = this.getTerms();
        return terms.filter((term) => term.id !== termId);
    }

    public static getNewTerm(): Term {
        return {
            id: crypto.randomUUID(),
            type: "string",
            value1: "",
            value2: "",
            operator: "equal",
        };
    }
}
