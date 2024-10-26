const axios  = require("axios");
const fs=require("fs")
const path=require("path")
class Font {
    static async get(req,res){
        const name=req.params.name
        const response = await axios.get(`https://quran.com/fonts/quran/hafs/v1/woff2/${name}`,{
            responseType:"stream"
        })
          // Set the correct content type for .woff2
        res.writeHead(200, {
                 'Content-Type': 'font/woff2' ,
            'Content-Disposition': `attachment; filename="${name}"`,
        });
        // Pipe the font stream to the response
        response.data.pipe(res);
    }
    static async save(req,res){
        for (let i =1 ; i < 700;i++){
            try{
                const response = await axios.get(`https://quran.com/fonts/quran/hafs/v1/woff2/p${i}.woff2`,{responseType:"stream"})
                const dirName = path.join(__dirname,"fonts",`p${i}.woff2`)
                const writer = fs.createWriteStream(dirName);

                // Pipe the response data (the font file) to the file system
                response.data.pipe(writer);

                // Return a Promise that resolves when the file is fully written
                await new Promise((resolve, reject) => {
                writer.on('finish', ()=>
                    {
                        resolve()
                        console.log("finished" + " p" + i)
                    });
                writer.on('error', reject);
                })
            }catch(err){
                console.log(i,err)
                return res.send("done")
            }
          // Set the correct content type for .woff2
        }
        // Pipe the font stream to the response
        res.send("done")
    }
}

module.exports=Font