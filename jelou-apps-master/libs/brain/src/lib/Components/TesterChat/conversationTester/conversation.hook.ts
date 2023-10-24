import omit from "lodash/omit";

import { HTTP_BRAIN_KNOWLEGE } from "../../../module/http-brain";
import type { AnswerSourceResponse, ConversationProps, CreateLog, ITesterRepository, LoadingTester, Log, Question, SendQuestion } from "./types.conversationTester";

export class ConvesationTester {
    constructor(private readonly testerRespository: ITesterRepository, private readonly setText: React.Dispatch<React.SetStateAction<string>>) {}

    public async sendQuestion({ answerSources, answerSourcesResponse, setIsLoading }: SendQuestion & LoadingTester) {
        const type = answerSourcesResponse.sources[0]["type"];
        const isSkillOrFlow = type === "skill" || type === "flow";
        const question = this.createQuestion({ answerSourcesResponse, answerSources });
        if (isSkillOrFlow) {
            setIsLoading(false);
            const responseIA = type;
            const log = this.createLog({ answerSourcesResponse, answerSources, responseIA });
            return { log, responseIA };
        } else {
            const response = await this.testerRespository.responseQuestionStream(question);
            setIsLoading(false);
            const responseIA = await this.testerRespository.readStream(response, this.setText);
            const log = this.createLog({ answerSourcesResponse, answerSources, responseIA });
            return { log, responseIA };
        }
    }

    public async getAnswerSources({ answerSources }: ConversationProps) {
        if (!HTTP_BRAIN_KNOWLEGE) {
            throw new Error("HTTP_BRAIN_KNOWLEGE is not defined");
        }

        const body = omit(answerSources, ["datastoreId", "chatSettings"]);

        const { data } = await HTTP_BRAIN_KNOWLEGE.post<AnswerSourceResponse>(`/brains/${answerSources.datastoreId}/rephrase`, body);
        return data;
    }

    private createQuestion({ answerSourcesResponse, answerSources }: SendQuestion) {
        const question: Question = {
            question: answerSourcesResponse.rephrased_question,
            namespace: answerSources.datastoreId,
            type: "tech_support",
            model: answerSources.chatSettings.model,
            temperature: Number(answerSources.chatSettings.temperature),
            context: answerSourcesResponse.sources,
        };

        return question;
    }

    private createLog({ answerSourcesResponse, answerSources, responseIA }: CreateLog) {
        const log: Log = {
            question: answerSources.question,
            answer: responseIA,
            duration: 0,
            token_usage: 0,
            reference_id: answerSources.reference_id,
            type: "tech_support",
            model: answerSources.chatSettings.model,
            context: answerSourcesResponse.sources,
        };

        return log;
    }
}
