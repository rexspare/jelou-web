import { useState } from "react";

import { PublishToolModal } from "../modals/PublishToolModal";

export const TopMenu = ({ handleOpenTestTool }) => {
  const [isOpenPublishModal, setIsOpenPublishModal] = useState(false);

  return (
    <>
      <div className="flex items-center h-16 gap-2">
        <button onClick={handleOpenTestTool} className="px-4 py-1 text-sm font-semibold rounded-full border-1 border-primary-200 text-primary-200">
          Probar
        </button>
        <button onClick={() => setIsOpenPublishModal(true)} className="px-4 py-1 text-sm font-semibold text-white rounded-full bg-primary-200">
          Publicar
        </button>
      </div>
      {isOpenPublishModal && <PublishToolModal isOpen={isOpenPublishModal} handleClose={() => setIsOpenPublishModal(false)} />}
    </>
  );
};
