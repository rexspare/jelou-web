type ThumbnailProps = {
    id: number;
    Icon:
        | React.FC<{
              width?: number;
              height?: number;
              color?: string;
          }>
        | string;
    pickedThumbnail: number | string;
    handleClickThumbnail: () => void;
};

export const Thumbnail = (props: ThumbnailProps) => {
    const { id, Icon, pickedThumbnail, handleClickThumbnail } = props;
    const isPickedThumbnail = pickedThumbnail === id || pickedThumbnail === Icon;

    return (
        <div
            onClick={handleClickThumbnail}
            className={`relative flex h-[4rem] w-[4rem] cursor-pointer items-center justify-center rounded-lg border-1 ${isPickedThumbnail ? "border-line-hsm" : "border-gray-200"}`}
        >
            <input
                readOnly
                type="radio"
                name="thumbnail"
                checked={isPickedThumbnail}
                className="focus:ring-0 text-line-hsm absolute left-[0.2rem] top-[0.2rem] h-3 w-3 border-gray-200 bg-white focus:ring-white focus:ring-offset-0"
            />
            {typeof Icon === "string" ? <img src={Icon} alt="thumbnail" className="h-10 w-10 object-cover" /> : <Icon />}
        </div>
    );
};
