import type { SkillNode } from "@builder/modules/Nodes/Skill/domain/skillNode.domain";
import type { NodeProps } from "reactflow";

import get from "lodash/get";
import { useMemo } from "react";

import { SkillIcon } from "@apps/shared/icons";
import { SpinnerIcon } from "@builder/Icons";
import { Switch } from "@builder/common/Headless/conditionalRendering";
import { useQuerySkills } from "@builder/modules/skills/infrastructure/querySkills.hook";
import { WrapperNode } from "../Wrapper";

export function SkillNode({ id: nodeId, selected, data }: NodeProps<SkillNode>) {
    const title = get(data, "configuration.title");
    const skillId = get(data, "configuration.skillId");

    const { data: skills, isLoading } = useQuerySkills();
    const skillSelected = useMemo(() => skills.find((skill) => String(skill.id) === skillId), [skillId, skills]);

    return (
        <WrapperNode Icon={() => <SkillIcon height={32} width={32} showBackground={false} color="currentColor" />} nodeId={nodeId} selected={selected} title={title} isActiveButtonsBlock>
            <Switch>
                <Switch.Case condition={Boolean(skillId)}>
                    <div className="shadow-nodo max-h-[17rem] min-h-20 w-56 break-words rounded-10 bg-white p-2">
                        {isLoading && (
                            <div className="grid h-full w-full place-content-center">
                                <SpinnerIcon />
                            </div>
                        )}
                        <p className="mb-2 max-h-full overflow-hidden text-13 font-semibold leading-4 text-gray-400">{skillSelected?.name}</p>
                        <p className="max-h-full overflow-hidden text-13 leading-4 text-gray-400">{skillSelected?.description}</p>
                    </div>
                </Switch.Case>
                <Switch.Default>
                    <div className="shadow-nodo min-h-20 rounded-10 border-1 border-gray-330 bg-white pl-2">
                        <span className="text-13 font-light text-gray-340">Haz clic para configurar tu skill</span>
                    </div>
                </Switch.Default>
            </Switch>
        </WrapperNode>
    );
}
