import Lottie from "react-lottie";
import "./styles/activate.css";
import { ConfigEcommerce } from "../../components/configEcommerce";
import { useConfigEcommerce } from "../../hooks/configEcommerce";

export function ActivateShop() {
    const {
        defaultOptions,
        // emptyValue,
        handleActivateShop,
        // handleChangeInputText,
        handleErrorImg,
        handleInputImageChange,
        imagesLogo,
        InputImageLogo,
        loading,
        // nameCompany,
        onClose,
        setImagesLogo,
        setShowActivateModal,
        showActivateModal,
    } = useConfigEcommerce();

    if (loading) {
        return (
            <main className="grid w-full h-screen place-content-center">
                <div>
                    <Lottie options={defaultOptions} width={400} height={260} />
                    <p className="text-3xl font-normal text-center text-gray-400">
                        Activando <span className="font-bold text-primary-200">Jelou ® Shop </span>
                    </p>
                </div>
            </main>
        );
    }

    return (
        <div className="flex items-center w-screen h-screen activateBG">
            <section className="ml-28">
                <h1 className="mb-4 text-2xl font-normal text-gray-400 text-opacity-75">
                    Con
                    <span className="font-bold text-opacity-100 text-primary-200"> Jelou ® Shop </span>
                    podrás ver todos
                    <br />
                    tus pedidos, productos y órdenes
                    <br />
                    en un solo lugar.
                </h1>
                <button onClick={() => setShowActivateModal(true)} className="button-gradient">
                    Activar
                </button>
            </section>

            <ConfigEcommerce
                // onChangeText={handleChangeInputText}
                // emptyValue={emptyValue}
                handleErrorImg={handleErrorImg}
                handleInputImageChange={handleInputImageChange}
                handleSubmit={handleActivateShop}
                imagesLogo={imagesLogo}
                InputImageLogo={InputImageLogo}
                // nameCompany={nameCompany}
                onClose={onClose}
                setImagesLogo={setImagesLogo}
                showActivateModal={showActivateModal}
                title="Configura tu e-commerce"
            />
        </div>
    );
}
