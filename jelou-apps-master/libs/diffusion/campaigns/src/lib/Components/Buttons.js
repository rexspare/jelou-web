/* eslint-disable react-hooks/exhaustive-deps */

import { useTranslation } from "react-i18next";
import { Select } from "@apps/shared/common";

const Buttons = (props) => {
    const { button, flows, keys, setArrayButton } = props;
    const { action } = button;
    const { flowId } = button;
    const { t } = useTranslation();

    const handleFlow = (value) => {
        const tmpBtn = {
            ...button,
        };
        tmpBtn.flowId = value.target.value;
        setArrayButton((buttons) => {
            return buttons.map((button, index) => {
                if (index === keys) {
                    return {
                        ...tmpBtn,
                    };
                }
                return button;
            });
        });
    };

    return (
        <div className="border-options relative mb-4 flex max-w-xl items-center rounded-md p-3">
            <div className="mr-1 flex flex-1 flex-col">
                <label
                    htmlFor="name"
                    className="mb-px relative pl-1 text-left text-xs font-medium uppercase tracking-wider text-gray-400 text-opacity-75">
                    {t("Options.name")}
                </label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    readOnly
                    value={action}
                    className="input mt-1 cursor-not-allowed !rounded-input outline-none focus:outline-none"
                    placeholder={t("Options.name")}
                />
            </div>

            <div className="relative ml-1 flex flex-1 flex-col self-start">
                <label
                    htmlFor="flow"
                    className="mb-px relative pl-1 text-left text-xs font-medium uppercase tracking-wider text-gray-400 text-opacity-75">
                    {t("Options.flow")}
                </label>
                <Select
                    name="flow"
                    // options={flows}
                    options={[
                        {
                            id: -1,
                            title: t("FlowPicker.selectFlow"),
                            intent: "",
                            // isDefault: 0,
                            // status: 1,
                            // createdAt: "2022-08-15T21:37:40.000Z",
                            // updatedAt: "2022-08-15T21:37:40.000Z",
                            // providerId: {
                            //    dialogflow: "7b2bca37-71eb-4b3d-8258-8a040dfc2f6a",
                            // },
                            name: t("FlowPicker.selectFlow"),
                        },
                        ...flows,
                    ]}
                    onChange={handleFlow}
                    value={flowId ? flowId : -1} // get(first(flows), "id")
                    placeholder={t("FlowPicker.selectFlow")}
                />
                {/* <ComboboxSelect
                    options={flows}
                    value={flow}
                    label={t("FlowPicker.selectFlow")}
                    handleChange={handleFlow}
                    name={"flow"}
                    background={"#fff"}
                    hasCleanFilter={false}
                    // clearFilter={clearFilterBot}
                /> */}
            </div>
        </div>
    );
};

export default Buttons;
