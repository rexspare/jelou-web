import { useState } from "react";
import ReactDOM from "react-dom";

import { WSProcessCompletion } from "./Components/WSProcessCompletion";
import ChooseChannel from "./Components/ChooseChannel";
import CreateBot from "./Components/CreateBot";

const Modal = (props) => {
    const { setOpen, loadBots, hasBot, setOpenGuide } = props;
    const [showTab1, setShowTab1] = useState(true);
    const [showTab2, setShowTab2] = useState(false);
    const [showFinishLogin, setShowFinishLogin] = useState(false);

    return ReactDOM.createPortal(
        <div className="fixed inset-x-0 top-0 z-50 overflow-auto sm:inset-0 sm:flex sm:items-center sm:justify-center">
            {showTab1 && <CreateBot setOpen={setOpen} setShowTab1={setShowTab1} setShowTab2={setShowTab2} hasBot={hasBot} />}
            {showTab2 && (
                <ChooseChannel
                    setShowFinishLogin={setShowFinishLogin}
                    setShowTab1={setShowTab1}
                    setShowTab2={setShowTab2}
                    setOpen={setOpen}
                    loadBots={loadBots}
                    setOpenGuide={setOpenGuide}
                />
            )}
            {showFinishLogin && <WSProcessCompletion setShowFinishLogin={setShowFinishLogin} />}
        </div>,
        document.getElementById("root")
    );
};

export default Modal;
