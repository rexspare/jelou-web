// import debounce from "lodash/debounce";
// import { useRef } from "react";
import { Node, useReactFlow } from "reactflow";

// import { TextInput } from "@builder/common/inputs";
import { useCustomsNodes } from "@builder/hook/customNodes.hook";
// import { LOCATION_INPUTS_NAMES } from "@builder/modules/Nodes/message/domain/constants.message";
import { LocationBlock, MessageNode } from "@builder/modules/Nodes/message/domain/message.domain";
import { GoogleMaps } from "./GoogleMaps";
import { getCurrentBlock, getInitialsMarker, updateLocationBlock } from "./utils.location";

type LocationBlockPanelProps = {
    messageId: string;
    nodeId: string;
};

export const LocationPanel = ({ messageId, nodeId }: LocationBlockPanelProps) => {
    const { getNode } = useReactFlow();
    const currentNode = getNode(nodeId) as Node<MessageNode>;
    const { updateLocalNode } = useCustomsNodes();

    // const formRef = useRef<HTMLFormElement>({} as HTMLFormElement);

    const { locationBlock } = getCurrentBlock(currentNode, messageId);
    const initialMarker = getInitialsMarker(locationBlock);

    const handleCoordinatesChange = (coordinates: LocationBlock["coordinates"]) => {
        const currentNode = getNode(nodeId) as Node<MessageNode>;

        const newConfiguration = updateLocationBlock(currentNode, messageId, { coordinates });
        updateLocalNode(nodeId, { configuration: newConfiguration });
    };

    // const handleInputsChange = debounce(() => {
    //     const formData = new FormData(formRef.current);
    //     const name = formData.get("name");
    //     const address = formData.get("address");

    //     nameAndDirectionValidator({ name, address })
    //         .then(() => {
    //             const currentNode = getNode(nodeId) as Node<MessageNode>;

    //             const newConfiguration = updateLocationBlock(currentNode, messageId, {
    //                 name: String(name),
    //                 address: String(address),
    //             });

    //             updateLocalNode(nodeId, { configuration: newConfiguration });
    //         })
    //         .catch(() => null);
    // }, 800);

    return (
        <div className="px-6 pb-4">
            {/* <form className="mb-4 grid gap-4 text-gray-400" ref={formRef} onSubmit={(evt) => evt.preventDefault()}>
                <TextInput defaultValue={locationBlock.name} label="Nombre del lugar" name={LOCATION_INPUTS_NAMES.NAME} onChange={handleInputsChange} placeholder="Ingresa el nombre del lugar" />

                <TextInput defaultValue={locationBlock.address} hasError="" label="Dirección" name={LOCATION_INPUTS_NAMES.ADDRESS} onChange={handleInputsChange} placeholder="Ingresa tu dirección" />
            </form> */}

            <GoogleMaps initialMarker={initialMarker} onChange={handleCoordinatesChange} />
            <p className="mt-4 text-gray-400">Haz clic en el mapa para seleccionar la ubicación que deseas</p>
        </div>
    );
};
