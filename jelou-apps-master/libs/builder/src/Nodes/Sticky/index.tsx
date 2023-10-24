import type { NodeProps } from "reactflow";

import { StickyColorPaletteColor, StickyNote, stickyColorPalette } from "@builder/modules/Nodes/Sticky/domain/sticky.domain";
import { useConfigNodeId } from "@builder/Stores";

export const StickyNoteNode = ({ data, id, selected }: NodeProps<StickyNote>) => {
    const { comments } = data.configuration;
    const setNodeIdSelected = useConfigNodeId((state) => state.setNodeIdSelected);

    const color = data.configuration.colorPalette || StickyColorPaletteColor.Yellow;
    const colorPalette = stickyColorPalette.get(color);

    const wrapperNode = {
        bg: colorPalette?.bg.color ?? "#FFFAE8",
        bgHeader: colorPalette?.header.color ?? "#FFF2CD",
        textColorHeader: colorPalette?.text.color ?? "#987001",
    };

    const selectConfigNode = () => {
        setNodeIdSelected(id);
    };

    return (
        <div
            onClick={selectConfigNode}
            className="border w-[175px] border-2 border-transparent p-4 text-sm"
            style={{
                borderColor: selected ? wrapperNode?.textColorHeader ?? "#F9DA80" : colorPalette?.bg.color ?? "#FFFAE8",
                boxShadow: "4px 6px 5px rgba(0, 0, 0, 0.15)",
                backgroundColor: colorPalette?.bg.color ?? "#FFFAE8",
            }}
        >
            <div className="max-w-[12rem h-[120px] break-words text-[#374361] [white-space:_break-spaces]" children={comments} />
        </div>
    );
};
