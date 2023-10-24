import React, { Fragment } from "react";
import { Tab } from "@headlessui/react";

const VerticalTab = (props) => {
    const { tabOptions, selectedWidgetTab, setOptionSelected, background = "bg-primary-200", shadow = "shadow", width = "w-40", opacity = true } = props;

    return (
        <Tab.Group vertical>
            <Tab.List className="m-5 flex flex-col space-y-2 rounded-xl p-1">
                {tabOptions.map((category) => (
                    <Tab as={Fragment} key={category.id}>
                        {({ selected }) => (
                            <button
                                onClick={() => setOptionSelected(category)}
                                className={`${width} rounded-lg p-2.5 text-left text-sm leading-5 ring-opacity-60 focus:outline-none ${
                                    selectedWidgetTab.id === category.id
                                        ? `${background} ${opacity && "bg-opacity-15"} font-semibold text-primary-200 ${shadow}`
                                        : "text-gray-400 hover:bg-primary-200 hover:bg-opacity-15 hover:text-primary-200"
                                }`}>
                                {category.name}
                            </button>
                        )}
                    </Tab>
                ))}
            </Tab.List>
        </Tab.Group>
    );
};

export default VerticalTab;
