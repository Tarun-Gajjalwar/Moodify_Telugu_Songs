import { getSong } from "../service/song.api";
import { useContext } from "react";
import { SongContext } from "../song.context";


export const useSong = () => {
    const context = useContext(SongContext);
    const { loading, setLoading, song, setSong, clearSong } = context;

    async function handleGetSong({ mood }) {
        if (!mood || mood.toLowerCase() === "neutral") {
            clearSong();
            return;
        }

        setLoading(true);
        try {
            const data = await getSong({ mood });
            if (data?.song) {
                setSong(data.song);
            } else {
                clearSong();
            }
            return data;
        } catch (err) {
            console.error("Failed to get song for mood:", mood, err);
        } finally {
            setLoading(false);
        }
    }

    return {
        loading,
        song,
        clearSong,
        handleGetSong
    };
}
