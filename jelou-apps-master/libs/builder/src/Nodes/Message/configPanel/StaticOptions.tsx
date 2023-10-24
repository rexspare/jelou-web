import { debounce, toLower } from "lodash";
import { useCallback } from "react";
import { Node, useReactFlow } from "reactflow";

import CircularProgress from "@builder/common/CircularProgressbar";
import { ButtonsBlockConfMenu } from "@builder/common/Headless/Menu";
import { Switch } from "@builder/common/Headless/conditionalRendering";
import { TYPE_ERRORS, renderMessage } from "@builder/common/Toastify";
import { TextAreaInput, TextInput } from "@builder/common/inputs";
import { Option } from "@builder/common/inputs/types.input";
import { useCustomsNodes } from "@builder/hook/customNodes.hook";
import { BLOCK_TYPES } from "@builder/modules/Nodes/message/domain/constants.message";
import { MessageNode } from "@builder/modules/Nodes/message/domain/message.domain";
import { ButtonOption, NAMES_INPUTS_BUTTONS_BLOCK, QuickReplyStaticOptions } from "@builder/modules/Nodes/message/domain/quickReplay";
import { OptionsTypesMessages, getMaxLengthByBlockType, validationMaxOptions } from "@builder/modules/Nodes/message/domain/sizeMessage.validation";

type StaticOptionProps = {
    nodeId: string;
    messageId: string;
    options: ButtonOption[];
    setOptions: React.Dispatch<React.SetStateAction<ButtonOption[]>>;
    typeOptionMessage: OptionsTypesMessages;
};

export function StaticOption({ nodeId, messageId, options, setOptions, typeOptionMessage }: StaticOptionProps) {
    const { updateLocalNode } = useCustomsNodes();
    const { getNode } = useReactFlow();
    const currentNode = getNode(nodeId) as Node<MessageNode>;

    const quickReplayStatic = new QuickReplyStaticOptions(messageId, typeOptionMessage);
    const staticOptions = quickReplayStatic.getStaticOptions(options);
    const staticOptionLength = getMaxLengthByBlockType(typeOptionMessage);

    const hanldeAddNewStaticOption = () => {
        const node = getNode(nodeId) as Node<MessageNode>;

        try {
            const { newConfiguration, newOptions } = quickReplayStatic.addOption(node.data, options);
            setOptions(newOptions);
            updateLocalNode(currentNode.id, { configuration: newConfiguration });
        } catch (error) {
            let message = "Ocurrió un error al agregar una nueva opción estática";
            if (error instanceof Error) message = error.message;
            renderMessage(message, TYPE_ERRORS.ERROR);
        }
    };

    const handleDeleteBlock = (optionId: string) => () => {
        const node = getNode(nodeId) as Node<MessageNode>;
        const { newConfiguration, newOptions } = quickReplayStatic.deleteOption(node.data, options, optionId);

        setOptions(newOptions);
        updateLocalNode(currentNode.id, { configuration: newConfiguration });
    };

    const handleChangeInputs = useCallback(
        (optionId: string) =>
            debounce((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | Option) => {
                const node = getNode(nodeId) as Node<MessageNode>;

                const { newConfiguration, newOptions } = quickReplayStatic.inputChange(node.data, options, event as React.ChangeEvent<HTMLInputElement>, optionId);

                setOptions(newOptions);
                updateLocalNode(currentNode.id, { configuration: newConfiguration });
            }, 500),
        [currentNode, messageId, updateLocalNode]
    );

    return (
        <>
            <ul className="space-y-4">
                {staticOptions.map((option) => {
                    const { id, title, description } = option;

                    return (
                        <li key={id} className="flex items-start gap-2">
                            <span className="sr-only">optionItem</span>
                            <div className="mt-2 text-gray-330">
                                <ButtonsBlockConfMenu handleDeleteBlock={handleDeleteBlock(id)} />
                            </div>
                            <article className="grid w-full gap-4 rounded-10 border-1 border-gray-330 p-4 text-13 font-medium text-gray-400">
                                <TextInput
                                    value={title}
                                    label="Nombre de la opción"
                                    name={NAMES_INPUTS_BUTTONS_BLOCK.TITLE}
                                    placeholder="Escribe tu opción"
                                    onChange={handleChangeInputs(id)}
                                    maxLength={staticOptionLength}
                                />
                                <CircularProgress MAXIMUM_CHARACTERS={staticOptionLength} MINIMUM_CHARACTERS={0} countFieldLength={title.length} />
                                {toLower(typeOptionMessage) === BLOCK_TYPES.LIST && (
                                    <>
                                        <TextAreaInput
                                            onChange={handleChangeInputs(id)}
                                            defaultValue={description}
                                            label="Descripción"
                                            placeholder="Escribe tu mensaje"
                                            name={NAMES_INPUTS_BUTTONS_BLOCK.DESCRIPTION}
                                            maxLength={72}
                                        />
                                        <CircularProgress MAXIMUM_CHARACTERS={72} MINIMUM_CHARACTERS={0} countFieldLength={description.length} />
                                    </>
                                )}
                            </article>
                        </li>
                    );
                })}
            </ul>
            <Switch>
                <Switch.Case condition={staticOptions.length < validationMaxOptions(typeOptionMessage)}>
                    <button onClick={hanldeAddNewStaticOption} className="text-13 font-semibold text-primary-200">
                        + Agregar nueva opción estática
                    </button>
                </Switch.Case>
            </Switch>
        </>
    );
}
