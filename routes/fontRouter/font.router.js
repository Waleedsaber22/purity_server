const {Router} = require("express")
const Font = require("../../controllers/fontContoller/font.controller")
const fontRouter = new Router()

fontRouter.get("/get/:name",Font.get)
fontRouter.get("/download",Font.save)
module.exports = fontRouter