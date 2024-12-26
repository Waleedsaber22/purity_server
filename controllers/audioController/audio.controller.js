const axios = require("axios");
const fs = require("fs");
const path = require("path");
const Global = require("../../handlers/globalHandler/global.handler");
const File = require("../../handlers/fileHandler/file.handler");
const GlobalApi = require("../globalApiContoller/global-api.controller");
const ArDataMap = require("../../lang/ar");
let streams = {};
class Audio extends GlobalApi {
  static async getAudioFile(req, res) {
    const { surah } = req.params || {};
    const { reciter = "4" } = req.query || {};
    const filePath = path.join(
      __dirname,
      "..",
      "..",
      "data",
      "audios",
      reciter,
      `${surah}.mp3`
    );
    const range = req.headers.range;
    try {
      fs.statSync(filePath);
      return res.sendFile(filePath);
    } catch (err) {
      console.error(err);
    }
    const audioDataUrl = `${process.env.QURAN_API}/audio/reciters/${reciter}/audio_files?chapter=${surah}&segments=true`;
    const audioData = (await axios.get(audioDataUrl)).data;
    const audioFile = audioData.audio_files[0];
    const audioUrl = audioFile.audio_url;
    const response = await axios.get(audioUrl, {
      headers: { Range: range },
      responseType: "stream",
    });
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

  static async getRectiers(req, res) {
    const { lang } = req?.query || {};
    const recitersUrl = `${process.env.QURAN_API}/audio/reciters?locale=${lang}`;
    const response = await axios.get(recitersUrl);
    res.send(
      response.data.reciters?.map((rectier) => {
        const rectierStyle = rectier.style.name;
        return {
          id: rectier?.id,
          name: rectier?.name + ` (${rectierStyle})`,
          [`${lang}_name`]:
            `(${ArDataMap[rectierStyle] || "--"}) ` +
            rectier?.translated_name?.name,
        };
      })
    );
  }
}

module.exports = Audio;
