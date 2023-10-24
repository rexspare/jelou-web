import { CloseIcon } from "@apps/shared/icons";
import { unitInMB } from "@apps/shared/constants";

export default function PreviewFile({
    file = {},
    isLoading = false,
    handleDeleteImage = () => null,
    IconOrImgFile,
    setSelectedFile = () => null,
    isShortCutToShowPreview = false,
    setIsShortCutToShowPreview,
    setDocumentList,
} = {}) {
    const { name, link, size } = file;

    const handleDeleteImgClick = (link) => (evt) => {
        evt.stopPropagation();
        evt.preventDefault();

        if (isShortCutToShowPreview) {
            setIsShortCutToShowPreview(false);
            setDocumentList([]);
            return;
        }
        handleDeleteImage({ urlFile: link });
    };

    const handleSelectFile = (file) => (evt) => {
        if (isLoading === false) setSelectedFile(file);
    };

    return (
        <div
            onClick={handleSelectFile(file)}
            className="divParent relative grid w-20 cursor-pointer place-content-center rounded-20 bg-primary-700 bg-opacity-75">
            {!isLoading && (
                <>
                    <button
                        disabled={isLoading}
                        type={"button"}
                        onClick={handleDeleteImgClick(link)}
                        className="absolute right-1.5 top-1.5 z-40 hidden disabled:cursor-not-allowed disabled:opacity-60">
                        <CloseIcon className="fill-current text-gray-400" width="0.5rem" height="0.5rem" />
                    </button>
                    <div className="absolute inset-0 z-20 hidden h-full w-full bg-white bg-opacity-70 px-1 text-10 text-gray-400">
                        <div className="h-full w-full pt-6">
                            <p title={name} className="truncate font-medium">
                                {name}
                            </p>
                            {size && <p className="text-center">{Number(size / unitInMB).toFixed(2)} MB</p>}
                        </div>
                    </div>
                </>
            )}
            {isLoading && (
                <div className="absolute inset-0 z-20 flex items-center justify-center text-primary-200">
                    <LoadingSpinner />
                </div>
            )}
            <picture className={isLoading ? "blur-sm" : ""}>
                <IconOrImgFile />
            </picture>
        </div>
    );
}

const LoadingSpinner = () => (
    <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);
