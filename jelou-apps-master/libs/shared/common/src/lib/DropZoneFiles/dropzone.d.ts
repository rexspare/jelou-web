export interface DropZoneFilesProps {
  linkList: string[];
  accept?: string;
  searchLinkKey?: string;
  principalText?: string;
  setDisableButtonCreateData?: (value: boolean) => void;
  handleAddFile: (file: File) => Promise<string>;
  handleRemoveFile: (link: string) => Promise<void>;
}