import CircularProgress from "@builder/common/CircularProgressbar";
import { ListBoxHeadless, type ListBoxElement } from "@builder/common/Headless/Listbox";
import { TextAreaInput } from "@builder/common/inputs";
import { MAX_CONTENT_LENGHT, MIN_CONTENT_LENGTH, StickyColorPaletteColor, StickyColorPaletteType } from "@builder/modules/Nodes/Sticky/domain/sticky.domain";
import { useStickyConfigPanel } from "@builder/modules/Nodes/Sticky/infrastructure/StickyConfigPanel.hook";

export const StickyNoteConfig = ({ nodeId }: { nodeId: string }) => {
    const { selectedColor, comments, contentExceedError, list, handleSelectedColor, handleChangeComments } = useStickyConfigPanel({ nodeId, parseListCallback: parseListBoxElement });

    return (
        <main className="flex flex-col gap-y-6 py-8 px-6 text-gray-400">
            <TextAreaInput
                defaultValue={comments}
                className="h-full"
                label="Contenido del sticky note"
                name="sticky note"
                placeholder="Aquí va el contenido del sticky note"
                onChange={handleChangeComments}
                hasError={contentExceedError}
                maxLength={MAX_CONTENT_LENGHT}
            />
            <div className="flex items-center justify-end gap-x-1">
                <CircularProgress MAXIMUM_CHARACTERS={MAX_CONTENT_LENGHT} MINIMUM_CHARACTERS={MIN_CONTENT_LENGTH} countFieldLength={comments.length} />
            </div>
            <ListBoxHeadless list={list} value={selectedColor} label="Paleta de color" slideover setValue={handleSelectedColor} />
        </main>
    );
};

const parseListBoxElement = ([key, value]: [StickyColorPaletteColor, StickyColorPaletteType]): ListBoxElement => ({
    id: key,
    name: value.title,
    value: key,
    Icon: () => <ColorPaletteIcon colorPalette={value} />,
});

const ColorPaletteIcon = ({ colorPalette }: { colorPalette: StickyColorPaletteType }) => {
    const colors = Object.entries(colorPalette)
        .reduce<Array<{ index: number; color: string }>>((acc, [key, value]) => {
            if (key === "title") return acc;

            return [value, ...acc];
        }, [])
        .sort((a, b) => a.index - b.index);

    return (
        <ul className="flex list-none gap-x-1">
            {colors.length &&
                colors.map((color) => (
                    <li key={color.color}>
                        <div style={{ backgroundColor: color.color }} className={`flex h-5 w-5 gap-x-4 rounded-full`}></div>
                    </li>
                ))}
        </ul>
    );
};
