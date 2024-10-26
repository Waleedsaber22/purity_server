const fs = require("fs")
const path = require("path")
class FileHandler {
    static baseDir=path.join(__dirname,"..","..")
    static writeToFile(data,filePath=["public"]){
        fs.writeFileSync(path.join(this.baseDir,...filePath),JSON.stringify(data))
    }
    static readFromFile(filePath=["public"]){
        JSON.parse(fs.readFileSync(path.join(this.baseDir,...filePath)))
    }
}
module.exports=FileHandler