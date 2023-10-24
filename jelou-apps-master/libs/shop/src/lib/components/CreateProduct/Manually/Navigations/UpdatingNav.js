import { useSelector } from "react-redux";

export const UptatingNav = ({ stepsList, navigateWithSteps }) => {
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";

    const handleNavigate = (id) => () => navigateWithSteps(id);

    return (
        <ul className="">
            {stepsList.map((item) => {
                const { isActive, title, id } = item;
                const styles = isActive ? "bg-primary-200/15 text-[#006E7A] border-r-4 border-primary-200" : " text-primary-200";

                return (
                    <li key={id}>
                        <button onClick={handleNavigate(id)} className={`flex h-16 w-full items-center pl-12 ${styles}`}>
                            <p className="text-base font-semibold">
                                {
                                    lang === "es" &&
                                    title.es
                                }
                                {
                                    lang === "en" &&
                                    title.en
                                }
                                {
                                    lang === "pt" &&
                                    title.pt
                                }
                            </p>
                        </button>
                    </li>
                );
            })}
        </ul>
    );
};
