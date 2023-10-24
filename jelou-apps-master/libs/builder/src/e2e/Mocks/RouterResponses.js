import { edgeMock, nodesMock, workflowMock, workflowsMock } from "./data.js";

/** @type {(route: Route, request: Request) => void} */
export const responseWorkflows = (route) => {
  route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify(workflowsMock),
  });
};

/** @type {(route: Route, request: Request) => void} */
export const responseWorkflow = (route) => {
  route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify(workflowMock),
  });
};

/** @type {(route: Route, request: Request) => void} */
export const responseDataNodes = (route) => {
  route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify(nodesMock),
  });
};

/** @type {(route: Route, request: Request) => void} */
export const responseDataEdges = (route) => {
  route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify(edgeMock),
  });
};
