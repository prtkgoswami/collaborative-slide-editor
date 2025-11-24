import { createContext, useContext, useState, type ReactNode } from "react";

type ConnectionContextType = {
    userName: string;
    setUserName: (name: string) => void;
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export const ConnectionProvider = ({children}:{children: ReactNode}) => {
    const [userName, setUserName] = useState("");

    return(
        <ConnectionContext.Provider value={{userName, setUserName}}>
            {children}
        </ConnectionContext.Provider>
    )
}

export const useConnection = () => {
    const ctx = useContext(ConnectionContext);
    if(!ctx) {
        throw new Error("useConnection must be used inside COnnectionProvider");
    }

    return ctx;
}