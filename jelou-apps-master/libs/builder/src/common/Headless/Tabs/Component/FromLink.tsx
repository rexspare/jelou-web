import { useState } from "react";
import z from "zod";

import { LinkIcon, SpinnerIcon } from "@builder/Icons";
import { TYPE_ERRORS, renderMessage } from "@builder/common/Toastify";

const INPUT_NAMES = {
    URL: "url",
};

type FromLinkProps = {
    closeModal: () => void;
    saveUrlMedia: (url: string) => () => Promise<void>;
};

export const FromLink = ({ closeModal, saveUrlMedia }: FromLinkProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSaveUrlMedia = (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        setIsLoading(true);

        const formData = new FormData(evt.currentTarget);
        const imageUrl = formData.get(INPUT_NAMES.URL)?.toString();

        try {
            const url = z.string().url().parse(imageUrl);

            saveUrlMedia(url)().then(() => {
                setIsLoading(false);
                closeModal();
            });
        } catch (error) {
            let message = "Ocurrió un error al guardar la URL";
            if (error instanceof z.ZodError) message = error.errors[0].message;
            if (error instanceof Error) message = error.message;

            renderMessage(message, TYPE_ERRORS.ERROR);
            setIsLoading(false);
        }
    };

    return (
        <section className="h-full w-full px-7 py-3 pt-4">
          <div className="grid h-full w-full place-content-stretch gap-5 rounded-12 border-1 border-dashed p-4">
            <div className="grid place-content-center">
                <LinkIcon width={100} height={100} />
            </div>
            <form onSubmit={handleSaveUrlMedia} className="grid h-full items-center w-full">
                <label htmlFor="url" className="grid gap-2">
                    <span className="text-13 font-bold text-gray-600 pl-3">Ingresa una URL</span>
                    <input name={INPUT_NAMES.URL} placeholder="http://" className="h-9 w-full rounded-10 border-1 !border-gray-230 pl-2 text-13 text-gray-400 placeholder:text-gray-330 focus-within:outline-none" />
                </label>
              {/*                <footer className="mt-[3.25rem] flex justify-end gap-2">
                                  <button type="button" onClick={closeModal} className="h-8 min-w-1 rounded-20 bg-primary-700 px-4 font-semibold text-gray-400 disabled:cursor-not-allowed disabled:opacity-40">
                                      Cancelar
                                  </button>
                                  <button
                                      type="submit"
                                      className="flex h-8 min-w-1 items-center justify-center rounded-20 bg-primary-200 px-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                                  >
                                      {isLoading ? <SpinnerIcon /> : "Guardar"}
                                  </button>
                  </footer>*/}
            </form>
            </div>
        </section>
    );
};
