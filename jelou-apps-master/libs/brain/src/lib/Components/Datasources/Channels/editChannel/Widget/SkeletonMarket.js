import { CloseIcon1, ImageIcon, PreviewCircleIcon } from "@apps/shared/icons";
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";

const SkeletonMarket = () => {
    const { t } = useTranslation();
    return (
        <section className="flex max-h-screen min-h-screen w-full flex-col rounded-20 bg-white shadow-sm">
            <article className="flex w-full flex-row items-center justify-between bg-primary-350 py-4 px-6">
                <div className="flex items-center gap-x-2">
                    <PreviewCircleIcon width="2.1rem" height="2.1rem" />
                    <span className="flex font-semibold text-primary-200">{t("common.preview")}</span>
                </div>
                <div className="flex items-center gap-x-3">
                    <button
                        onClick={() => {
                            window.close();
                        }}
                        className="rounded-full bg-primary-200 py-2 px-5 font-bold text-white"
                    >
                        {t("common.close")} {t("common.preview")}
                    </button>
                </div>
            </article>
            <article className="flex items-center border-b-1 border-neutral-200 p-6">{t("brain.infoPreview")}</article>
            <span className="mx-6 mt-8 mb-2 text-4xl font-bold text-gray-610">Market</span>
            <section className="flex min-h-full w-full flex-row gap-x-8 px-6">
                <article className="w-1/5">
                    <Skeleton count={2} height="1.6rem" style={{ background: "#EFF1F4", transition: "none" }} />
                    <Skeleton width="100%" style={{ marginTop: "2rem", background: "#EFF1F4", transition: "none" }} />
                    <div className="mt-4 flex w-full items-center gap-x-2">
                        <div className="h-[12px] w-[12px] rounded-xs border-2 border-[#B0B6C2]"></div>
                        <Skeleton width={100} style={{ background: "#EFF1F4", transition: "none" }} />
                    </div>
                    <div
                        className="flex h-[22%] w-full flex-col overflow-y-scroll pl-4"
                        onScroll={({ currentTarget }) => {
                            currentTarget.scrollTo(0, 0);
                        }}
                    >
                        {Array.from({ length: 8 }).map((p, i) => (
                            <div key={i} className="my-1 flex w-full items-center gap-x-2">
                                <div className="h-[12px] w-[12px] rounded-full border-2 border-[#B0B6C2]"></div>
                                <Skeleton width={100} style={{ background: "#EFF1F4", transition: "none" }} />
                            </div>
                        ))}
                    </div>
                    <div className="mt-2 flex w-full items-center gap-x-2">
                        <div className="h-[12px] w-[12px] rounded-xs border-2 border-[#B0B6C2]"></div>
                        <Skeleton width={100} style={{ background: "#EFF1F4", transition: "none" }} />
                    </div>
                    <div className="mt-2 flex w-full items-center gap-x-2">
                        <div className="h-[12px] w-[12px] rounded-xs border-2 border-[#B0B6C2]"></div>
                        <Skeleton width={100} style={{ background: "#EFF1F4", transition: "none" }} />
                    </div>
                </article>
                <article
                    className="flex w-4/5 overflow-scroll"
                    onScroll={({ currentTarget }) => {
                        currentTarget.scrollTo(0, 0);
                    }}
                >
                    <div className="grid w-full grid-cols-4 gap-4">
                        {Array.from({ length: 8 }).map((p, i) => (
                            <div key={i} className=" flex h-[248px] flex-col rounded-4 border-1 border-[#B0B6C2] p-2">
                                <div className="mb-2 flex h-2/3 items-center justify-center rounded-4 bg-[#EFF1F4]">
                                    <ImageIcon width="3rem" height="3rem" fill="#727C94" />
                                </div>
                                <Skeleton width="100%" style={{ background: "#EFF1F4", transition: "none" }} />
                                <Skeleton width="50%" style={{ background: "#EFF1F4", transition: "none" }} />
                                <Skeleton width="20%" style={{ background: "#EFF1F4", marginTop: 12, transition: "none" }} />
                            </div>
                        ))}
                    </div>
                </article>
            </section>
        </section>
    );
};

export default SkeletonMarket;
