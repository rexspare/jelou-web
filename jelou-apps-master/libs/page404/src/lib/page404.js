import { Link, useLocation } from "react-router-dom";
import get from "lodash/get";

export function Page404(props) {
    const location = useLocation();
    const pathname = get(location, "pathname", "");
    return (
        <div className="flex h-screen w-screen bg-white">
            <div className=" flex w-2/4 flex-col justify-center rounded-default lg:items-end xl:items-center ">
                <div className=" lg:w-78 xl:w-112 ">
                    <h1 className=" text-6xl font-bold leading-[4rem]  text-primary-200">Error</h1>
                    <h2 className="font-bold text-primary-200 lg:text-[10rem] lg:leading-[10rem]  xl:text-[14rem] xl:leading-[14rem]">404</h2>
                    <p className="font-bold text-primary-200 lg:text-3xl lg:leading-[1.875rem] xl:text-4xl xl:leading-[2.25rem]">
                        ¡Oops ! Creemos que estás un poco perdido
                    </p>
                    <p className="py-2 text-lg font-semibold text-gray-400">
                        {` La página ${pathname} no fue encontrada, esto es todo lo que sabemos`}
                    </p>
                    <Link to="/home">
                        <button className="rounded-[3rem] bg-primary-200 p-4 font-semibold text-white">Regresar al Home</button>
                    </Link>
                </div>
            </div>
            <div className="flex w-2/3  items-end justify-center">
                <img width="90%" src="assets/illustrations/image404.svg" alt="404" />
            </div>
        </div>
    );
}
export default Page404;
