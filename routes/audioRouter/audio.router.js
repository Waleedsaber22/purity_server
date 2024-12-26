const { Router } = require("express");
const Audio = require("../../controllers/audioController/audio.controller");
const audioRouter = new Router();

audioRouter.get("/get/surah/:surah", Audio.getAudioFile);
audioRouter.get("/get/rectiers", Audio.getRectiers);
module.exports = audioRouter;
