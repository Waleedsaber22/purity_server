const axios = require("axios");
const fs = require("fs");
const path = require("path");
const File = require("../../lib/handlers/fileHandler/file.handler");
const GlobalController = require("../globalContoller/global.controller");
const ArDataMap = require("../../lang/ar");
let streams = {};
class Audio extends GlobalController {
  static async getSurahTiming(req, res) {
    const { surahID, id } = req.params || {};
    const { reciter = "1" } = req.query || {};
    const audioDataUrl =
      // surahID
      //   ? `${process.env.QURAN_API_V4}/recitations/${reciter}/by_ayah/${surahID}:${id}?fields=segments`
      //   :
      `${process.env.QURAN_API}/audio/reciters/${reciter}/audio_files?chapter=${id}&segments=true`;
    const audioData = (await axios.get(audioDataUrl)).data;

    const audioFile = audioData.audio_files[0];
    let verseTimings = audioFile.verse_timings;
    if (surahID) {
      const verseKey = `${surahID}:${id}`;
      verseTimings = verseTimings.filter(
        (verse) => verse?.verse_key === verseKey
      );
    }
    return res.send(verseTimings);
  }
  static async getAudioFile(req, res) {
    const { surahID, id } = req.params || {};
    const { reciter = "1" } = req.query || {};
    const range = req.headers.range;
    if (!reciter || isNaN(Number(reciter))) {
      res.status(400);
      return res.send("not_found");
    }
    const audioDataUrl = surahID
      ? `${process.env.QURAN_API_V4}/recitations/${reciter}/by_ayah/${surahID}:${id}`
      : `${process.env.QURAN_API}/audio/reciters/${reciter}/audio_files?chapter=${id}`;
    const audioData = (await axios.get(audioDataUrl)).data;
    const audioFile = audioData.audio_files[0];
    const audioUrl = surahID
      ? audioFile.url.match(/^\/\/|http/)
        ? (audioFile.url.startsWith("//") ? "https:" : "") + audioFile.url
        : `${process.env.QURAN_AUDIO_API}/${audioFile.url}`
      : audioFile.audio_url;
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

  static async getReciters(req, res) {
    const { lang = "ar" } = req?.query || {};
    const recitersUrl = `${process.env.QURAN_API}/audio/reciters?locale=${lang}`;
    const response = await axios.get(recitersUrl);
    res.send(
      response.data.reciters?.map((reciter) => {
        const reciterStyle = reciter.style.name;
        return {
          id: reciter?.id,
          name: reciter?.name + ` (${reciterStyle})`,
          ...Audio.getTranslatedName(
            () =>
              `(${ArDataMap[reciterStyle] || "--"}) ` +
              reciter?.translated_name?.name,
            lang
          ),
        };
      })
    );
  }
}

module.exports = Audio;
