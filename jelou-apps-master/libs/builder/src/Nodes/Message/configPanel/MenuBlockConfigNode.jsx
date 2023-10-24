import { DeleteBlockIcon, MenuDotIcon, MoveIcon } from "libs/builder/src/Icons";
import { MenuHeadless } from "libs/builder/src/common/Headless/Menu/MenuHeadless";
import { Suspense, lazy, useState } from "react";

const DeleteBlockMessageModal = lazy(() => import("libs/builder/src/common/Headless/Modal/DeleteBlock.Message"));

export function MenuBlockCofigNode({ nodeId, itemId, keyOfListName }) {
  const [openDeleteBlockModal, setOpenDeleteBlockModal] = useState(false);

  const onClose = () => setOpenDeleteBlockModal(false);
  const handleOpenDeleteBlockModal = () => setOpenDeleteBlockModal(true);

  const menuItemsList = [
    {
      id: 1,
      label: "Mover",
      onClick: () => console.log("Mover"),
      Icon: MoveIcon,
      separator: true,
    },
    {
      id: 2,
      label: "Eliminar",
      onClick: handleOpenDeleteBlockModal,
      Icon: DeleteBlockIcon,
      separator: false,
    },
  ];

  return (
    <>
      <MenuHeadless
        menuItemsList={menuItemsList}
        IconMenu={() => <MenuDotIcon width={16} />}
        positionMenu="right-0 top-2 z-10 shadow-[0px_0px_10px_rgba(127,_128,_156,_0.25)]"
      />
      <Suspense fallback={null}>
        {openDeleteBlockModal && (
          <DeleteBlockMessageModal itemId={itemId} nodeId={nodeId} closeModal={onClose} isOpen={openDeleteBlockModal} keyOfListName={keyOfListName} />
        )}
      </Suspense>
    </>
  );
}
