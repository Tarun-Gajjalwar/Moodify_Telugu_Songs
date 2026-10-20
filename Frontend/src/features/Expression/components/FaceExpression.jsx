import { useEffect, useRef, useState } from "react";
import { detect, init } from "../utils/utils";
import "./faceExpression.scss";

export default function FaceExpression({ onClick = () => { } }) {
    const videoRef = useRef(null);
    const landmarkerRef = useRef(null);
    const streamRef = useRef(null);

    const [ expression, setExpression ] = useState("Detecting...");

    useEffect(() => {
        init({ landmarkerRef, videoRef, streamRef });

        return () => {
            if (landmarkerRef.current) {
                landmarkerRef.current.close();
            }

            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject
                    .getTracks()
                    .forEach((track) => track.stop());
            }
        };
    }, []);

    async function handleClick() {
        const detected = detect({ landmarkerRef, videoRef, setExpression });
        console.log(detected);
        onClick(detected);
    }

    const moodLower = (expression || "").toLowerCase();
    const getEmoji = (mood) => {
        if (mood === "happy") return "😄";
        if (mood === "sad") return "😢";
        if (mood === "surprised") return "😲";
        if (mood === "neutral") return "😐";
        return "✨";
    };

    return (
        <section className="face-detector">
            <div className="face-detector__header">
                <h1 className="face-detector__title">
                    Mood<span>ify</span> AI
                </h1>
                <p className="face-detector__desc">
                    Show your emotion to the camera and let Moodify match the perfect soundtrack
                </p>
            </div>

            <div className="face-detector__card">
                <div className="face-detector__video-wrap">
                    <video
                        ref={videoRef}
                        playsInline
                        muted
                    />
                </div>

                <div className="face-detector__status-wrap">
                    <div className={`face-detector__badge face-detector__badge--${moodLower}`}>
                        <span>{getEmoji(moodLower)}</span>
                        <span>{expression}</span>
                    </div>

                    {moodLower === "neutral" && (
                        <span className="face-detector__hint">
                            No music for neutral mood. Smile, frown, or show surprise!
                        </span>
                    )}
                </div>

                <button
                    className="face-detector__btn"
                    onClick={handleClick}
                    type="button"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="18" height="18">
                        <circle cx="12" cy="12" r="10"/>
                        <circle cx="12" cy="12" r="3"/>
                    </svg>
                    <span>Detect Mood</span>
                </button>
            </div>
        </section>
    );
}