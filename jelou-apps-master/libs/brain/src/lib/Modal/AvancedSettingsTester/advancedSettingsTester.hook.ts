import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { updateDatastore } from "@apps/redux/store";
import { toastMessage } from "@apps/shared/common";
import { MESSAGE_TYPES, TOAST_POSITION } from "@apps/shared/constants";
import { updateDatastoreSettings } from "../../services/brainAPI";
import type { Datastore } from "../../Components/Datastores/type.datasource";

type State = {
    datastore: Datastore;
};

export enum PROMPTS_NAMES {
    PROPMPT_CONDESNE = "prompt_condense",
    PROPMPT_GENERATE = "prompt_generate",
}

type ConfigTesterSettings = {
    propmts: {
        prompt_condense?: string;
        prompt_generate?: string;
    };
    datastore: Datastore;
};

type Props = {
    onClose: () => null;
};

export function useAdvancedSettingTester({ onClose }: Props) {
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    const datastore = useSelector<State, State["datastore"]>((state) => state.datastore);
    const dispatch = useDispatch();

    const handleResetPromptSettings = () => {
        const propmts = {
            [PROMPTS_NAMES.PROPMPT_CONDESNE]: undefined,
            [PROMPTS_NAMES.PROPMPT_GENERATE]: undefined,
        };

        configTesterSettings({ datastore, propmts });
    };

    const handleSaveSettings = (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();

        const formData = new FormData(evt.currentTarget);
        const promptCondense = formData.get(PROMPTS_NAMES.PROPMPT_CONDESNE);
        const promptGenerate = formData.get(PROMPTS_NAMES.PROPMPT_GENERATE);

        const propmts = {
            [PROMPTS_NAMES.PROPMPT_CONDESNE]: promptCondense as string,
            [PROMPTS_NAMES.PROPMPT_GENERATE]: promptGenerate as string,
        };

        configTesterSettings({ datastore, propmts });
    };

    function configTesterSettings({ datastore, propmts }: ConfigTesterSettings) {
        setLoading(true);
        const { id: datastoreId, settings } = datastore;
        const { prompt_condense = "", prompt_generate = "" } = propmts;

        const chatSettings = {
            ...settings,
            prompt_condense,
            prompt_generate,
        };

        updateDatastoreSettings({ datastoreId, settings: { settings: chatSettings } })
            .then((data) => {
                const { settings } = data;
                dispatch(updateDatastore({ settings }));
                toastMessage({
                    messagePart1: `${t("common.settingsUpdated")}`,
                    type: MESSAGE_TYPES.SUCCESS,
                    position: TOAST_POSITION.TOP_RIGHT,
                });
            })
            .catch((err) => {
                toastMessage({
                    messagePart1: `${t("common.settingsNotUpdated")}`,
                    type: MESSAGE_TYPES.ERROR,
                    position: TOAST_POSITION.TOP_RIGHT,
                });
            })
            .finally(() => {
                onClose();
                setLoading(false);
            });
    }

    return { handleResetPromptSettings, handleSaveSettings, loading, datastore };
}
