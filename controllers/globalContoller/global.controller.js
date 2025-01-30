class Global {
  static getTranslatedName(obj, lang) {
    return { [`${lang}Name`]: obj.bind ? obj() : obj.translated_name.name };
  }
}

module.exports = Global;
