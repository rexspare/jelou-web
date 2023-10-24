import { useTranslation } from "react-i18next";

import { InputSelector, SwitchInput, TextInput } from "@apps/shared/common";
import { LoadingSpinner, RefreshIcon, UpIconLarge } from "@apps/shared/icons";
import { NAME_MAX_LENGTH, NAME_MIN_LENGTH } from "../../../../constants";
import Channels from "libs/brain/src/lib/Modal/flowComponent/channels";
import RowsSkeleton from "libs/brain/src/lib/Common/rowsSkeleton";
import { useChannels } from "libs/brain/src/lib/services/brainAPI";
import { get, isEmpty } from "lodash";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function MenuHomeOptionsWidget(props) {
    const { homeMenu = {}, setSelectedWidget, setChannelSelected, channelSelected, loadingFlow, refetchingFlow, refetchFlow, flowOptions } = props;
    const { showHomeMenuOnEmptyRoom = false, showHomeMenuOnEmptyMessages = false, homeMenuTitle = "", options = [] } = homeMenu;
    const [opSelected, setOpSelected] = useState(0);
    const datastore = useSelector((state) => state.datastore);

    const {
        data: channelsData,
        isFetching,
        isLoading,
        refetch: refetchChannels,
    } = useChannels({
        datastoreId: datastore?.id,
    });
    useEffect(() => {
        if (!isEmpty(datastore)) {
            refetchChannels();
        }
    }, [datastore]);

    const { t } = useTranslation();
    const jwt = localStorage.getItem("jwt-master") ?? localStorage.getItem("jwt");

    const handleObjectChange = (evt, index) => {
        const { name, value } = evt.target;
        switch (name) {
            case "homeMenuTitle":
                setSelectedWidget((prev) => ({
                    ...prev,
                    homeMenu: { ...prev.homeMenu, [name]: value },
                }));
                break;
            case "option.title": {
                const newOptions = [...options];
                newOptions[index] = { ...newOptions[index], title: value };
                setSelectedWidget((prev) => ({
                    ...prev,
                    homeMenu: { ...prev.homeMenu, options: newOptions },
                }));
                break;
            }
            default:
                break;
        }
    };

    const handleSelectFromWidget = (value, index) => {
        const newOptions = [...options];
        newOptions[index] = { ...newOptions[index], payload: { ...newOptions[index].payload, flowId: parseInt(value) || null } };
        setSelectedWidget((prev) => ({
            ...prev,
            homeMenu: { ...prev.homeMenu, options: newOptions },
        }));
    };

    useEffect(()=>{setOpSelected(options.length - 1);},[options]);

    const getFlowReferent = (i) => {
      let metadata = {
        metadata: {
          flows:{}
        }
      }
      const flowID = options[i].payload.flowId;
      Object.keys(channelSelected.metadata.flows || {})
            .forEach(val => {
              if(channelSelected.metadata.flows[val] === flowID){
                  metadata.metadata = {
                    flows:{
                      [val]: channelSelected.metadata.flows[val],
                    }
                  }
               }
            })
      return metadata
    }

    const addOption = () => {
        setSelectedWidget((prev) => ({
            ...prev,
            homeMenu: {
                ...prev.homeMenu,
                options: [
                    ...prev.homeMenu.options,
                    {
                        emoji: "",
                        title: "",
                        payload: {
                            type: "flow",
                            flowId: "",
                        },
                    },
                ],
            },
        }));
    };

    return (
        <div className="flex h-[75vh] flex-1 flex-col space-y-5 overflow-y-auto border-l-1 border-gray-34 p-5">
            <div className="flex flex-col space-y-2">
                <span className="font-bold leading-6 text-gray-610">{t("brain.Opciones del menu en home")}</span>
                <span className="text-sm leading-5 text-gray-400">{t("brain.Configura el aspecto de las opciones del menu que estarán visibles en el home del chat")}</span>
            </div>
            <div className="flex flex-col space-y-2">
                <span className="text-sm font-semibold text-gray-610">{t("brain.Message")}</span>
                <div className="grid grid-cols-2 gap-4">
                    <div className="w-full text-sm">
                        <TextInput
                            label={t("pma.title")}
                            placeholder={"Jelou"}
                            defaultValue={homeMenuTitle}
                            name={"homeMenuTitle"}
                            className="w-full text-gray-610"
                            onChange={handleObjectChange}
                            maxLength={NAME_MAX_LENGTH}
                            minLength={NAME_MIN_LENGTH}
                            length={homeMenuTitle?.length}
                        />
                    </div>
                    <div className="flex flex-col justify-center space-y-2">
                        <SwitchInput
                            label={t("brain.Mostrar menu con conversacion vacia")}
                            name="fontType"
                            labelClassName="block text-sm text-gray-400"
                            containerClassName="flex justify-between"
                            defaultChecked={showHomeMenuOnEmptyRoom}
                            onChange={(checked) => {
                                setSelectedWidget((prev) => ({
                                    ...prev,
                                    homeMenu: { ...prev.homeMenu, showHomeMenuOnEmptyRoom: checked },
                                }));
                            }}
                        />
                        <SwitchInput
                            label={t("brain.Mostrar menu si no hay mensajes")}
                            name="fontType"
                            labelClassName="block text-sm text-gray-400"
                            containerClassName="flex justify-between"
                            defaultChecked={showHomeMenuOnEmptyMessages}
                            onChange={(checked) => {
                                setSelectedWidget((prev) => ({
                                    ...prev,
                                    homeMenu: { ...prev.homeMenu, showHomeMenuOnEmptyMessages: checked },
                                }));
                            }}
                        />
                    </div>

                    <span className="text-sm font-semibold text-gray-610">{t("datum.options")}</span>
                    <div className="col-span-2 flex flex-col gap-2">
                        {options.map((option, index) => {
                            return (
                                <div key={index} className="flex w-full flex-row border-b-1 border-gray-34 pb-3">
                                    <div className="flex flex-col gap-y-2 w-1/2 pr-2">
                                        <TextInput
                                            placeholder={"Opcion " +  (index + 1)}
                                            defaultValue={option.title}
                                            name={"option.title"}
                                            className="w-full text-gray-610"
                                            autofocus={index === (options.length - 1)}
                                            onChange={(evt) => handleObjectChange(evt, index)}
                                            onFocus={()=>{setOpSelected(index)}}
                                            maxLength={NAME_MAX_LENGTH}
                                            minLength={NAME_MIN_LENGTH}
                                            length={option.title?.length}
                                        />
                                        {index === (options.length - 1) &&
                                        <button onClick={addOption} className={`text-left font-medium text-primary-200`}>
                                            <span className="text-xl">+</span> {t("brain.agregar opcion")}
                                        </button>}
                                    </div>
                                    {isFetching || isLoading ?
                                        <div className="flex h-[20rem] flex-col gap-y-3 xl:h-[15rem]">
                                            <RowsSkeleton />
                                        </div>
                                    :
                                        opSelected === index &&
                                            <div className="flex w-1/2 pl-2 flex-col">
                                                <Channels
                                                    viewSearch={false}
                                                    fetchedChannels={get(channelsData, "data", [])}
                                                    setDatasourceValues={setChannelSelected}
                                                    handleSelectFromWidget={(value)=>{handleSelectFromWidget(value,index)}}
                                                    datasourceValues={getFlowReferent(index)}
                                                    datastoreName={datastore.name}
                                                />
                                            </div>
                                    }
                                </div>
                            );
                        })}
                        {!(options.length) &&
                            <button onClick={addOption} className={`text-left text-sm font-medium text-primary-200`}>
                                + {t("brain.agregar opcion")}
                            </button>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
