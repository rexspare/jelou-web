import { HTTP_BRAIN_KNOWLEGE } from "../../../module/http-brain";
import { Question, SaveLog } from "./types.conversationTester";

export class TesterRepository {
    public async responseQuestionStream(question: Question) {
        return await fetch("https://ai-functions.jelou.ai/ai/streamQA", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Basic MDFIMzAzUEMxUTNNM05CSjlKSFcwOVkzUEU6ZDQ5NjE0NTMtNjA1OS00N2M1LTkxODktMDZkOTg4YzI4Njk3",
            },
            body: JSON.stringify(question),
        });
    }

    public async saveLog({ datastoreId, log }: SaveLog) {
      if (!HTTP_BRAIN_KNOWLEGE) {
            throw new Error("HTTP_BRAIN_KNOWLEGE is not defined");
        }

        HTTP_BRAIN_KNOWLEGE.post(`/brains/${datastoreId}/logs`, log);
    }

    public async getHistory({ datastoreId, userId }: { datastoreId: string; userId: string }) {
      if (!HTTP_BRAIN_KNOWLEGE) {
            throw new Error("HTTP_BRAIN_KNOWLEGE is not defined");
        }

        const body = {
            search: {
                value: userId,
            },
        };

        const { data } = await HTTP_BRAIN_KNOWLEGE.post(`/brains/${datastoreId}/logs/search`, body);
        return data;
    }
    /**
     * Read stream
     */
    public async readStream(response: Response, setText: React.Dispatch<React.SetStateAction<string>>): Promise<string> {
        if (!response.body) {
            return "";
        }

        const reader = response.body.pipeThrough(new window.TextDecoderStream()).getReader();

        let text = "";

        // eslint-disable-next-line no-constant-condition
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            text += value;
            setText((preState) => preState + value);
        }

        return text;
    }
}
