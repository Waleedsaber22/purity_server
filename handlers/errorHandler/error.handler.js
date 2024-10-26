class ErrorHandler {
  static async catchGlobalErrors (_, res, next) {
    try {
      await next()
    } catch (err) {
      res.send(err)
      console.log('Global Error Handler', err)
    }}
}
module.exports=ErrorHandler