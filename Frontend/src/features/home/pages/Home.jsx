import React from 'react'
import Navbar from '../../shared/components/Navbar'
import FaceExpression from '../../Expression/components/FaceExpression'
import Player from '../components/Player'
import { useSong } from '../hooks/useSong'

const Home = () => {

    const { handleGetSong } = useSong()

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Navbar />
            <main style={{ flex: 1 }}>
                <FaceExpression
                    onClick={(expression) => { handleGetSong({ mood: expression }) }}
                />
            </main>
            <Player />
        </div>
    )
}

export default Home