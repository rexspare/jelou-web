/* eslint-disable array-callback-return */
import first from "lodash/first";
import isEmpty from "lodash/isEmpty";
import TextareaAutosize from "react-autosize-textarea";
import { BeatLoader } from "react-spinners";

import { useTranslation } from "react-i18next";
import FormModal from "../form-modal/form-modal";

import TextAreaWithEmojis from "../textAreaEmojis/TextAreaWithEmojis";

const MAX_LENGTH_TWITTER_REPLIES = 280;

const Preview = (props) => {
    const { 
        attachments, 
        closePreview, 
        handleChange, 
        sending,
        setAttachments, 
        setText,
        submitChange, 
        text,
        type, 
        uploading, 
    } = props;

    const { t } = useTranslation();
    const deleteFromArray = (index) => {
        const att = [...attachments];
        att.splice(index, 1);
        setAttachments(att);
    };

    const firstAttachments = first(attachments) || [];

    return (
        <FormModal title="Vista previa" onClose={closePreview} maxWidth="md:min-w-560 md:max-w-560">
            <div className="flex w-full flex-col">
                <div className="relative px-10 my-auto">
                    {!isEmpty(firstAttachments) ? (
                        <div className="relative flex justify-center w-auto h-auto py-4 pl-3 pr-1 border border-gray-100 rounded-md hover:border-gray-300">
                            <img
                                className="relative flex items-center justify-center object-contain h-40 rounded-lg opacity-85 xxl:h-60 max-h-40 xxl:max-h-60 custom-file-upload"
                                src={firstAttachments.imgUrl}
                                alt="preview"
                            />
                        </div>
                    ) : null}
                    <div className="grid items-center grid-cols-6 gap-4 my-4">
                        {attachments.map((att, index) => {
                            if (index !== 0) {
                                return (
                                    <div className="relative flex h-[2rem] max-h-[4rem] w-auto xxl:h-[8rem] xxl:max-h-[4rem]">
                                        <img
                                            className="relative flex items-center justify-center object-contain h-full m-auto rounded-lg opacity-85 custom-file-upload"
                                            src={att.imgUrl}
                                            alt="preview"></img>
                                        <button
                                            className="absolute top-0 right-0 flex mb-1 ml-1 text-xs font-bold text-gray-400 rounded-full cursor-pointer focus:outline-none"
                                            onClick={() => deleteFromArray(index)}
                                            disabled={uploading}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-3 h-3"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                );
                            }
                        })}
                    </div>
                    <TextAreaWithEmojis 
                        text={text} 
                        setText={setText} 
                        handleChange={handleChange} 
                        maxLength={MAX_LENGTH_TWITTER_REPLIES} 
                    />
                </div>
                <div className="flex items-center justify-center w-full pt-4 mt-0 rounded-b-lg bg-modal-footer md:pt-8">
                    {sending ? (
                        <button className="w-32 btn-primary focus:outline-none">
                            <BeatLoader size={"0.625rem"} color="#ffff" />
                        </button>
                    ) : (
                        <button className="w-32 font-bold btn-primary focus:outline-none" onClick={() => submitChange()}>
                            {t("pma.Enviar")}
                        </button>
                    )}
                </div>
            </div>
        </FormModal>
    );
};

export default Preview;
