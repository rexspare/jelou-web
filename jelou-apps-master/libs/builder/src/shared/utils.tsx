import { ToolKitIcon } from "@builder/Icons";
import { THUMBNAILS } from "@builder/pages/Home/ToolKits/modals/CreateEditTool/PickThumbnail/constants.thumbnail";

export function getThumbnailsIcon(thumbnail: string | number) {
    let Icon = ToolKitIcon;

    if (typeof thumbnail === "string") {
        Icon = ({ width, height }) => <img src={thumbnail} width={width} height={height} alt="thumbnail" className="object-cover" />;
    }

    if (typeof thumbnail === "number") {
        Icon = THUMBNAILS.find(({ id }) => id === thumbnail)?.Icon || ToolKitIcon;
    }

    return Icon;
}
