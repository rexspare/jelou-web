import React from "react";

const ClientStateContext = React.createContext();

function ClientStateProvider(props) {
    const [chooseChat, setChooseChat] = React.useState(false);
    const [objChooseChat, setObjChooseChat] = React.useState({});

    const ClearStateChooseChat = () => {
        setChooseChat(false);
        setObjChooseChat({});
    };

    return (
        <ClientStateContext.Provider
            value={{
                setChooseChat,
                setObjChooseChat,
                chooseChat,
                objChooseChat,
                ClearStateChooseChat,
            }}>
            {props.children}
        </ClientStateContext.Provider>
    );
}

export { ClientStateContext, ClientStateProvider };
