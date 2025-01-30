const { Router } = require("express");
const Audio = require("../../controllers/audioController/audio.controller");
const audioRouter = new Router();

audioRouter.get("/surah/get/:id", Audio.getAudioFile);
audioRouter.get("/surah/:surahID/ayah/get/:id", Audio.getAudioFile);
audioRouter.get("/reciters/get", Audio.getReciters);
audioRouter.get("/surah/timing/get/:id", Audio.getSurahTiming);
audioRouter.get("/surah/:surahID/ayah/timing/get/:id", Audio.getSurahTiming);
module.exports = audioRouter;
