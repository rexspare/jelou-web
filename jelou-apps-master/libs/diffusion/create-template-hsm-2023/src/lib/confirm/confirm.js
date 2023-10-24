export function Confirm(props) {
    const { t } = props;
    return (
        <div className="px-12 pt-12 pb-4">
            <h1 className="pb-5 text-xl font-bold  text-gray-400 ">{t("hsm.createTemplateModal.stepsTitle.five")}</h1>
            <p className="pb-4">{t("hsm.createTemplateModal.confirContent1")}</p>
            <p>{t("hsm.createTemplateModal.confirContent2")}</p>
        </div>
    );
}
export default Confirm;
