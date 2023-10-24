import { useParams } from "react-router";

const SectionWrapper = (props) => {
    const params = useParams();
    return (
        <div className={`max-w-main-content bg-app-body min-h-screen w-full flex-1 ${props.className ? props.className : params["*"]?.includes("previewscreen") ? "min-w-full" : "ml-16 md:ml-20"}`}>
            {props.children}
        </div>
    );
};

export default SectionWrapper;
