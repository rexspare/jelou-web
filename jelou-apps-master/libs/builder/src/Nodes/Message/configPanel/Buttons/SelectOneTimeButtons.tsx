import get from "lodash/get";
import { useState } from "react";
import { useReactFlow, type Node } from "reactflow";

import type { ButtonBlock, MessageNode } from "@builder/modules/Nodes/message/domain/message.domain";

import { ListBoxHeadless, type ListBoxElement } from "@builder/common/Headless/Listbox";
import { Switch } from "@builder/common/Headless/conditionalRendering";
import { CheckboxInput, TextInput } from "@builder/common/inputs";
import { useCustomsNodes } from "@builder/hook/customNodes.hook";
import { BLOCK_TYPES } from "@builder/modules/Nodes/message/domain/constants.message";
import {
    BUTTONS_ONE_TIME_TYPES,
    QuickReplyStaticOptions,
    RedirectPayloadSkill,
    RedirectPayloadText,
    TYPE_ONE_TIME_BUTTONS_OPTIONS,
    type ButtonSettings,
} from "@builder/modules/Nodes/message/domain/quickReplay";
import { useQuerySkills } from "@builder/modules/skills/infrastructure/querySkills.hook";

type Props = {
    nodeId: string;
};

export function SelectUneTimeButtons({ nodeId }: Props) {
    const { getNode } = useReactFlow();
    const currentNode = getNode(nodeId) as Node<MessageNode>;

    const { messages } = get(currentNode, "data.configuration") ?? {};
    const { settings, id } = messages[0] as ButtonBlock;
    const { oneTimeUseButtons = false, redirectPayload } = settings ?? {};

    const quickReplayStatic = new QuickReplyStaticOptions(id, BLOCK_TYPES.BUTTONS);
    const { data: skills, isLoading } = useQuerySkills();
    const { updateLocalNode } = useCustomsNodes();

    const SkillsElements: ListBoxElement[] = skills.map((skill) => ({
        id: skill.id,
        name: skill.name,
        value: String(skill.id),
        description: skill.description,
    }));

    const [oneTimeButtonsType, setOneTimeButtonsType] = useState<ListBoxElement | undefined>(initialStateTypeSelected(settings));
    const [selectedSkillId, setSelectedSkillId] = useState<ListBoxElement | undefined>(initialStateSekillSelected(SkillsElements, settings));

    function handleChangeCheckbox(event: React.ChangeEvent<HTMLInputElement>): void {
        handleUpdateSettings("oneTimeUseButtons", event.target.checked);
    }

    function handleChangeType(optionSelected: ListBoxElement<string>): void {
        setOneTimeButtonsType(optionSelected);
        const { id, data } = currentNode;
        const redirectPayload: ButtonSettings["redirectPayload"] =
            optionSelected.value === BUTTONS_ONE_TIME_TYPES.TEXT
                ? {
                      type: "text",
                      text: "",
                  }
                : {
                      type: "edge",
                      targetId: null,
                      skillId: undefined,
                  };

        const settings: ButtonSettings = {
            ...data.configuration.messages[0].settings,
            type: optionSelected.value,
            redirectPayload,
        };

        const configuration = quickReplayStatic.makeListBlockConfig(data, "settings", settings);
        updateLocalNode(id, { configuration });
    }

    function handleUpdateSettings<T = unknown>(key: string, value: T) {
        const { id, data } = currentNode;
        const settings = {
            ...data.configuration.messages[0].settings,
            [key]: value,
        };

        const configuration = quickReplayStatic.makeListBlockConfig(data, "settings", settings);
        updateLocalNode(id, { configuration });
    }

    const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        const currentSettings = get(currentNode, "data.configuration.messages[0].settings");
        const redirectPayload = {
            ...currentSettings.redirectPayload,
            text: value,
        };

        handleUpdateSettings("redirectPayload", redirectPayload);
    };

    const handleSelectSkill = (skillSelected: ListBoxElement) => {
        setSelectedSkillId(skillSelected);
        const currentSettings = get(currentNode, "data.configuration.messages[0].settings");
        const redirectPayload = {
            ...currentSettings.redirectPayload,
            skillId: Number(skillSelected.id),
        };

        handleUpdateSettings("redirectPayload", redirectPayload);
    };

    return (
        <>
            <label className="my-4 flex text-sm text-gray-400 first-of-type:space-x-2">
                <CheckboxInput
                    defaultChecked={oneTimeUseButtons}
                    className={"checked:bg-primary-200 hover:checked:bg-primary-200 focus:ring-primary-200 focus:ring-opacity-25 focus:checked:bg-primary-200"}
                    name="useOnce"
                    label="Botones de un solo uso"
                    labelClassName="font-medium"
                    onChange={handleChangeCheckbox}
                />
            </label>

            <Switch>
                <Switch.Case condition={oneTimeUseButtons}>
                    <div className="my-4 space-y-2">
                        <ListBoxHeadless
                            label="Si el usuario utiliza más de un botón, enviar"
                            list={TYPE_ONE_TIME_BUTTONS_OPTIONS}
                            placeholder="Selecciona un tipo"
                            slideover
                            showDescription={false}
                            value={oneTimeButtonsType}
                            setValue={handleChangeType}
                        />
                        <Switch>
                            <Switch.Case condition={oneTimeButtonsType?.value === BUTTONS_ONE_TIME_TYPES.TEXT}>
                                <div className="my-2">
                                    <TextInput
                                        defaultValue={(redirectPayload as RedirectPayloadText)?.text}
                                        name="text"
                                        label="Escribe el mensaje a enviar"
                                        onChange={handleChangeText}
                                        placeholder="Escribe un texto"
                                    />
                                </div>
                            </Switch.Case>
                            <Switch.Case condition={oneTimeButtonsType?.value === BUTTONS_ONE_TIME_TYPES.SKILL}>
                                <div className="my-2">
                                    <ListBoxHeadless
                                        list={SkillsElements}
                                        label="Selecciona un skill"
                                        placeholder="Selecciona un skill"
                                        slideover
                                        isLoading={isLoading}
                                        value={selectedSkillId}
                                        setValue={handleSelectSkill}
                                    />
                                </div>
                            </Switch.Case>
                        </Switch>
                    </div>
                </Switch.Case>
            </Switch>
        </>
    );
}

function initialStateSekillSelected(SkillsElements: ListBoxElement[], settings: ButtonSettings) {
    if (settings?.type === BUTTONS_ONE_TIME_TYPES.SKILL) {
        const skillId = (settings.redirectPayload as RedirectPayloadSkill)?.skillId;
        return SkillsElements.find((skill) => skill.value === String(skillId));
    }
    return undefined;
}

function initialStateTypeSelected(settings: ButtonSettings) {
    return TYPE_ONE_TIME_BUTTONS_OPTIONS.find((type) => type.value === String(settings?.type));
}
