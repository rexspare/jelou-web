// import { cleanup, render } from "@testing-library/react";
// // import userEvent from "@testing-library/user-event";
// import { NodeProps, Position, ReactFlowProvider } from "reactflow";

// import { NODE_TYPES } from "../../domain/constants";
// import { IFNode as IfNodeT } from "../../domain/nodes";
// // import { IFConfig, IFNode } from "./index";

// type IfNodeType = NodeProps<IfNodeT>;

// // const user = userEvent.setup();

// const wrapper = ({ children }: { children: React.ReactNode }) => <ReactFlowProvider>{children}</ReactFlowProvider>;

// const ifNode: IfNodeType = {
//   id: "1",
//   type: NODE_TYPES.IF,
//   selected: false,
//   dragging: false,
//   zIndex: 0,
//   dragHandle: "sourceHandle",
//   sourcePosition: Position.Right,
//   targetPosition: Position.Right,
//   isConnectable: true,
//   xPos: 0,
//   yPos: 0,
//   data: {
//     configuration: {
//       collapsed: false,
//       operator: "and",
//       title: "Test Title",
//       terms: [
//         {
//           id: "1",
//           operator: "equal",
//           type: "string",
//           value1: "test1",
//           value2: "test2",
//         },
//       ],
//     },
//   },
// };

// describe("IFNode", () => {
//   beforeEach(cleanup);

//   it("correctly with the provided props, including the title, condition, and combinator", () => {
//     const { getByLabelText, getByText } = render(<IFNode {...ifNode} />, { wrapper });

//     const nodeTitle = getByLabelText("title-node");
//     expect(nodeTitle).toBeTruthy();

//     const combinator = getByText("Todos");
//     expect(combinator).toBeTruthy();

//     expect(getByText(/test1/)).toBeTruthy();
//     expect(getByText(/test2/)).toBeTruthy();
//   });

//   it("render node with empty condition", () => {
//     const emptyTerms: IfNodeT = {
//       configuration: {
//         collapsed: false,
//         operator: "and",
//         terms: [
//           {
//             id: "1",
//             operator: "contains",
//             type: "string",
//             value1: "",
//             value2: "",
//           },
//         ],
//         title: "Test Title",
//       },
//     };
//     const { getByText } = render(<IFNode {...ifNode} data={emptyTerms} />, { wrapper });

//     expect(getByText("Configura la combinación de las condiciones")).toBeTruthy();
//     expect(getByText("Configura está condición")).toBeTruthy();
//   });
// });

// jest.mock("reactflow", async () => {
//   return {
//     ...jest.requireActual("reactflow"),
//     useReactFlow: jest.fn().mockReturnValue({
//       getNode: jest.fn().mockReturnValue({
//         data: {
//           configuration: {
//             collapsed: false,
//             operator: "and",
//             title: "Test Title",
//             terms: [
//               {
//                 id: "1",
//                 operator: "equal",
//                 type: "string",
//                 value1: "test1",
//                 value2: "test2",
//               },
//             ],
//           },
//         },
//       }),
//     }),
//   };
// });

// // jest.mock("./if.config.hook", () => ({
// //   useIFconfig: jest.fn().mockReturnValue({
// //     handleChangeCombination: jest.fn(),
// //     handleAddNewTerm: jest.fn(),
// //     deleteBlockCondition: jest.fn(),
// //   }),
// // }));

// // describe("if node config", () => {
// //   beforeEach(cleanup);

// //   // Tests that IFConfig renders the component with correct props
// //   it("test_renders_component_with_correct_props", () => {
// //     const { getByLabelText, getByText } = render(<IFConfig nodeId="testNodeId" />);
// //     const operatorSelector = getByLabelText("Combinación de condiciones:");
// //     const addButton = getByText("+ Agregar condicional");
// //     expect(operatorSelector).toBeTruthy();
// //     expect(addButton).toBeTruthy();
// //   });
// // });
