/** @typedef {import('../../domain/nodes').Code} Code */
/** @typedef {import('reactflow').Node<Code>} Node */

import { useState } from "react";

import { CloseIcon, GenerateCodeAI, SpinnerIcon } from "../../../Icons";
import { ModalHeadless } from "../../../common/Headless/Modal";
import { TYPE_ERRORS, renderMessage } from "../../../common/Toastify";
import { PreviewCode } from "../../../common/code/Preview.code";
import { TextAreaInput } from "../../../common/inputs";
import { CodeRepository } from "../codeRepository";

const INSTRUCTION_NAME_INPIUT = "instruction";

const codeRepository = new CodeRepository();

/**
 * Modal for generate documentation of code with AI
 * @param {{
 * isOpen: boolean,
 * onClose: () => void,
 * nodeId: string
 * }} props
 */
export const CodeAIModal = ({ isOpen, onClose, nodeId }) => {
  const [isLoadingGenerateDocs, setIsLoadingGenerateDocs] = useState(false);
  const [codeText, setCodeText] = useState("");

  /**
   * @param {React.FormEvent<HTMLFormElement>} event
   */
  const handleGenerateCodeClick = async (event) => {
    event.preventDefault();

    setIsLoadingGenerateDocs(true);
    setCodeText("");

    const formData = new FormData(event.currentTarget);
    const instruction = formData.get(INSTRUCTION_NAME_INPIUT);

    try {
      const response = await codeRepository.generateCode(String(instruction));
      if (!response.body) {
        renderMessage(
          "Tuvimos un problema generando este código, por favor intente neuvamente recargando la página. Si persiste comuniquese con un operador",
          TYPE_ERRORS.ERROR
        );
        setIsLoadingGenerateDocs(false);
        return;
      }

      codeRepository.readStream(response, setCodeText);
    } catch (error) {
      renderMessage(
        "Tuvimos un problema generando esta documentación, por favor intente neuvamente recargando la página. Si persiste comuniquese con un operador",
        TYPE_ERRORS.ERROR
      );
    } finally {
      setIsLoadingGenerateDocs(false);
    }
  };

  return (
    <ModalHeadless isOpen={isOpen} closeModal={onClose} showBtns={false} showClose={false} className="h-[80vh] w-[85vw]">
      <header className="flex h-12 justify-between rounded-t-[14px] bg-[#D7B8FF] px-7 text-[#36055C]">
        <div className="flex items-center gap-3">
          <GenerateCodeAI />
          <h3 className="text-lg font-medium">Asistente de código con IA</h3>
        </div>
        <button onClick={onClose}>
          <CloseIcon />
        </button>
      </header>

      <main className="grid h-[calc(100%-70px)] grid-cols-2 text-[#36055C]">
        <form onSubmit={handleGenerateCodeClick} className="ml-7">
          <h4 className="my-4 flex items-center gap-2 font-medium">
            Instrucción
            {isLoadingGenerateDocs && <SpinnerIcon width={15} />}
          </h4>
          <TextAreaInput
            label=""
            name={INSTRUCTION_NAME_INPIUT}
            placeholder="Escribe aquí la instrucción para generar el código con IA"
            className="h-[calc(100%-100px)] rounded-10 border-1 border-gray-330 bg-white px-2 py-6 pl-3"
          />

          <div className="mt-2 flex w-full justify-end">
            <button
              type="submit"
              disabled={isLoadingGenerateDocs}
              className="grid h-8 w-40 place-content-center rounded-lg bg-[#D7B8FF] font-medium disabled:cursor-not-allowed disabled:opacity-60">
              {isLoadingGenerateDocs ? <SpinnerIcon /> : "Generar"}
            </button>
          </div>
        </form>

        <div>
          <h4 className="my-4 ml-7 font-medium">Código</h4>
          <div className="mx-7 h-[calc(100%-100px)]">
            <PreviewCode highlightLazy highlight classNameWrapp="h-full" className="h-full max-h-[calc(80vh-100px)]" content={codeText} />
          </div>
        </div>
      </main>
    </ModalHeadless>
  );
};
