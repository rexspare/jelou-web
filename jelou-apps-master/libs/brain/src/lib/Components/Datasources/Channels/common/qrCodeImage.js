import QRCode from "react-qr-code";

import { QR_BOT_NUMBER } from "libs/brain/src/lib/constants";
import { CornerBordersIcon } from "@apps/shared/icons";

const QRCodeImage = (props) => {
    const { phoneNumberForQRCode = QR_BOT_NUMBER, size = 100, className } = props;

    return(
        <div className={`${className ?? "mx-auto h-auto w-36"} flex items-center justify-center`}>
            <div className="flex flex-col">
                <div className="flex flex-row justify-between">
                    <div className="transform rotate-270">
                        <CornerBordersIcon />
                    </div>
                    <CornerBordersIcon />
                </div>
                <div className="mx-6">
                    <QRCode value={`https://wa.me/${phoneNumberForQRCode}`} size={size}/>
                </div>
                <div className="flex flex-row justify-between">
                    <div className="transform rotate-180">
                        <CornerBordersIcon />
                    </div>
                    <div className="transform rotate-90">
                        <CornerBordersIcon />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRCodeImage;