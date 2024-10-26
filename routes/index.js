const fs = require("fs")
const path = require("path")
const _ = require("lodash")
const initRoutes=(app)=>{
    const allRoutes=fs.readdirSync(path.join(__dirname, "..",'routes'))
    allRoutes.forEach((dirname)=>{
        if(dirname.includes("Router")){
            const routerName = _.snakeCase(dirname.slice(0,-6))
            const filename=`${routerName}.router.js`
            const targetRouter = require(path.join(__dirname,dirname,filename))
            app.use(`/${routerName.replaceAll("-","/")}`,targetRouter)
        }   
    })
}

module.exports = {initRoutes}