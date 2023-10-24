import { CloseIcon, InfoIcon, ReloadIcon, SettingsIcon, SpinnerIcon } from "@apps/shared/icons";
import Tippy from "@tippyjs/react";
import { useTranslation } from "react-i18next";
import { Modal } from "..";
import { PROMPTS_NAMES, useAdvancedSettingTester } from "./advancedSettingsTester.hook";
import { CharacterCounter } from "@apps/shared/common";

type Props = {
  isOpen: boolean;
  onClose: () => null;
};

const PLACEHOLDERS = {
  [PROMPTS_NAMES.PROPMPT_CONDESNE]: `En el escenario dado, la tarea consiste en refinar una pregunta de seguimiento derivada de una conversación. Si la pregunta de seguimiento se alinea bien con el contexto del relato y realmente sirve como continuación, debe reformularse en una consulta independiente manteniendo su idioma original. Sin embargo, si el seguimiento parece irrelevante o no contribuye como un elemento posterior del discurso solo retorna la pregunta sin realizar ningún cambio.

    Conversación:
    {history}

    Pregunta: {question}

    Pregunta refinada:`,
  [PROMPTS_NAMES.PROPMPT_GENERATE]: ` You are a technical support bot designed to assist users with their questions.
    You will only answer questions based on the information provided in the context. Answer the question only if the question is answerable based on the information provided in the context or you can make a well-informed guess with the information provided in the context; otherwise say you don't know it.

    To use this prompt, follow these steps:

    1. Identify the language that the question was asked in. You will need to answer in the same language. The default language is Spanish, so if doubt, answer in that language.

    2. Read the information provided below, this is the only information that you can use to answer the question.
        START_CONTEXT_INFORMATION
        {context}
        END_CONTEXT_INFORMATION

    3. Answer the question based only on the information in the verified context. If you are unable to find the answer in the context, please respond with a message indicating that you do not know the answer.

    4. The helpful answer should be clear, concise, and answerable based only on the information in your database. Don't say where the information came from, just provide the answer. If you are unable to provide a helpful answer, please respond with a message indicating that you do not know the answer.

    5. When attempting to solve a problem, provide step-by-step instructions that the user can follow.

    6. When you dont understand the question, respond with a friendly message indicating that you do not understand the question.

    7. Do not ommit any source links, return them plainly without formatting, brackets or explanations but do not make up things that aren't in the context.

    Question: {question}

    Answer:`,
};

export const AvancedSettingsTester = ({ isOpen, onClose }: Props) => {
  const { handleResetPromptSettings, handleSaveSettings, loading, datastore } = useAdvancedSettingTester({ onClose });
  const { t } = useTranslation();
  let {
    [PROMPTS_NAMES.PROPMPT_CONDESNE]: desciptionDefaultValue,
    [PROMPTS_NAMES.PROPMPT_GENERATE]: responseDefaultValue = PLACEHOLDERS[PROMPTS_NAMES.PROPMPT_GENERATE],
  } = datastore.settings ?? {};

  desciptionDefaultValue = desciptionDefaultValue ?? PLACEHOLDERS[PROMPTS_NAMES.PROPMPT_CONDESNE];
  responseDefaultValue = responseDefaultValue ?? PLACEHOLDERS[PROMPTS_NAMES.PROPMPT_GENERATE];

  return (
    <Modal className="w-92 rounded-3" classNameActivate="" openModal={isOpen}>
      <header className="flex items-center justify-between bg-primary-350 px-6 py-4 text-primary-200">
        <div className="flex items-center gap-3">
          <SettingsIcon fillCircle="#E6F7F9" />
          <h3 className="text-base font-semibold">{`${t("common.advancedSettings")}`}</h3>
        </div>
        <button onClick={onClose}>
          <CloseIcon />
        </button>
      </header>
      <form onSubmit={handleSaveSettings} className="grid gap-4 p-8">
        <p className="grid items-center justify-end text-gray-400/70">
          {`${t("brain.advancedSettings")}`}
        </p>
        <label className="">
          <Tippy content={<><div>{`${t("brain.descriptionSettings")}`}</div> <br />
            <span className="font-bold">{`${t("common.variables")}`} {`${t("common.description")}`}:</span>
            <div>
              1. <code>History</code>
            </div>
            <div>
              2. <code>Question</code>
            </div>

          </>}
            theme={"tomato"} placement={"right"} touch={false}>
            <span className="text-15 font-semibold inline-flex items-center mb-1">{`${t("common.description")}`}<InfoIcon className="ml-1" /></span></Tippy>
          <textarea
            defaultValue={desciptionDefaultValue}
            name={PROMPTS_NAMES.PROPMPT_CONDESNE}
            className="block h-40 w-full resize-none rounded-10 border-2 border-neutral-200"
          />
          <CharacterCounter
            className={"text-[#B0B6C2]"}
            colorCircle={"#B0B6C2"}
            count={desciptionDefaultValue.length}
            max={600}
            width={15}
            height={15}
            right
          />
        </label>

        <label className="">
          <Tippy content={<><div>{`${t("brain.answerSettings")}`}</div> <br />
            <span className="font-bold">{`${t("common.variables")}`} {`${t("common.answer")}`}:</span>
            <div>
              1. <code>Context</code>
            </div>
            <div>
              2. <code>Question</code>
            </div>

          </>}
            theme={"tomato"} placement={"right"} touch={false}>
            <span className="text-15 font-semibold inline-flex items-center mb-1">{`${t("common.answer")}`}<InfoIcon className="ml-1 text-sm" /></span></Tippy>
          <textarea
            defaultValue={responseDefaultValue}
            name={PROMPTS_NAMES.PROPMPT_GENERATE}
            className="block h-40 w-full resize-none rounded-10 border-2 border-neutral-200"
          />
          <CharacterCounter
            className={"text-[#B0B6C2]"}
            colorCircle={"#B0B6C2"}
            count={responseDefaultValue.length}
            max={1800}
            width={15}
            height={15}
            right
          />
        </label>
        <footer className="mt-8 flex items-center justify-between gap-4">
          <Tippy content="Resetear" theme={"tomato"} placement={"top"} touch={false}>
            <button
              onClick={handleResetPromptSettings}
              type="button"
              disabled={loading}
              className="grid h-8 w-8 place-content-center rounded-full border-1 border-primary-200 text-primary-200 disabled:cursor-not-allowed disabled:bg-opacity-60">
              {loading ? <SpinnerIcon /> : <ReloadIcon className="fill-current" width={16} />}
            </button>
          </Tippy>
          <div className="flex gap-4">
            <button type="button" onClick={onClose} className="h-10 w-32 rounded-full bg-[#EFF1F4] font-semibold text-gray-400">
              {`${t("common.close")}`}
            </button>
            <button disabled={loading} type="submit" className="button-primary grid w-32 place-content-center ">
              {loading ? <SpinnerIcon /> : `${t("common.save")}`}
            </button>
          </div>
        </footer>
      </form>
    </Modal>
  );
};
