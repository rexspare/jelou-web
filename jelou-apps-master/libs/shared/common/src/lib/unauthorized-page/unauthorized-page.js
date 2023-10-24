import { Astronauts, Figures } from "@apps/shared/icons";
import get from "lodash/get";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

export function UnauthorizedPage(props) {
    const location = useLocation();
    const { t } = useTranslation();
    return (
        <div className="fixed z-120 h-screen w-screen bg-white sm:block lg:flex">
            <div className=" lg:flex lg:w-2/4 lg:flex-col lg:items-end  lg:justify-center lg:rounded-default xl:items-center">
                <div className=" mt-16 grid place-items-center lg:mt-0 lg:w-78 lg:place-items-start xl:w-112">
                    <p className="flex flex-col items-center justify-center text-center text-3xl font-bold text-primary-200 lg:items-start lg:text-left lg:text-[2.5rem] lg:leading-[2.5rem] base:text-[3rem] base:leading-[3rem]">
                        {t("UnauthorizedPage.errorMessage")}
                    </p>
                    <p className="flex flex-col items-center justify-center text-center text-lg font-semibold text-gray-400 sm:py-2 lg:items-start lg:text-left">
                        {` ${t("UnauthorizedPage.comunicate")} `}
                        <a href="mailto:soporte@01lab.co" className="underline lg:items-start">
                            {` ${t("UnauthorizedPage.textEmail")} `}
                        </a>
                    </p>
                    <Link to="/home">
                        <button className="mt-6 rounded-[3rem] bg-primary-200 px-6 py-3 font-semibold text-white">{t("page404.backToHome")}</button>
                    </Link>
                </div>
            </div>
            <div className="lg:relative lg:flex  lg:w-2/3 lg:items-end lg:justify-center">
                <div className="animate-fadeOut opacity-0">
                    <Astronauts
                        className="lg:-translate-x-2/4 absolute top-[10%] left-[-60%] w-[210%] scale-[0.5] sm:left-[-35%] lg:top-[50%] lg:-translate-y-1/2 xl:left-[-10%] xl:w-[110%] xl:scale-[0.8] 2xl:left-[5%] 2xl:w-full 2xl:scale-[1] "
                        width="100%"
                    />
                </div>
                <Figures className="opacity-0 sm:opacity-100" width="100%" />
            </div>
        </div>
    );
}

export default UnauthorizedPage;
