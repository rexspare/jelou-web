export type ITesterRepository = {
    responseQuestionStream(question: Question): Promise<Response>;
    saveLog({ datastoreId, log }: SaveLog): Promise<void>;
    getHistory({ datastoreId, userId }: { datastoreId: string; userId: string }): Promise<unknown>;
    readStream(response: Response, setText: React.Dispatch<React.SetStateAction<string>>): Promise<string>;
};

export type Question = {
    question: string;
    namespace: string;
    type: string;
    model: string;
    temperature: number;
    context: object[];
};

export type LoadingTester = { setIsLoading: React.Dispatch<React.SetStateAction<boolean>> };

export type CreateLog = SendQuestion & { responseIA: string };

export type Log = {
    question: string;
    answer: string;
    context: object[];
    type: string;
    model: string;
    reference_id: string;
    duration: number;
    token_usage: number;
};

export type SaveLog = {
    log: Log;
    datastoreId: string;
};

export type LogResponse = {
    id: number;
    question: string;
    answer: string;
    context: object[];
    type: string;
    model: string;
    duration: number;
    token_usage: number;
    reference_id: string;
    brain_id: string;
    created_at: Date;
    updated_at: Date;
};

export type AnswerSource = {
    reference_id: string;
    datastoreId: string;
    question: string;
    chatSettings: {
        model: string;
        temperature: string;
        minimum_score: string;
    };
};

export type SendQuestion = {
    answerSourcesResponse: AnswerSourceResponse;
    answerSources: AnswerSource;
};

export type ConversationProps = {
    answerSources: AnswerSource;
};

export interface AnswerSourceResponse {
    rephrased_question: string;
    sources: Source[];
}

interface Source {
    [x: string]: unknown;
    page_content: string;
    score: number;
    knowledge: Knowledge;
    knowledge_source: KnowledgeSource;
    source_block: SourceBlock;
}

interface Knowledge {
    id: string;
    name: string;
    description: null;
    type: string;
    metadata: Metadata;
    sync_status: string;
    available_on_bots: boolean;
    available_on_connect: boolean;
    status: string;
    brain_id: string;
    deleted_at: null;
    created_at: Date;
    updated_at: Date;
    chunks: number;
    tokens: number;
}

interface Metadata {
    url: string;
}

interface KnowledgeSource {
    id: string;
    name: string;
    type: string;
    metadata: null;
    sync_status: string;
    status: string;
    knowledge_id: string;
    deleted_at: null;
    created_at: Date;
    updated_at: Date;
}

interface SourceBlock {
    id: string;
    content: string;
    length: number;
    tokens: number;
    metadata: unknown[];
    knowledge_source_id: string;
    created_at: Date;
    updated_at: Date;
}
