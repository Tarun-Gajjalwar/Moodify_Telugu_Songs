const songModel = require("../models/song.model");
const storageService = require("../services/storage.service");
const id3 = require("node-id3");

// Default poster covers if MP3 does not have embedded album art
const DEFAULT_POSTERS = {
    happy: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
    sad: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&auto=format&fit=crop&q=80",
    surprised: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80"
};
const FALLBACK_POSTER = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80";

async function uploadSong(req, res) {
    try {
        const songFile = (req.files && req.files["song"] && req.files["song"][0]) || req.file;
        const posterFileReq = (req.files && req.files["poster"] && req.files["poster"][0]);

        if (!songFile) {
            return res.status(400).json({
                message: "No song file uploaded. Please attach an MP3 file with field name 'song'."
            });
        }

        const songBuffer = songFile.buffer;
        const { mood } = req.body;

        const validMoods = ["sad", "happy", "surprised"];
        let selectedMood = (mood || "").toLowerCase().trim();
        if (!validMoods.includes(selectedMood)) {
            selectedMood = "happy";
        }

        // Safely parse ID3 tags
        let tags = {};
        try {
            tags = id3.read(songBuffer) || {};
        } catch (e) {
            tags = {};
        }

        // Determine title
        const songTitle = (
            req.body.title ||
            tags.title ||
            (songFile.originalname ? songFile.originalname.replace(/\.[^/.]+$/, "") : "") ||
            "Untitled Song"
        ).trim();

        const safeFilename = songTitle.replace(/[^a-zA-Z0-9_\-\s]/g, "").trim().replace(/\s+/g, "_") || ("song_" + Date.now());

        // 1. Upload Song File
        const songUpload = await storageService.uploadFile({
            buffer: songBuffer,
            filename: safeFilename + ".mp3",
            folder: "/cohort-2/moodify/songs"
        });

        // 2. Determine and Upload Poster
        let posterUrl = "";
        if (posterFileReq && posterFileReq.buffer) {
            const uploadedPoster = await storageService.uploadFile({
                buffer: posterFileReq.buffer,
                filename: safeFilename + "_poster.jpeg",
                folder: "/cohort-2/moodify/posters"
            });
            posterUrl = uploadedPoster.url;
        } else if (tags.image && tags.image.imageBuffer) {
            const uploadedPoster = await storageService.uploadFile({
                buffer: tags.image.imageBuffer,
                filename: safeFilename + "_poster.jpeg",
                folder: "/cohort-2/moodify/posters"
            });
            posterUrl = uploadedPoster.url;
        } else if (req.body.posterUrl) {
            posterUrl = req.body.posterUrl;
        } else {
            posterUrl = DEFAULT_POSTERS[selectedMood] || FALLBACK_POSTER;
        }

        // 3. Save Song in Database
        const song = await songModel.create({
            title: songTitle,
            url: songUpload.url,
            posterUrl: posterUrl,
            mood: selectedMood
        });

        return res.status(201).json({
            message: "song created successfully",
            song
        });
    } catch (err) {
        console.error("Error in uploadSong:", err);
        return res.status(500).json({
            message: err.message || "Failed to upload song"
        });
    }
}

async function getSong(req, res) {
    try {
        const { mood } = req.query;

        if (!mood) {
            return res.status(400).json({
                message: "Mood query parameter is required"
            });
        }

        const normalizedMood = mood.toLowerCase().trim();

        if (normalizedMood === "neutral") {
            return res.status(200).json({
                message: "No song for neutral mood",
                song: null
            });
        }

        // Find the single song for the mood
        const song = await songModel.findOne({ mood: normalizedMood });

        if (!song) {
            return res.status(404).json({
                message: `No song found for mood '${mood}'`
            });
        }

        return res.status(200).json({
            message: "song fetched successfully.",
            song
        });
    } catch (err) {
        console.error("Error in getSong:", err);
        return res.status(500).json({
            message: err.message || "Failed to fetch song"
        });
    }
}

module.exports = { uploadSong, getSong };