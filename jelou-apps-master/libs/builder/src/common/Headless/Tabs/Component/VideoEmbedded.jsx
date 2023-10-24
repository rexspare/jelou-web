import ow from "ow";
import { useState } from "react";

import { SpinnerIcon, VideoEmbeddedIcon } from "../../../../Icons";
import { TYPE_ERRORS, renderMessage } from "../../../Toastify";

const INPUT_NAMES = {
  VIDEO: "video",
};

/**
 * @param {{
 * closeModal: () => void
 * saveUrlMedia: (url: string) => () => Promise<Node>
 * }} props
 */

export const VideoEmbedded = ({ closeModal, saveUrlMedia }) => {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Function to save an url of video embedded
   * @param {React.FormEvent<HTMLFormElement>} evt
   */
  const handleSaveVideoEmbedded = (evt) => {
    evt.preventDefault();
    setIsLoading(true);

    const formData = new FormData(evt.currentTarget);
    const videoUrl = formData.get(INPUT_NAMES.VIDEO).toString();

    try {
      ow(videoUrl, ow.string.nonEmpty.message("Debes ingresar una URL de video"));
      ow(videoUrl, ow.string.url.message("Debes ingresar una URL válida"));
    } catch (error) {
      renderMessage(error.message, TYPE_ERRORS.ERROR);
      setIsLoading(false);
      return;
    }

    saveUrlMedia(videoUrl)().then(() => {
      setIsLoading(false);
      closeModal();
    });
  };

  return (
    <section className="grid items-end w-full h-full px-7">
      <div className="grid place-content-center">
        <VideoEmbeddedIcon />
      </div>
      <form className="grid items-center h-28" onSubmit={handleSaveVideoEmbedded}>
        <label htmlFor="video" className="grid gap-2">
          <span className="font-medium text-gray-400 text-13">
            Ingresa una URL de
            <span className="font-bold"> Youtube </span> o <span className="font-bold"> Vimeo </span>
          </span>
          <input
            name="video"
            placeholder="http://"
            className="w-full pl-2 text-gray-400 bg-gray-230 placeholder:text-gray-330 h-9 rounded-10 text-13 focus-within:outline-none"
          />
        </label>
        <footer className="mt-[3.25rem] flex justify-end gap-2">
          <button
            type="button"
            onClick={closeModal}
            className="h-8 px-4 font-semibold text-gray-400 min-w-1 rounded-20 bg-primary-700 disabled:cursor-not-allowed disabled:opacity-40">
            Cancelar
          </button>
          <button
            type="submit"
            className="flex items-center justify-center h-8 px-4 font-semibold text-white min-w-1 rounded-20 bg-primary-200 disabled:cursor-not-allowed disabled:opacity-40">
            {isLoading ? <SpinnerIcon /> : "Guardar"}
          </button>
        </footer>
      </form>
    </section>
  );
};
