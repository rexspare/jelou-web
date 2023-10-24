import type { SkillNode } from "@builder/modules/Nodes/Skill/domain/skillNode.domain";

import { useState } from "react";
import { useParams } from "react-router-dom";
import { useReactFlow, type Node } from "reactflow";

import { ListBoxHeadless, type ListBoxElement } from "@builder/common/Headless/Listbox";
import { useCustomsNodes } from "@builder/hook/customNodes.hook";
import { useQuerySkills } from "@builder/modules/skills/infrastructure/querySkills.hook";

export function SkillNodeConfig({ nodeId }: { nodeId: string }) {
    const { datastoreId } = useParams();
    const { data: skills, isLoading } = useQuerySkills();

    const { updateLocalNode } = useCustomsNodes();
    const { getNode } = useReactFlow();
    const currentNode = getNode(nodeId) as Node<SkillNode>;

    const SkillsElements: ListBoxElement[] = skills.map((skill) => ({
        id: skill.id,
        name: skill.name,
        value: String(skill.id),
        description: skill.description,
    }));

    const [selectedSkillId, setSelectedSkillId] = useState<ListBoxElement | undefined>(initialStateSekillSelected(SkillsElements, currentNode));

    const handleSelectSkill = (skillSelected: ListBoxElement) => {
        setSelectedSkillId(skillSelected);

        const newConfiguration: SkillNode["configuration"] = {
            ...currentNode.data.configuration,
            skillId: skillSelected.value,
        };

        updateLocalNode(nodeId, { configuration: newConfiguration });
    };

    return (
        <div className="px-6 py-4 text-gray-400">
            <ListBoxHeadless label="Skill" list={SkillsElements} placeholder="Selecciona un skill" slideover isLoading={isLoading} value={selectedSkillId} setValue={handleSelectSkill} />

            {selectedSkillId && datastoreId && (
                <a
                    target="_blank"
                    rel="noreferrer"
                    href={`/brain/${datastoreId}/skills/${selectedSkillId.id}`}
                    className="mt-4 grid h-8 w-full place-content-center rounded-full border-1 border-primary-200 text-primary-200"
                >
                    Ir a skill
                </a>
            )}
        </div>
    );
}
function initialStateSekillSelected(SkillsElements: ListBoxElement[], currentNode: Node<SkillNode>) {
    return SkillsElements.find((skill) => skill.value === String(currentNode.data.configuration.skillId));
}
