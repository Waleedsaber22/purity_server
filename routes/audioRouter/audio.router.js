const { Router } = require("express");
const Audio = require("../../controllers/audioController/audio.controller");
const audioRouter = new Router();

audioRouter.get("/get/:surah", Audio.getAudioFile);
module.exports = audioRouter;
