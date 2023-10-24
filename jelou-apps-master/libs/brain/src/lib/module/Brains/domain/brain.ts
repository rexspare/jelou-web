export type Brains = {
    id: string;
    name: string;
    description: null | string;
    settings: Settings | null;
    status: string;
    app_id: string;
    deleted_at: null;
    created_at: Date;
    updated_at: Date;
    knowledge_count: number;
    types: BrainTypes[];
    channel_types: ChannelTypes[];
};

enum BrainTypes {
    Text = "text",
    Url = "url",
    Files = "files",
    Flows = "flows",
    SkillId = "skill_id",
}

enum ChannelTypes {
    Facebook = "facebook",
    Instagram = "instagram",
    Twitter = "twitter",
    Web = "web",
    Whatsapp = "whatsapp",
}

export type Settings = {
    model?: Model;
    temperature?: string;
    minimum_score?: minimum_score;
    embedding_type?: string;
    prompt_condense?: string;
    prompt_generate?: string;
};

enum minimum_score {
    The05 = "0.5",
    The06 = "0.6",
    The07 = "0.7",
    The08 = "0.8",
}

enum Model {
    Gpt35 = "gpt-3.5",
    Gpt35Turbo = "gpt-3.5-turbo",
    Gpt4 = "gpt-4",
    ClaudeInstant1 = "claude-instant-1",
    Claude2 = "claude-2",
    Azure="azure-gpt-3.5-turbo",
    Azure4="azure-gpt-4"
}
