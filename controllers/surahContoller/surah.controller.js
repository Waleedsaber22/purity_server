const axios = require("axios");
const fs = require("fs");
const path = require("path");
const Global = require("../../handlers/globalHandler/global.handler");
const File = require("../../handlers/fileHandler/file.handler");
class Surah {
  static async getLearningPlans(req, res) {
    try {
      const { lang } = req.query || {};
      const quranDetails = await Global.resolvedPromise(
        async () => {
          const filePath = path.join(
            __dirname,
            "..",
            "..",
            "ar",
            "learning-plans.json"
          );
          const quranDetails = {
            lang: "ar",
            quran: JSON.parse(fs.readFileSync(filePath)),
          };
          return quranDetails;
        },
        async () => {
          const resData = await axios.get(
            `https://quran.com/_next/data/g_X2zg8qfotZzHSQ9yuBX/${
              lang || "en"
            }/learning-plans.json`
          );
          const quranData = resData.data;
          const quranDetails = {
            lang: quranData.__lang,
            quran: quranData.pageProps.chaptersData,
          };
          for (const surah in quranDetails.quran) {
            const sur = quranDetails.quran[surah];
            quranDetails.quran[surah] = { ...sur, key: surah.padStart(3, 0) };
          }
          return quranDetails;
        }
      );
      res.send(quranDetails);
    } catch (err) {
      console.log(err);
    }
  }
  static async getAyah(req, res) {
    const { id } = req.params || {};
    const { reciter } = req.query || {};
    const surahUrl1 = `${process.env.QURAN_API}/chapters/${id}`;
    const data = (await axios.get(surahUrl1)).data;
    const audioDataUrl = `${process.env.QURAN_API}/audio/reciters/${
      reciter || 4
    }/audio_files?chapter=${id}&segments=true`;
    const audioData = (await axios.get(audioDataUrl)).data;

    const audioFile = audioData.audio_files[0];
    const surahDetails = data.chapter;
    const surahUrl = `${process.env.QURAN_API}/verses/by_chapter/${id}?words=true&mushaf=2&word_fields=code_v1&page=1`;
    const surahDataTotal = (await axios.get(surahUrl)).data;
    const surData = [surahDataTotal?.verses];
    const pagination = surahDataTotal?.pagination;
    const { total_pages } = pagination;
    let currentPage = 2;
    while (currentPage <= total_pages) {
      const surahUrl = `${process.env.QURAN_API}/verses/by_chapter/${id}?words=true&mushaf=2&word_fields=code_v1&page=${currentPage}`;
      const surahData = (await axios.get(surahUrl)).data;
      surData.unshift(surahData?.verses);
      currentPage++;
    }
    res.send({
      ...surahDetails,
      data: surData,
      verseTimings: audioFile.verse_timings,
    });
  }
  static async getByPage(req, res) {
    const { id } = req.params || {};
    const { reciter } = req.query || {};
    const surahUrl = `${process.env.QURAN_API}/chapters/${id}`;
    const data = (await axios.get(surahUrl)).data;
    const surahDetails = data.chapter;
    const [from, to] = surahDetails.pages;
    const audioDataUrl = `${process.env.QURAN_API}/audio/reciters/${
      reciter || 4
    }/audio_files?chapter=${id}&segments=true`;
    const audioData = (await axios.get(audioDataUrl)).data;

    const audioFile = audioData.audio_files[0];
    const surData = await Promise.all(
      Array.from({ length: to - from + 1 })
        .map((_, i) => to - i)
        .map(async (p) => {
          const surahUrl = `${process.env.QURAN_API}/verses/by_page/${p}?words=true&mushaf=2&word_fields=code_v1,text_uthmani&per_page=all&from=${id}:1&to=${id}:${surahDetails?.verses_count}`;
          const surahDataTotal = (await axios.get(surahUrl)).data;
          return surahDataTotal.verses;
        })
    );
    res.send({
      ...surahDetails,
      verseTimings: audioFile.verse_timings,
      data: surData,
    });
  }
}

module.exports = Surah;
