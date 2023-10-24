export type Datastore = {
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
  types: string[];
  channel_types: string[];
}

export type Settings = {
  prompt_condense: string;
  prompt_generate: string;
  model: string;
  temperature: string;
  minimum_score: string;
}