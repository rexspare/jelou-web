import { ModalHeadless } from "@builder/common/Headless/Modal";
import { TabHeadless } from "@builder/common/Headless/Tabs";
import { FromLink } from "@builder/common/Headless/Tabs/Component/FromLink";
import { UploadFile } from "@builder/common/Headless/Tabs/Component/UploadFile";
import { BLOCK_TYPES } from "@builder/modules/Nodes/message/domain/constants.message";
import { getConfigLabel } from "../utils.blocks";

const titleList = [
  {
    id: "1",
    label: "Sube un archivo",
  },
  {
    id: "2",
    label: "Desde enlace",
  },
  // {
  //   id: '3',
  //   label: 'GIPHY'
  // },
  // {
  //   id: '4',
  //   label: 'Video embebido'
  // }
];

type MediaBlockModalProps = {
  type: BLOCK_TYPES;
  isOpen: boolean;
  closeModal: () => void;
  saveUrlMedia: (url: string) => () => Promise<void>;
};

const MediaBlockModal = ({ type, isOpen, closeModal, saveUrlMedia }: MediaBlockModalProps) => {
  const panelList = [
    {
      id: "1",
      Content: () => <UploadFile closeModal={closeModal} saveUrlMedia={saveUrlMedia} type={type} />,
      name: "Sube un archivo",
    },
    {
      id: "2",
      Content: () => <FromLink closeModal={closeModal} saveUrlMedia={saveUrlMedia} />,
      name: "Desde enlace",
    },
    // {
    //   id: '3',
    //   Content: () => <Giphy />,
    //   name: 'GIPHY'
    // },
    // {
    //   id: '4',
    //   Content: () => <VideoEmbedded closeModal={closeModal} saveUrlMedia={saveUrlMedia} />,
    //   name: 'Video embebido'
    // }
  ];

  return (
      <main>
        <TabHeadless
          panelList={panelList}
          titleList={titleList}
          classNamePanel="h-72 text-gray-330 mt-4"
          classNameList="flex justify-start !grow !text-gray-400"
          classNameNav="flex w-full border-b-1 border-gray-230"
          className="h-76 [&_button]:!w-full [&_li]:!w-full"
          classNameSelected="border-b-3 border-transparent py-1"
          tabSpace="mt-3 !text-gray-400 hover:!text-primary-200"
        />
      </main>

  );
};

export default MediaBlockModal;
