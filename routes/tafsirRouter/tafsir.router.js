const { Router } = require("express");
const Tafsir = require("../../controllers/tafsirController/tafsir.controller");
const tafsirRouter = new Router();

tafsirRouter.get("/surah/get/:id", Tafsir.getSurahTafsir);
tafsirRouter.get("/surah/:surahID/ayah/get/:id", Tafsir.getAyahTafsir);
tafsirRouter.get("/get", Tafsir.getTafsirs);
module.exports = tafsirRouter;
