class ErrorHandler {
  static async catchRoutesErrors(err, req, res, next) {
    console.error(err.message, "error");
    res.status(500).json({ error: err.message });
  }
}
module.exports = ErrorHandler;
