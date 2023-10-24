import { lazy, Suspense, useCallback, useState } from "react";
import isEmpty from "lodash/isEmpty";
import { RenderFileComponent } from "@builder/common/Headless/Tabs/Component/UploadFile";
import { BLOCK_TYPES } from "@builder/modules/Nodes/message/domain/constants.message";
import { getEmptyIcon, getMediaText } from "../../utils.blocks";
import { useWorkflowStore } from "@builder/Stores";
import { S3 } from "@builder/libs/s3";

const MediaBlockModal = lazy(() => import("../MediaBlock.modal"));

type RenderImgProps = {
  type: BLOCK_TYPES;
  url: string;
  isImageRender?: boolean;
  showBtnAddMedia?: boolean;
  saveUrlMedia: (url: string) => () => Promise<void>;
};

export const RenderImg = ({ type, url = "", saveUrlMedia, isImageRender = true, showBtnAddMedia = false }: RenderImgProps) => {
  const [isOpenModal, setOpenModal] = useState(false);

  const closeModal = useCallback(() => setOpenModal(false), []);
  const openModal = () => setOpenModal(true);
  const { companyId, id: workflowId } = useWorkflowStore((state) => state.currentWorkflow) ?? {};
  const s3 = new S3(String(companyId), String(workflowId));

  const handleResetUrlMediaClick = () => {
    if (!url) return;
    //setIsLoading(true);
    console.log(url)
    s3.deleteFile(url).then(() => {
      console.log("why")
      saveUrlMedia("");
      //setIsLoading(false);

    });
  };


  return (
    <div>
      {url === "" ? (
        showBtnAddMedia ? (
          <Suspense fallback={null}>{<MediaBlockModal type={type} isOpen={isOpenModal} closeModal={closeModal} saveUrlMedia={saveUrlMedia} />}</Suspense>
        ) : (
          <EmptyIcon type={type} openModal={openModal} showBtnAddMedia={showBtnAddMedia} isImageRender={isImageRender} />
        )

      ) : (
        <>
          <RenderFileComponent showPlayer={showBtnAddMedia} url={url} />
          {/*showBtnAddMedia &&
          <footer className="flex justify-end gap-2 py-4">
            <button h-8 min-w-1 items-center justify-center rounded-20 bg-primary-200 px-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40
              disabled={isEmpty(url)}
              onClick={handleResetUrlMediaClick}
              className="flex h-8 min-w-1 items-center justify-center rounded-20 bg-primary-200 px-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Cambiar archivo
      </button></footer>*/}</>
      )}
    </div>

  );
};

type EmptyIconProps = {
  showBtnAddMedia?: boolean;
  openModal?: () => void;
  isImageRender?: boolean;
  type: BLOCK_TYPES;
};

function EmptyIcon({ showBtnAddMedia = false, openModal = () => null, isImageRender = true, type }: EmptyIconProps) {
  const Icon = getEmptyIcon(type);
  const text = getMediaText(type);

  return (
    <div className={`grid items-center ${showBtnAddMedia ? "grid-rows-[auto_3rem]" : "h-36"}`}>
      {Icon && <picture className="bg-gray-150 grid h-full place-content-center text-[#DADADA]">{Icon}</picture>}

      {showBtnAddMedia && (
        <button onClick={openModal} className="h-9 w-full bg-white text-center text-13 font-medium text-gray-400">
          + {text}
        </button>
      )}
    </div>
  );
}
