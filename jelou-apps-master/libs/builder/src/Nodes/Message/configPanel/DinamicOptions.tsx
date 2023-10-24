import debounce from "lodash/debounce";
import { Fragment } from "react";
import { Node, useReactFlow } from "reactflow";

import CircularProgress from "@builder/common/CircularProgressbar";
import { Switch } from "@builder/common/Headless/conditionalRendering";
import { TYPE_ERRORS, renderMessage } from "@builder/common/Toastify";
import { TextAreaInput, TextInput } from "@builder/common/inputs";
import { useCustomsNodes } from "@builder/hook/customNodes.hook";
import { BLOCK_TYPES } from "@builder/modules/Nodes/message/domain/constants.message";
import { MessageNode } from "@builder/modules/Nodes/message/domain/message.domain";
import { ButtonOption, NAMES_INPUTS_BUTTONS_BLOCK, QuickReplyDinamicOptions } from "@builder/modules/Nodes/message/domain/quickReplay";

type DinamicOptionProps = {
    nodeId: string;
    messageId: string;
    options: ButtonOption[];
    typeOptionMessage: BLOCK_TYPES;
    setOptions: React.Dispatch<React.SetStateAction<ButtonOption[]>>;
};

export function DinamicOptions({ messageId, nodeId, options, setOptions, typeOptionMessage }: DinamicOptionProps) {
    const { getNode } = useReactFlow();
    const currentNode = getNode(nodeId) as Node<MessageNode>;

    const { updateLocalNode } = useCustomsNodes();
    const quickReplyDinamicOptions = new QuickReplyDinamicOptions(messageId);

    const dinamicOptions = quickReplyDinamicOptions.getDinamicOptions(options);
    const hasDinamicOptions = dinamicOptions.length > 0;

    const hanldAddOptions = () => {
        try {
            const node = getNode(nodeId) as Node<MessageNode>;
            const { newConfiguration, newOptions } = quickReplyDinamicOptions.addOption(node.data, options);

            setOptions(newOptions);
            updateLocalNode(currentNode.id, { configuration: newConfiguration });
        } catch (error) {
            let message = "Solo puedes agregar 1 opción dinámica";
            if (error instanceof Error) message = error.message;
            renderMessage(message, TYPE_ERRORS.ERROR);
        }
    };

    const hanldRemoveOptions = () => {
        const node = getNode(nodeId) as Node<MessageNode>;
        const { newConfiguration, newOptions } = quickReplyDinamicOptions.deleteOption(node.data, options);

        setOptions(newOptions);
        updateLocalNode(currentNode.id, { configuration: newConfiguration });
    };

    const handleForm = debounce((evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        const { name, value } = evt.target as HTMLInputElement;

        const node = getNode(nodeId) as Node<MessageNode>;
        const { newConfiguration, newOptions } = quickReplyDinamicOptions.inputChange(node.data, options, { [name]: value });

        setOptions(newOptions);
        updateLocalNode(currentNode.id, { configuration: newConfiguration });
    }, 500);

    return (
        <Switch>
            <Switch.Case condition={hasDinamicOptions}>
                <>
                    <form onChange={handleForm} className="grid w-full gap-4 rounded-10 border-1 border-gray-330 p-4 text-13 font-medium text-gray-400">
                        {dinamicOptions.map((option) => {
                            const { id, title, iterable, description } = option;
                            return (
                                <Fragment key={id}>
                                    <TextInput defaultValue={iterable} label="Iterador" name={NAMES_INPUTS_BUTTONS_BLOCK.ITERABLE} placeholder="Escribe tu opción" hasError={null} />

                                    <TextInput defaultValue={title} label="Nombre de la opción" name={NAMES_INPUTS_BUTTONS_BLOCK.TITLE} placeholder="Escribe tu opción" hasError={null} />

                                    {typeOptionMessage === BLOCK_TYPES.LIST && (
                                        <TextAreaInput
                                            // onChange={handleChangeInputs(id)}
                                            defaultValue={description}
                                            label="Descripción"
                                            placeholder="Escribe tu mensaje"
                                            name={NAMES_INPUTS_BUTTONS_BLOCK.DESCRIPTION}
                                            maxLength={72}
                                        />
                                    )}
                                </Fragment>
                            );
                        })}
                    </form>
                    <button onClick={hanldRemoveOptions} className="text-13 font-semibold text-primary-200">
                        - Eliminar opción dinámica
                    </button>
                </>
            </Switch.Case>
            <Switch.Default>
                <button onClick={hanldAddOptions} className="text-13 font-semibold text-primary-200">
                    + Agregar nueva opción dinámica
                </button>
            </Switch.Default>
        </Switch>
    );
}
