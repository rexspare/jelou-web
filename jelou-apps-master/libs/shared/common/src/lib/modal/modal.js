import ReactDOM from "react-dom";

const Modal = (props) => {
    const { children } = props;

    return ReactDOM.createPortal(children, document.getElementById("root"));
};

export default Modal;
