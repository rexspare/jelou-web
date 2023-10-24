import get from "lodash/get";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { renderMessage } from "@apps/shared/common";
import { MESSAGE_TYPES } from "@apps/shared/constants";
import { CubeIcon, DataBaseIcon } from "@apps/shared/icons";
import { DATABASE_NAME_MAX_CHARACTERS, DATABASE_DESCRIPTION_MAX_CHARACTERS } from "../../../constants";
import { useDataBases } from "../../../services/databases";

import FavoriteDatabase from "./FavoriteDatabase";
import DatabaseCardOptions from "./DatabaseCardOptions";

import EditDatabase from "../Modals/EditDatabase";
import DatabaseParams from "./DatabaseParams";
import Footer from "./Footer";
import ConditionalTruncateWithTooltip from "../../../common/ConditionalTruncateWithTooltip";

const DatabaseCard = ({ dataBase } = {}) => {
    const [loadingNameDatabase, setLoadingNameDatabase] = useState(false);
    const [nameDatabase, setNameDatabase] = useState({});
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [valueName, setValueName] = useState("");
    const [valueDescr, setValueDescr] = useState("");

    const [countName, setCountName] = useState(0);
    const [countDescr, setCountDescr] = useState(0);
    const [percentageName, setPercentageName] = useState(0);
    const [percentageDescr, setPercentageDescr] = useState(0);

    const [modalEditCards, setModalEditCards] = useState(false);

    const permissions = useSelector((state) => state.permissions);
    const databasePermissionUpdate = permissions.find((permission) => permission === "datum:update_database");
    const databasePermissionDelete = permissions.find((permission) => permission === "datum:delete_database");

    const { name = "", metadata = {}, updatedAt = "", isFavorite = false, id, description = "" } = dataBase || {};
    const { size = 0, rowsIncrementPercentage = 0, rowsCount = 0 } = metadata;

    const navigate = useNavigate();
    const { t } = useTranslation();

    const MAXIMUM_CHARACTERS_DESCRUI = 99;
    const MAXIMUM_CHARACTERS_NAMEUI = 31;

    const { updateNameDescrDb } = useDataBases();

    const findPercentageCharName = (numPercentge) => {
        setPercentageName((numPercentge * 100) / DATABASE_NAME_MAX_CHARACTERS);
    };
    const findPercentageCharDescr = (numPercentge) => {
        setPercentageDescr((numPercentge * 100) / DATABASE_DESCRIPTION_MAX_CHARACTERS);
    };

    const showModalEditCards = () => {
        setModalEditCards(true);
        setValueName(get(nameDatabase[id], "nombre", "") || name);
        setValueDescr(get(nameDatabase[id], "descr", "") || description);
        setCountName(get(nameDatabase[id], "nombre", "").length || name.length);
        findPercentageCharName(get(nameDatabase[id], "nombre", "").length || name.length);
        setCountDescr(get(nameDatabase[id], "descr", "").length || description.length);
        findPercentageCharDescr(get(nameDatabase[id], "descr", "").length || description.length);
    };

    const handleNameChange = (evt) => {
        setValueName(evt.target.value);
        setCountName(evt.target.value.length);
        findPercentageCharName(evt.target.value.length);
    };
    const handleDescrChange = (evt) => {
        setValueDescr(evt.target.value);
        setCountDescr(evt.target.value.length);
        findPercentageCharDescr(evt.target.value.length);
    };

    const SaveNameDescr = useCallback(
        ({ databaseId = null } = {}) => {
            setLoadingNameDatabase(true);

            updateNameDescrDb({ databaseId, name: valueName, description: valueDescr })
                .then(({ message }) => {
                    renderMessage(message, MESSAGE_TYPES.SUCCESS);

                    setNameDatabase({ [databaseId]: { nombre: valueName, descr: valueDescr } });
                })
                .catch((messageError) => {
                    renderMessage(messageError, MESSAGE_TYPES.ERROR);
                })
                .finally(() => {
                    setLoadingNameDatabase(false);
                    setValueName("");
                });
        },
        [valueName, valueDescr]
    );

    return (
        <>
            <div className="relative h-[18rem]">
                <section
                    className="group relative z-0 flex h-full min-h-card w-full flex-col rounded-xl border-3 border-transparent bg-white p-8 text-left hover:cursor-pointer hover:border-primary-200/15 hover:shadow-data-card"
                    onClick={() => navigate(`/datum/databases/${id}`)}
                >
                    <div className="absolute right-0 top-[40px]">
                        <CubeIcon width="72" height="100" />
                    </div>

                    <div className="absolute bottom-0 left-0">
                        <DataBaseIcon width="68" height="37" />
                    </div>
                    <div className="z-10 flex w-full flex-1 justify-between">
                        <div className="flex w-full flex-col">
                            <div className="flex w-full flex-col">
                                <ConditionalTruncateWithTooltip
                                    text={get(nameDatabase[id], "nombre", "") || name}
                                    maxCharactersAllowed={MAXIMUM_CHARACTERS_NAMEUI}
                                    componentType={"h3"}
                                    placement={"right"}
                                    width={"w-full"}
                                    textStyle={"font-semibold text-gray-400 group-hover:text-primary-200"}
                                />

                                <DatabaseParams databaseRecords={rowsCount} databaseSize={size} databaseLastUpdate={updatedAt} databaseDataIncrease={rowsIncrementPercentage} />

                                <ConditionalTruncateWithTooltip
                                    text={get(nameDatabase[id], "descr", "") || description}
                                    maxCharactersAllowed={MAXIMUM_CHARACTERS_DESCRUI}
                                    componentType={"p"}
                                    placement={"right"}
                                    width={"w-full"}
                                    textStyle={"font-normal text-gray-400 text-xs"}
                                />
                            </div>
                        </div>
                    </div>
                    <Footer />
                </section>
                <div className="absolute top-0 right-0 mr-5 flex flex-row items-center">
                    <span className="text-gray-400 text-opacity-60">
                        <FavoriteDatabase databaseId={id} initialFavorite={isFavorite} placementTippy="right" />
                    </span>
                    <DatabaseCardOptions
                        databaseName={name}
                        databaseId={id}
                        showDeleteOption={databasePermissionDelete}
                        showUpdateOption={databasePermissionUpdate}
                        setShowDeleteModal={setShowDeleteModal}
                        showDeleteModal={showDeleteModal}
                        showModalEditCards={showModalEditCards}
                    />
                </div>
            </div>
            {modalEditCards &&
                <EditDatabase
                    modalEditCards={modalEditCards}
                    setModalEditCards={setModalEditCards}
                    handleNameChange={handleNameChange}
                    valueName={valueName}
                    handleDescrChange={handleDescrChange}
                    valueDescr={valueDescr}
                    SaveNameDescr={SaveNameDescr}
                    id={id}
                    countName={countName}
                    countDescr={countDescr}
                    percentageName={percentageName}
                    percentageDescr={percentageDescr}
                />
            }
        </>
    );
};

export default DatabaseCard;
