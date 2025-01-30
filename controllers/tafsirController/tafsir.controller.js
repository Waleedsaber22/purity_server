const axios = require("axios");
const fs = require("fs");
const path = require("path");
const Global = require("../../lib/handlers/globalHandler/global.handler");
const File = require("../../lib/handlers/fileHandler/file.handler");
const GlobalController = require("../globalContoller/global.controller");
const ArDataMap = require("../../lang/ar");
let streams = {};
class Tafsir extends GlobalController {
  static getDefaultTafsir(tafsir, lang) {
    tafsir = {
      ...tafsir,
      tafsir: tafsir.text,
      name: tafsir.resource_name || tafsir.author_name,
      key: tafsir.slug,
      ...(lang ? Tafsir.getTranslatedName(tafsir, lang) : {}),
    };
    delete tafsir.text;
    return tafsir;
  }
  static async getSurahTafsir(req, res) {
    const { id } = req.params || {};
    const { lang = "ar" } = req.query || {};
    const tafsirDataUrl = `${process.env.QURAN_API}/tafsirs/ar-tafsir-ibn-kathir/by_chapter/${id}?locale=${lang}&words=true&mushaf=2`;
    const response = await axios.get(tafsirDataUrl);
    res.send(
      response.data.tafsirs.map((tafsir) => Tafsir.getDefaultTafsir(tafsir))
    );
  }

  static async getAyahTafsir(req, res) {
    const { id, surahID } = req.params || {};
    const { reciter = "1", lang = "ar" } = req.query || {};
    const tafsirDataUrl = `${process.env.QURAN_API}/tafsirs/ar-tafsir-ibn-kathir/by_ayah/${surahID}:${id}?locale=${lang}&words=true&word_fields=verse_key%2Cverse_id%2Cpage_number%2Clocation%2Ctext_uthmani%2Ccode_v1%2Cqpc_uthmani_hafs&mushaf=2`;
    const response = await axios.get(tafsirDataUrl);
    res.send(Tafsir.getDefaultTafsir(response.data.tafsir, lang));
  }

  static async getTafsirs(req, res) {
    const { lang = "ar" } = req.query || {};
    const tafsirDataUrl = `${process.env.QURAN_API}/resources/tafsirs?language=${lang}`;
    const response = await axios.get(tafsirDataUrl);
    res.send(
      response.data.tafsirs.map((tafsir) => ({
        ...tafsir,
        ...Tafsir.getDefaultTafsir(tafsir, lang),
        id: tafsir.id,
        styledName: tafsir.name,
        lang: tafsir.language_name,
      }))
    );
  }
}

module.exports = Tafsir;
