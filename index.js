process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
});

require("dotenv").config()
const express = require("express")
const cors = require("cors")
const {initRoutes} = require("./routes")

const app = express()
const sequelize=require("./db")
const ErrorHandler = require("./handlers/errorHandler/error.handler")
app.use(cors(
    {
        origin: true,
        credentials: true
    }
)).use(ErrorHandler.catchGlobalErrors)
app.set("port", process.env.PORT || 5000);

app.listen(app.get("port"), async ()=>{
    try {
        await sequelize.db.connect()
        console.log(`server is running at port ${app.get("port")}`)
    } catch (err){
        console.log(err)
    }
})

// setup all routes
initRoutes(app)