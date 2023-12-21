const axios = require("axios");
const yn = require("yn");

const verbose = yn(process.env.CANON_CMS_LOGGING);

const BASE_API = `${process.env.CANON_CMS_CUBES}data.jsonrecords`;
console.log(process.env);
const {CANON_LANGUAGES} = process.env;

/**
 *
 * @returns
 */
async function getLevelData(cubeDict, level, subLevel, locale, measureDict) {
  const params = {
    cube: cubeDict[level],
    drilldowns: subLevel,
    locale,
    measures: measureDict[level],
    parents: false,
    sparse: true
  };

  const data = await axios.get(BASE_API, {params}).then(resp => {
    const {data} = resp.data;

    const customData = data.map(d => {
      const item = {
        id: d[`${subLevel} ID`],
        name: d[subLevel]
      };

      return item;
    });

    return customData.sort((a, b) => b.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "") > a.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "") ? -1 : 1);
  }).catch(error => {
    if (verbose) {
      console.error("Perspective Selector Member List Error (Tesseract):", error.message);
    }

    return {};
  });

  return data;
}

/**
 *
 * @returns
 */
async function getPerspectiveSelectorData() {
  const cubeDict = {
    geo: "inegi_population",
    industry: "inegi_denue"
  };

  const levelDict = {
    geo: ["State", "Metro Area", "Municipality"],
    industry: ["Industry Group", "NAICS Industry", "National Industry"]
  };

  const measureDict = {
    geo: "Population",
    industry: "Companies"
  };

  const availableLevels = Object.keys(cubeDict);
  const availableLocales = CANON_LANGUAGES?.split(",") || ["en", "es"];

  const output = {};

  for (const locale of availableLocales) {
    Object.assign(output[locale] = {});
    for (const level of availableLevels) {
      Object.assign(output[locale][level] = {});
      for (const subLevel of levelDict[level]) {
        Object.assign(output[locale][level][subLevel] = await getLevelData(cubeDict, level, subLevel, locale, measureDict));
      }
    }
  }

  return output;
}

module.exports = getPerspectiveSelectorData;
