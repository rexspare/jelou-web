import { SpinnerIcon } from "@apps/shared/icons";
import { JelouShopApi } from "@apps/shared/modules";
import get from "lodash/get";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export const SeeCatalogueButton = () => {
    const [loading, setLoading] = useState(false);

    const { t } = useTranslation();

    const company = useSelector((state) => state.company);
    const userSession = useSelector((state) => state.userSession);

    const goToEcommerce = () => {
        const app_id = get(company, "properties.shopCredentials.jelou_ecommerce.app_id", null);
        const { id, names } = userSession;
        if (!app_id) return;

        setLoading(true);

        JelouShopApi.post(`apps/${app_id}/generate_link`, {
            cart_products: [],
            client: {
                reference_id: String(id),
                names,
            },
        })
            .then(({ data }) => {
                window.open(data.short_url, "_blank");
            })
            .catch((err) => {
                console.log("err", err);
            })
            .finally(() => setLoading(false));
    };

    return (
        <button onClick={goToEcommerce} className="flex items-center justify-center h-8 gap-3 px-4 ml-4 text-base text-white catalogoGradient w-44 whitespace-nowrap">
            {loading ? (
                <SpinnerIcon />
            ) : (
                <>
                    <EcommerceIcon /> <span>{t("shop.seeCatalog")}</span>
                </>
            )}
        </button>
    );
};

const EcommerceIcon = ({ width = 23, height = 16, color = "currentColor" } = {}) => {
    return (
        <svg viewBox="0 0 23 16" xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none">
            <path
                fill={color}
                d="M11.405 15.195H1.093c-.321 0-.565-.145-.681-.444a.687.687 0 0 1 .6-.956c.203-.002.406-.004.61 0 .086.002.11-.031.107-.113-.003-.634-.005-1.27-.005-1.905 0-.28.004-.561.004-.842V5.75c0-1.437-.002-2.875.001-4.314C1.731.797 2.093.27 2.7.07c.141-.047.296-.066.445-.068 1.635-.004 3.27 0 4.904 0L13.851 0c1.925 0 3.85.002 5.775 0 .553 0 .971.234 1.257.702.132.217.19.459.19.708.004.983.002 1.968.002 2.95v9.295c0 .136 0 .136.131.136.2 0 .401-.002.6.002.325.008.608.304.633.629.039.485-.373.78-.753.777-1.476-.01-2.952-.004-4.43-.004-1.95.002-3.9 0-5.85 0Zm8.26-13.779H3.279c-.133 0-.133 0-.133.124 0 4.044 0 8.085-.002 12.129 0 .099.029.126.126.124.967-.004 1.934-.002 2.902-.002H19.51c.15 0 .15 0 .15-.155V7.261c0-1.786.005-3.571.005-5.36v-.485Z"
            />
            <path
                fill={color}
                d="M16.261 5.545c-.46 0-.92.004-1.383-.002a.698.698 0 0 1-.7-.565c-.076-.32.116-.667.43-.791a.834.834 0 0 1 .29-.058c.406-.006.812-.004 1.218-.004.501 0 1.002-.008 1.503.004a.71.71 0 0 1 .697.865.708.708 0 0 1-.673.547c-.46.004-.921.002-1.382.004 0-.002 0-.002 0 0ZM16.253 8.463c-.46 0-.922-.012-1.383.003a.7.7 0 0 1-.698-.816.69.69 0 0 1 .67-.588c.938-.008 1.876-.008 2.812 0 .275.002.482.149.604.398.128.264.087.513-.085.743a.599.599 0 0 1-.528.26c-.463-.006-.927 0-1.392 0ZM16.253 11.39c-.46 0-.922-.012-1.383.004a.7.7 0 0 1-.698-.817.69.69 0 0 1 .67-.588c.938-.008 1.876-.008 2.812 0 .275.002.482.15.604.399.128.263.087.512-.085.743a.6.6 0 0 1-.528.259c-.463-.008-.927-.002-1.392 0ZM12.413 11.25 11.35 5.799c-.058-.298-.354-.476-.607-.476h-.488V4.52a1.778 1.778 0 0 0-.474-1.163c-.567-.615-1.579-.72-2.254-.236-.354.255-.6.61-.695.996-.054.217-.054.428-.054.613v.587h-.526c-.25 0-.553.182-.608.478l-1.03 5.454c-.038.199.013.408.135.557a.6.6 0 0 0 .472.224h6.584a.59.59 0 0 0 .454-.197.67.67 0 0 0 .155-.582ZM8.464 4.066c.17-.008.298.037.399.141a.52.52 0 0 1 .141.348v.767h-.967l-.002-.453v-.37l.002-.011a.385.385 0 0 1 .11-.248l.062-.064.006-.006.002-.002.073-.046c.01-.006.018-.012.027-.015h.006l.027-.014.008-.004.075-.02.012-.003h.02Zm2.58 6.708H5.977l.793-4.199h3.454l.818 4.199Z"
            />
        </svg>
    );
};
