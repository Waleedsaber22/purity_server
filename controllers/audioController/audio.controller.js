const axios = require("axios");
const fs = require("fs");
const path = require("path");
const Global = require("../../handlers/globalHandler/global.handler");
const File = require("../../handlers/fileHandler/file.handler");
const GlobalApi = require("../globalApiContoller/global-api.controller");
let streams = {};
class Audio extends GlobalApi {
  static async getAudioFile(req, res) {
    const { surah } = req.params || {};
    const { reciter } = req.query || {};
    const filePath = path.join(
      __dirname,
      "..",
      "..",
      "data",
      "audios",
      `${surah}.mp3`
    );
    const range = req.headers.range;
    try {
      fs.statSync(filePath);
      return res.sendFile(filePath);
    } catch (err) {
      console.log(err);
    }
    const audioDataUrl = `${process.env.QURAN_API}/audio/reciters/${
      reciter || 4
    }/audio_files?chapter=${surah}&segments=true`;
    const audioData = (await axios.get(audioDataUrl)).data;
    const audioFile = audioData.audio_files[0];
    const audioUrl = audioFile.audio_url;
    const response = await axios.get(audioUrl, {
      headers: { Range: range },
      responseType: "stream",
    });
    // if(!streams[])
    // streams[file]=response.data
    // Set response headers to match the external audio file
    res.setHeader("Content-Type", response.headers["content-type"]);
    res.setHeader("Content-Length", response.headers["content-length"]);
    if (range) {
      res.status(206);
      res.setHeader("Content-Range", response.headers["content-range"]);
    }
    res.status(206); // Partial content for range requests
    // Pipe the response stream directly to the client
    response.data.pipe(res);
  }
}

module.exports = Audio;
