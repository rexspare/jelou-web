import React from "react";
import { ImageIcon } from "@apps/shared/icons";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // optional
import { withTranslation } from "react-i18next";

const ImageInput = (props) => {
    const { t } = props;

    return (
        <Tippy content={t("pma.Imagen")} placement={"right"} touch={false}>
            <div className="border-buttons mt-2 flex h-8 cursor-pointer items-center rounded-full bg-secondary-425 hover:bg-secondary-400">
                <label className="custom-file-upload flex cursor-pointer items-center justify-center" htmlFor="image-upload">
                    <ImageIcon className="m-2 w-4 fill-current text-white" />
                </label>
                <input type="file" hidden id="image-upload" accept={props.getAcceptance()} onChange={props.handleChange} />
            </div>
        </Tippy>
    );
};

export default withTranslation()(ImageInput);
