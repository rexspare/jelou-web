import { useRef } from "react";
import { BeatLoader } from "react-spinners";
import { withTranslation } from "react-i18next";

import { Modal } from "@apps/shared/common";
import { CloseIcon } from "@apps/shared/icons";
import { useOnClickOutside } from "@apps/shared/hooks";

const DeleteTag = (props) => {
    const { title, onClose, onSubmit, loading, t } = props;

    const ref = useRef();

    useOnClickOutside(ref, () => onClose());

    return (
        <Modal>
            <div className="fixed inset-x-0 top-0 z-120 sm:inset-0 sm:flex sm:items-center sm:justify-center">
                <div className="fixed inset-0 transition-opacity">
                    <div className="absolute inset-0 z-20 bg-gray-490/75" />
                </div>
                <div className="min-w-350 transform rounded-lg bg-white px-6 pt-5 pb-4 transition-all" ref={ref}>
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="max-w-md font-bold text-gray-400">{title}</div>
                        </div>
                        <button onClick={onClose}>
                            <CloseIcon className="fill-current text-gray-400" width="1rem" height="1rem" />
                        </button>
                    </div>
                    <form action="" onSubmit={onSubmit}>
                        <div className="mt-5 flex flex-col space-y-5 md:mt-0">
                            <div className="flex flex-row items-end justify-end sm:mt-6">
                                <span className="mr-2 w-32">
                                    <button
                                        onClick={onClose}
                                        type="button"
                                        className="w-full rounded-20 border-1 border-transparent bg-gray-10 p-2 text-base font-bold text-gray-400 focus:outline-none">
                                        {t("Cerrar")}
                                    </button>
                                </span>
                                <span className="w-32">
                                    <button type="submit" className={`button-primary w-full`} disabled={loading}>
                                        {loading ? <BeatLoader color={"white"} size={"0.625rem"} /> : `${t("monitoring.Eliminar")}`}
                                    </button>
                                </span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
};

export default withTranslation()(DeleteTag);
