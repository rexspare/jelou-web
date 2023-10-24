import Tippy from "@tippyjs/react";
import dayjs from "dayjs";
import first from "lodash/first";
import get from "lodash/get";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "tippy.js/dist/tippy.css"; // optional

import { Modal, renderMessage } from "@apps/shared/common";
import { MESSAGE_TYPES } from "@apps/shared/constants";
import { CubeIcon, DataBaseIcon, LeftArrow, StarIcon } from "@apps/shared/icons";
import { DashboardServer } from "@apps/shared/modules";
import DeleteModal from "./DeleteModal";

const DashboardCard = (props) => {
  const { dash, getDashboards, t } = props;
  const { displayName, id } = dash;
  const [favorite, setFavorite] = useState(Boolean(dash.favorite));
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedDash, setSelectedDash] = useState(0);
  const company = useSelector((state) => state.company);
  const author = get(dash, "User.names", "System");
  const navigate = useNavigate();
  const showAnalytics = () => {
    localStorage.setItem("dashboardName", displayName);
    setSelectedDash(id);
  };

  useEffect(() => {
    if (selectedDash > 0) {
      navigate(`/metrics/${selectedDash}`);
    }
  }, [selectedDash]);

  const updateDashboard = async (params) => {
    setLoadingUpdate(true);
    const { data } = await DashboardServer.patch(`companies/${company.id}/dashboards/${id}`, params);
    if (get(data, "statusMessage") === "success") {
      renderMessage("Tablero actualizado con éxito", MESSAGE_TYPES.SUCCESS);
      first(Object.keys(params)) !== "favorite" && getDashboards();
    } else {
      renderMessage("No se guardaron los cambios", MESSAGE_TYPES.ERROR);
    }
    setLoadingUpdate(false);
  };

  const onConfirmDelete = () => {
    setLoadingUpdate(true);
    updateDashboard({ state: false });
    setShowDeleteConfirm(false);
  };

  const onCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const changeFavorite = () => {
    setFavorite(!favorite);
    updateDashboard({ favorite: !favorite });
  };

  return (
    <div className="relative">
      <section
        className="relative flex flex-col w-full h-full p-8 text-left bg-white border-transparent group min-h-card rounded-xl border-3 hover:cursor-pointer hover:border-primary-200/15 hover:shadow-data-card"
        onClick={showAnalytics}>
        <div className="absolute right-0 top-[40px]">
          <CubeIcon width="72" height="100" />
        </div>

        <div className="absolute bottom-0 left-0">
          <DataBaseIcon width="68" height="37" />
        </div>
        <div className="flex justify-between flex-1 w-full">
          <div className="flex flex-col w-full">
            <div className="flex flex-col w-full">
              <div className="z-10 font-semibold text-gray-400 group-hover:text-primary-200">{displayName}</div>
              <div className="pt-2">
                <div className="text-sm text-gray-400 text-opacity-60 group-hover:text-opacity-90">
                  {dash.totalAnalytics} {t("plugins.Métricas")}
                </div>
                <div className="text-sm text-gray-400 text-opacity-60 group-hover:text-opacity-90">
                  {t("plugins.Creado")}: {dayjs(dash.createdAt).format("DD/MM/YYYY")}
                </div>
                <div className="text-sm text-gray-400 text-opacity-60 group-hover:text-opacity-90">
                  {t("plugins.Autor")}: {author}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full">
          <div className="relative flex items-center justify-end w-full pt-2 space-x-2 border-t border-gray-400 border-opacity-15">
            <div className="absolute bottom-[30px] right-0 hidden group-hover:flex ">
              <svg width="61" height="126" viewBox="0 0 61 126" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="34" width="27" height="126" fill="#E6F7F9" />
                <rect y="24" width="28" height="102" fill="#E6F7F9" />
              </svg>
            </div>
            <span className="text-sm font-bold text-gray-400 text-opacity-59 group-hover:text-primary-200">{t("plugins.Ver analytics")}</span>
            <LeftArrow className="mt-1" width="10" height="8" />
          </div>
        </div>
      </section>
      <div className="absolute right-0 top-3 mr-[1.3rem] flex flex-row items-center">
        <Tippy content={favorite ? t("plugins.Desmarcar") : t("plugins.Destacar")} placement={"right"} touch={false}>
          <button className="h-9 w-7" onClick={changeFavorite}>
            <StarIcon className="h-[18px] w-[18px]" fill={favorite ? "#00B3C7" : "none"} stroke={favorite ? "none" : "rgba(114, 124, 148, 0.59)"} />
          </button>
        </Tippy>
        {/* <Menu as="div">
                    <Menu.Button className="h-9 w-7">
                        <MoreOptionsIcon width="12" height="4" className="fill-current" />
                    </Menu.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95">
                        <Menu.Items className="absolute right-0 z-120 w-36 overflow-hidden rounded-[0.5625rem] bg-white shadow-menu">
                            <Menu.Item>
                                <div className="flex flex-col">
                                    <button
                                        className="px-4 py-2 font-bold text-left text-gray-400 focus:outline-none text-13 hover:bg-primary-200 hover:bg-opacity-10 hover:text-primary-200"
                                        onClick={() => setShowDeleteConfirm(true)}>
                                        {t("dropDownMenu.delete")}
                                    </button>
                                </div>
                            </Menu.Item>
                        </Menu.Items>
                    </Transition>
                </Menu> */}
      </div>
      {showDeleteConfirm && (
        <Modal>
          <DeleteModal onConfirm={onConfirmDelete} onCancel={onCancelDelete} t={t} loading={loadingUpdate} />
        </Modal>
      )}
    </div>
  );
};

export default DashboardCard;
