const { Router } = require("express");
const axios = require("axios");
const Surah = require("../../controllers/surahContoller/surah.controller");
const Pagination = require("../../middlewares/pagination.middleware");
const surahRouter = new Router();
surahRouter.get("/get", Surah.getLearningPlans);
surahRouter.get("/get/:id", Pagination.setPaginationProps, Surah.getByPage);
module.exports = surahRouter;
