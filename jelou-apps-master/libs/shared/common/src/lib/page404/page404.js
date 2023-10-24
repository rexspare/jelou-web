import { Astronauts, Figures, LeftArrow } from "@apps/shared/icons";
import get from "lodash/get";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

export function Page404(props) {
  const { t } = useTranslation();
  return (
    <div className="fixed z-120 h-screen w-screen bg-white sm:block lg:flex">
      <div className="h-1/2 lg:flex lg:w-2/4 lg:flex-col lg:items-end  lg:justify-center lg:rounded-default xl:items-center">
        <div className=" mt-16 space-y-4 grid place-items-center lg:mt-0 lg:w-72 lg:place-items-start xl:w-[450px] 2xl:w-[500px]">
          <p className="flex flex-col items-center justify-center text-center text-3xl font-bold text-gray-700 lg:items-start lg:text-left lg:text-[2.5rem] lg:leading-[2.5rem] base:text-[3rem] base:leading-[3rem]">
            {t("page404.errorMessage")}
          </p>
          <p className="flex flex-col items-center justify-center text-center text-lg font-normal text-gray-700 sm:py-2 lg:items-start lg:text-left">{t("page404.notFound")}</p>
          <div className="w-full flex gap-x-2 items-center">
            <Link to="/home">
              <button className="rounded-[3rem] flex items-center flex-row gap-x-4 w-auto border-1 border-primary-200  bg-primary-200 px-6 py-2 font-bold text-white">{t("page404.backToHome")}
              <LeftArrow className="text-white" width="1rem" height="1rem" /></button>
            </Link>
          </div>
        </div>
      </div>
      <div className="lg:relative lg:flex  lg:w-2/3 lg:items-end lg:justify-center">
        <div className="animate-fadeOut">
          <Astronauts
            className="lg:-translate-x-2/4 absolute top-[10%] left-[-60%] w-[210%] scale-[0.5] sm:left-[-35%] lg:top-[50%] lg:-translate-y-1/2 xl:left-[-10%] xl:w-[110%] xl:scale-[0.8] 2xl:left-[5%] 2xl:w-full 2xl:scale-[1]"
            width="100%"
          />
        </div>
        <Figures className="opacity-0 sm:opacity-100" width="100%" />
      </div>
    </div>
  );
}
export default Page404;
