import { rest } from "msw";

import { generateCode, generateDocs } from "./requests/IA.requests";
import { getOperators, getTeams } from "./requests/PMA.requestes";
import { createEdge, deleteEdge, getAllEdges } from "./requests/edges.requests";
import { execution } from "./requests/execution.requests";
import { createInput, deleteInput, deleteOutput, getInputs, updateInput } from "./requests/inputsOutputs.requests";
import { updateNodes } from "./requests/nodes.requests";
import { createS3URL, deleteS3URL } from "./requests/s3.requests";
import { getAllWorkflows } from "./requests/workflows.request";

export const handlers = [
  // s3 requests
  rest.post("https://api.jelou.ai/v1/companies/:companyId/datum/upload", createS3URL),
  rest.delete("https://api.jelou.ai/v1/companies/:companyId/datum", deleteS3URL),

  // inputs and outputs requests
  rest.post("https://workflows.jelou.ai/v1/toolkits/:toolkitId/tools/:toolId/inputs", createInput),
  rest.patch("https://workflows.jelou.ai/v1/toolkits/:toolkitId/tools/:toolId/inputs/:inputId", updateInput),
  rest.delete("https://workflows.jelou.ai/v1/toolkits/:toolkitId/tools/:toolId/inputs/:inputId", deleteInput),
  rest.get("https://workflows.jelou.ai/v1/toolkits/:toolkitId/tools/:toolId", getInputs),

  // outputs requests
  rest.post("https://workflows.jelou.ai/v1/toolkits/:toolkits/tools/:tools/outputs", createInput),
  rest.patch("https://workflows.jelou.ai/v1/toolkits/:toolkits/tools/:tools/outputs/:outputId", updateInput),
  rest.delete("https://workflows.jelou.ai/v1/toolkits/:toolkits/tools/:tools/outputs/:outputId", deleteOutput),

  // Workflow requests
  rest.get("https://workflows.jelou.ai/v1/workflows", getAllWorkflows),

  // PMA
  rest.get("https://api.jelou.ai/v1/companies/:companyId/teams", getTeams),
  rest.get("https://api.jelou.ai/v1/companies/135/operators", getOperators),

  // Edges
  rest.post("https://workflows.jelou.ai/v1/workflows/:workflowId/edges", createEdge),
  rest.get("https://workflows.jelou.ai/v1/workflows/:workflowId/edges", getAllEdges),
  rest.delete("https://workflows.jelou.ai/v1/workflows/:workflowId/edges/:edgeId", deleteEdge),

  // nodes
  rest.patch("https://workflows.jelou.ai/v1/workflows/:workflowId/nodes/:nodeId", updateNodes),

  // execution
  rest.post("https://workflows.jelou.ai/v1/toolkits/:toolkitsId/tools/:toolsId/execute", execution),

  // IA
  rest.post("https://ai-functions.jelou.ai/generate-docs", generateDocs),
  rest.post("https://ai-functions.jelou.ai/generate-code", generateCode),
];
