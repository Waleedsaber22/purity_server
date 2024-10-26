class GlobalHandler {
    static async resolvedPromise(...values){
        for (let i = 0; i < values.length ; i++){
            try{
                const res= await values[i]()
                return res
            }catch(err){
                console.log(err)
            }
        }
    }
}
module.exports=GlobalHandler