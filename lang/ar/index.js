const ArDataMap = {
  Murattal: "مُرتَّل",
  Mujawwad: "مُجوَّد",
  Muallim: "مُعلِم",
  "Kids repeat": "تلاوة مع طفل",
};

const ProxyArDataMap = new Proxy(ArDataMap, {
  get: function (target, prop) {
    return target[prop] || "";
  },
});
module.exports = ProxyArDataMap;
