import {
  AudioIcon,
  ContactIcon,
  DocumentsIcon,
  LocationIcon,
  MediaIcon,
  OptionsListIcon,
  QuickRepliesIcon,
  StickerIcon,
  TextIcon,
  VideoIcon,
} from "../../../Icons";

export function LabelBtnTextConfig() {
  return (
    <div className="flex items-center gap-2">
      <TextIcon />
      <span>Texto</span>
    </div>
  );
}

export function LabelBtnImagenConfig() {
  return (
    <div className="flex items-center gap-2">
      <MediaIcon />
      <span>Imagen</span>
    </div>
  );
}

export function LabelBtnVideoConfig() {
  return (
    <div className="flex items-center gap-2">
      <VideoIcon width={21} height={18} />
      <span>Video</span>
    </div>
  );
}

export function LabelBtnStickerConfig() {
  return (
    <div className="flex items-center gap-2">
      <StickerIcon width={21} height={21} />
      <span>Sticker</span>
    </div>
  );
}

export function LabelBtnFileConfig() {
  return (
    <div className="flex items-center gap-2">
      <DocumentsIcon width={18} />
      <span>Documentos</span>
    </div>
  );
}

export function LabelBtnListConfig() {
  return (
    <div className="flex items-center gap-2">
      <OptionsListIcon />
      <span>Lista</span>
    </div>
  );
}

export function LabelBtnQuickRepliesConfig() {
  return (
    <div className="flex items-center gap-2">
      <QuickRepliesIcon />
      <span>Respuesta rápida</span>
    </div>
  );
}

export function LabelBtnLocationConfig() {
  return (
    <div className="flex items-center gap-2">
      <LocationIcon />
      <span>Ubicación</span>
    </div>
  );
}

export function LabelBtnAudioConfig() {
  return (
    <div className="flex items-center gap-2">
      <AudioIcon />
      <span>Audio</span>
    </div>
  );
}

export function LabelBtnContactConfig() {
  return (
    <div className="flex items-center gap-2">
      <ContactIcon color="#00B3C7" />
      <span className="w-fit">Contacto</span>
    </div>
  );
}
