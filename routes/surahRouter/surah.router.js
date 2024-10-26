const { Router } = require("express");
const axios = require("axios");
const Surah = require("../../controllers/surahContoller/surah.controller");
const surahRouter = new Router();

surahRouter.get("/get", Surah.getLearningPlans);
surahRouter.get("/get/:id", Surah.getByPage);
module.exports = surahRouter;
