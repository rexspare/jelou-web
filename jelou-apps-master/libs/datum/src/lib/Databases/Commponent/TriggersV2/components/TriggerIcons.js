import { 
    AddRowIcon, 
    WebhookIcon, 
    UpdateRowIcon, 
    DeleteRowIcon,
    NextTriggerIcon,
    CreateDatabaseIcon,
    UpdateDatabaseIcon,
    DeleteDatabaseIcon,
} from "@apps/shared/icons";
import Tippy from "@tippyjs/react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const TriggerIcons = ({subscriptions}) => {

    const { t } = useTranslation();
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";

    return (
        <div className="flex gap-2 mt-3 items-center">
            {
                subscriptions.map((sub) => {
                    if (sub.name === "Row update") {
                        return <Tippy content={sub.displayNames[lang]} touch={false}>
                            <div className="cursor-pointer border-transparent focus:outline-none">
                                <UpdateRowIcon key={sub.id}/>
                            </div>
                        </Tippy>
                    }
                    if (sub.name === "Row delete") {
                        return <Tippy content={sub.displayNames[lang]} touch={false}>
                            <div className="cursor-pointer border-transparent focus:outline-none">
                                <DeleteRowIcon key={sub.id}/>
                            </div>
                        </Tippy>
                    }
                    if (sub.name === "Row create") {
                        return <Tippy content={sub.displayNames[lang]} touch={false}>
                            <div className="cursor-pointer border-transparent focus:outline-none">
                                <AddRowIcon key={sub.id}/>
                            </div>
                        </Tippy>
                    }
                    if (sub.name === "Database create") {
                        return <Tippy content={sub.displayNames[lang]} touch={false}>
                            <div className="cursor-pointer border-transparent focus:outline-none">
                                <CreateDatabaseIcon key={sub.id}/>
                            </div>  
                        </Tippy>
                    }
                    if (sub.name === "Database update") {
                        return <Tippy content={sub.displayNames[lang]} touch={false}>
                            <div className="cursor-pointer border-transparent focus:outline-none">
                                <UpdateDatabaseIcon key={sub.id}/>
                            </div>  
                        </Tippy>
                    }
                    if (sub.name === "Database delete") {
                        return <Tippy content={sub.displayNames[lang]} touch={false}>
                            <div className="cursor-pointer border-transparent focus:outline-none">
                                <DeleteDatabaseIcon key={sub.id}/>  
                            </div>  
                        </Tippy>    
                    }
                })
            }
            <div className='px-2'>
                <NextTriggerIcon/>
            </div>
            <Tippy content={t("datum.triggers.card.text.call") + " URL"} touch={false}>
                <div className="cursor-pointer border-transparent focus:outline-none">
                    <WebhookIcon width="2rem" height="2rem"/>
                </div>  
            </Tippy>    
        </div>
    )
}

export default TriggerIcons