import { createContext, useState } from "react";

export const SongContext = createContext()

export const SongContextProvider = ({ children }) => {

    const [ song, setSong ] = useState(null);
    const [ loading, setLoading ] = useState(false);

    const clearSong = () => {
        setSong(null);
    };

    return (
        <SongContext.Provider
            value={{
                loading,
                setLoading,
                song,
                setSong,
                clearSong
            }}
        >
            {children}
        </SongContext.Provider>
    );
};