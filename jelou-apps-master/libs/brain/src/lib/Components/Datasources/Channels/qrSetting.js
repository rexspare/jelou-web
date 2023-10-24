import { useTranslation } from "react-i18next";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import isEmpty from "lodash/isEmpty";

import { TriangleOfCircles } from "@apps/shared/icons";
import { CHANNEL } from "../../../constants";
import { useGetSwaps } from "../../../services/brainAPI";
import { Modal } from "../../../Modal";
import ModalHeader from "../../../Modal/modalHeader";
import QRCodeImage from "./common/qrCodeImage";

const QRSetting = (props) => {
    const { openModal, closeModal, channelSelected } = props;
    const { t } = useTranslation();

    const { data, isFetching } = useGetSwaps({ referenceId: channelSelected?.reference_id });

    const handleCloseModal = () => {
        closeModal();
    };

    return (
        <Modal
            closeModal={() => null}
            openModal={openModal}
            className="h-min w-auto rounded-20 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)]"
            classNameActivate="">
            <div className="w-[500px] justify-start">
                <ModalHeader
                    icon={<TriangleOfCircles />}
                    title={
                        !isEmpty(channelSelected)
                            ? `${t(CHANNEL.SINGULAR_CAPITALIZED)} ${channelSelected?.name}`
                            : `${t("common.create")} ${t(CHANNEL.SINGULAR_LOWER)}`
                    }
                    closeModal={handleCloseModal}
                />
                {isFetching ? (
                    <SkeletonTheme color="#e7e7e7" highlightColor="#44444412">
                        <section className="space-y-6 px-10 pt-8 pb-8">
                            <div className="mb-10">
                                <Skeleton />
                            </div>
                            <div className="mb-10">
                                <Skeleton />
                            </div>
                        </section>
                    </SkeletonTheme>
                ) : (
                    <section className="space-y-6 px-10 pt-8 pb-8">
                        <div className="mb-10">{t("brain.scanCodeMessage")}</div>
                        <QRCodeImage size={100} />
                    </section>
                )}
            </div>
        </Modal>
    );
};

export default QRSetting;
