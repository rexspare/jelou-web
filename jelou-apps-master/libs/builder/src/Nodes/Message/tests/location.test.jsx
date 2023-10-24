import { cleanup, render } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { DBNodeToReactFlowNode } from "@/helpers/utils";
import { nodesMock } from "@mocks/data";
import { generateLocationBlock } from "@nodes/Message/Blocks/Factory/message-node.blocks";
import { Location } from "@nodes/Message/Blocks/Location.node";
import { getCurrentBlock, getInitialsMarker, updateLocationBlock } from "@nodes/Message/configPanel/Location/utils.location";

// const user = userEvent.setup()
const nodeMock = DBNodeToReactFlowNode(nodesMock.data[1]);

describe("Location utils", () => {
  beforeEach(cleanup);

  it("should return empty data", () => {
    nodeMock.data.configuration = {};
    const { locationBlock, messages } = getCurrentBlock(nodeMock, "1");
    expect(locationBlock).toBeUndefined();
    expect(messages).toHaveLength(0);

    expect(getInitialsMarker(locationBlock)).toBeNull();
  });

  it("should return location block", () => {
    const location = generateLocationBlock();
    nodeMock.data.configuration = {
      messages: [location],
    };
    const { locationBlock, messages } = getCurrentBlock(nodeMock, location.id);
    expect(locationBlock).toEqual(location);
    expect(messages).toHaveLength(1);

    locationBlock.coordinates = {
      latitude: "1",
      longitude: "2",
    };

    expect(getInitialsMarker(locationBlock)).toEqual({ lat: 1, lng: 2 });
  });

  it("should update location block", () => {
    const newConfiguration = updateLocationBlock(nodeMock, nodeMock.data.configuration.messages[0].id, {
      name: "test",
      address: "test",
      coordinates: {
        latitude: 1,
        longitude: 2,
      },
    });

    expect(newConfiguration.messages[0].name).toEqual("test");
    expect(newConfiguration.messages[0].address).toEqual("test");
    expect(newConfiguration.messages[0].coordinates).toEqual({
      latitude: 1,
      longitude: 2,
    });
  });
});

describe("Location node block", () => {
  beforeEach(cleanup);

  it("should render location block in the node with the empty data", () => {
    const location = generateLocationBlock();
    const { getByText } = render(<Location data={location} />);

    expect(getByText("Por favor configura la ubicación")).toBeTruthy();
  });

  it("should render location block in the node with the data", () => {
    const location = generateLocationBlock();
    location.name = "test";
    location.address = "test";

    const { getAllByText } = render(<Location data={location} />);

    const locationLabels = getAllByText("test");
    expect(locationLabels).toBeTruthy();
    expect(locationLabels).toHaveLength(2);
  });
});
