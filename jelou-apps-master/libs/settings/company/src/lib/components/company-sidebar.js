import { BeatLoader } from "react-spinners";
import { Tab } from "@headlessui/react";
import { useTranslation } from "react-i18next";

export function CompanySidebar(props) {
    const { company, loadingCompany } = props;
    const DEFAULT_LOGO = "https://s3-us-west-2.amazonaws.com/cdn.devlabs.tech/bsp-images/icono_bot.svg";
    const { t } = useTranslation();

    return (
        <div className="mr-3 w-74 rounded-1 bg-white xl:w-[19rem]">
            <div className="relative flex flex-1 items-center rounded-t-1 border-b-0.5 border-gray-5 bg-white p-5"></div>
            {loadingCompany ? (
                <div className="flex h-full items-center justify-center">
                    <div className={"-translate-y-20 transform"}>
                        <BeatLoader color={"#00B3C7"} size={"0.625rem"} />
                    </div>
                </div>
            ) : (
                <Tab.Group as="div" className="h-[72vh] overflow-auto">
                    <Tab.List>
                        <Tab key={0} className="w-full">
                            {({ selected }) => (
                                <div
                                    className={`border-y-grey-25 flex w-full items-center border-b-0.5 px-5 py-3 ${
                                        selected ? "border-r-5 border-x-primary-200 bg-teal-5" : null
                                    }`}>
                                    <img
                                        className="mr-4 h-full w-12 rounded-full object-contain"
                                        src={company.imageUrl ? company.imageUrl : DEFAULT_LOGO}
                                        alt="Logo_image"
                                    />
                                    <div>
                                        <p className="text-left text-base font-bold text-gray-400">{company.name}</p>
                                    </div>
                                </div>
                            )}
                        </Tab>
                    </Tab.List>
                </Tab.Group>
            )}
        </div>
    );
}
export default CompanySidebar;
