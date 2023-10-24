// import { test } from "@playwright/test";

// import { expect, test } from '@playwright/test'
// import { NODE_TYPES, TITLE_NODES } from '../../src/constants.local.js'
// import { workflowsMock } from '../Mocks/data.js'
// import { responseDataEdges, responseDataNodes, responseWorkflows } from '../Mocks/RouterResponses.js'

test.describe("workflow page", () => {
  test("Validate and navigate workflow", async ({ page }) => {
    // await page.route('**/workflows/5/nodes', responseDataNodes)
    // await page.route('**/workflows/5/edges', responseDataEdges)
    // await page.route('**/workflows', responseWorkflows)
    // await page.goto('/') // navigate to the workflow page
    // const workflowList = page.locator('ul > li')
    // expect(workflowList).toHaveCount(workflowsMock.data.length)
    // const nameWorkflowSelected = workflowsMock.data[4].name
    // const workflow = page.getByText(nameWorkflowSelected)
    // expect(workflow).toContainText(nameWorkflowSelected)
    // await workflow.click()
    // await expect(page).toHaveURL('http://localhost:5173/workflows/5')
    // const startNode = page.getByText(TITLE_NODES[NODE_TYPES.START])
    // expect(await startNode.textContent()).toBe(TITLE_NODES[NODE_TYPES.START])
  });
});
