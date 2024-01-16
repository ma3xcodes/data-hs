const axios = require("axios");

const BASE_URL = "/api/ec_descriptions/:lng";

const INTRODUCTION = {
  "es": "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4l_CWBDYRjSUNgk2IgYBP3gdue8d4VuE-Rlers8eBGcZtyK63z3RikN-s8SdTKkAuIVqrp-T7cMTJ/pub?gid=0&single=true&output=tsv",
  "en": "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4l_CWBDYRjSUNgk2IgYBP3gdue8d4VuE-Rlers8eBGcZtyK63z3RikN-s8SdTKkAuIVqrp-T7cMTJ/pub?gid=739339855&single=true&output=tsv"
};

const ECONOMIC_COMPLEXITY = {
  "es": "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4l_CWBDYRjSUNgk2IgYBP3gdue8d4VuE-Rlers8eBGcZtyK63z3RikN-s8SdTKkAuIVqrp-T7cMTJ/pub?gid=217005716&single=true&output=tsv",
  "en": "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4l_CWBDYRjSUNgk2IgYBP3gdue8d4VuE-Rlers8eBGcZtyK63z3RikN-s8SdTKkAuIVqrp-T7cMTJ/pub?gid=1110394533&single=true&output=tsv"
};

const ECI = {
  "es": "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4l_CWBDYRjSUNgk2IgYBP3gdue8d4VuE-Rlers8eBGcZtyK63z3RikN-s8SdTKkAuIVqrp-T7cMTJ/pub?gid=1394787298&single=true&output=tsv",
  "en": "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4l_CWBDYRjSUNgk2IgYBP3gdue8d4VuE-Rlers8eBGcZtyK63z3RikN-s8SdTKkAuIVqrp-T7cMTJ/pub?gid=1746192240&single=true&output=tsv"
};

const PCI = {
  "es": "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4l_CWBDYRjSUNgk2IgYBP3gdue8d4VuE-Rlers8eBGcZtyK63z3RikN-s8SdTKkAuIVqrp-T7cMTJ/pub?gid=444997210&single=true&output=tsv",
  "en": "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4l_CWBDYRjSUNgk2IgYBP3gdue8d4VuE-Rlers8eBGcZtyK63z3RikN-s8SdTKkAuIVqrp-T7cMTJ/pub?gid=1762199020&single=true&output=tsv"
};

const ACI = {
  "es": "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4l_CWBDYRjSUNgk2IgYBP3gdue8d4VuE-Rlers8eBGcZtyK63z3RikN-s8SdTKkAuIVqrp-T7cMTJ/pub?gid=971279476&single=true&output=tsv",
  "en": "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4l_CWBDYRjSUNgk2IgYBP3gdue8d4VuE-Rlers8eBGcZtyK63z3RikN-s8SdTKkAuIVqrp-T7cMTJ/pub?gid=472070743&single=true&output=tsv"
};

const PROXIMITY = {
  "es": "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4l_CWBDYRjSUNgk2IgYBP3gdue8d4VuE-Rlers8eBGcZtyK63z3RikN-s8SdTKkAuIVqrp-T7cMTJ/pub?gid=1299340041&single=true&output=tsv",
  "en": "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4l_CWBDYRjSUNgk2IgYBP3gdue8d4VuE-Rlers8eBGcZtyK63z3RikN-s8SdTKkAuIVqrp-T7cMTJ/pub?gid=206940696&single=true&output=tsv"
};

const RELATEDNESS = {
  "es": "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4l_CWBDYRjSUNgk2IgYBP3gdue8d4VuE-Rlers8eBGcZtyK63z3RikN-s8SdTKkAuIVqrp-T7cMTJ/pub?gid=1050457426&single=true&output=tsv",
  "en": "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4l_CWBDYRjSUNgk2IgYBP3gdue8d4VuE-Rlers8eBGcZtyK63z3RikN-s8SdTKkAuIVqrp-T7cMTJ/pub?gid=460088349&single=true&output=tsv"
};

const RCA = {
  "es": "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4l_CWBDYRjSUNgk2IgYBP3gdue8d4VuE-Rlers8eBGcZtyK63z3RikN-s8SdTKkAuIVqrp-T7cMTJ/pub?gid=1311463913&single=true&output=tsv",
  "en": "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4l_CWBDYRjSUNgk2IgYBP3gdue8d4VuE-Rlers8eBGcZtyK63z3RikN-s8SdTKkAuIVqrp-T7cMTJ/pub?gid=205592814&single=true&output=tsv"
};

const PRODUCT_SPACE = {
  "es": "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4l_CWBDYRjSUNgk2IgYBP3gdue8d4VuE-Rlers8eBGcZtyK63z3RikN-s8SdTKkAuIVqrp-T7cMTJ/pub?gid=1214679347&single=true&output=tsv",
  "en": "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4l_CWBDYRjSUNgk2IgYBP3gdue8d4VuE-Rlers8eBGcZtyK63z3RikN-s8SdTKkAuIVqrp-T7cMTJ/pub?gid=1268285942&single=true&output=tsv"
};

const INDUSTRY_SPACE = {
  "es": "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4l_CWBDYRjSUNgk2IgYBP3gdue8d4VuE-Rlers8eBGcZtyK63z3RikN-s8SdTKkAuIVqrp-T7cMTJ/pub?gid=650824097&single=true&output=tsv",
  "en": "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4l_CWBDYRjSUNgk2IgYBP3gdue8d4VuE-Rlers8eBGcZtyK63z3RikN-s8SdTKkAuIVqrp-T7cMTJ/pub?gid=1760319954&single=true&output=tsv"
};

const OPPORTUNITY_FRONTIER = {
  "es": "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4l_CWBDYRjSUNgk2IgYBP3gdue8d4VuE-Rlers8eBGcZtyK63z3RikN-s8SdTKkAuIVqrp-T7cMTJ/pub?gid=5679607&single=true&output=tsv",
  "en": "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4l_CWBDYRjSUNgk2IgYBP3gdue8d4VuE-Rlers8eBGcZtyK63z3RikN-s8SdTKkAuIVqrp-T7cMTJ/pub?gid=2022336050&single=true&output=tsv"
};

const titleDict = {
  "introduction": {
    "es": "Introducción",
    "en": "Introduction"
  },
  "complexity": {
    "es": "Complejidad Económica",
    "en": "Economic Complexity"
  },
  "eci": {
    "es": "Índice de Complejidad Económica (ECI)",
    "en": "Economic Complexity Index (ECI)"
  },
  "pci": {
    "es": "Índice de Complejidad de Producto (PCI)",
    "en": "Product Complexity Index (PCI)"
  },
  "aci": {
    "es": "Índice de Complejidad de Actividades Económicas (ACI)",
    "en": "Economic Activity Complexity Index (ACI)"
  },
  "proximity": {
    "es": "Proximidad",
    "en": "Proximity"
  },
  "relatedness": {
    "es": "Afinidad",
    "en": "Relatedness"
  },
  "rca": {
    "es": "Índice de Ventaja Comparativa Revelada (RCA)",
    "en": "Revealed Comparative Advantage (RCA)"
  },
  "productSpace": {
    "es": "Espacio Producto",
    "en": "Product Space"
  },
  "industrySpace": {
    "es": "Espacio de Industria",
    "en": "Industry Space"
  },
  "possibilityFrontier": {
    "es": "Frontera de Diversificación",
    "en": "Diversification Frontier"
  }
};

module.exports = function (app) {
	app.get(BASE_URL, async (req, res) => {
		const lng = req.params.lng;

    try {
			await axios
				.all([
          axios.get(INTRODUCTION[lng]),
          axios.get(ECONOMIC_COMPLEXITY[lng]),
          axios.get(ECI[lng]),
          axios.get(PCI[lng]),
          axios.get(ACI[lng]),
          axios.get(PROXIMITY[lng]),
          axios.get(RELATEDNESS[lng]),
          axios.get(RCA[lng]),
          axios.get(PRODUCT_SPACE[lng]),
          axios.get(INDUSTRY_SPACE[lng]),
          axios.get(OPPORTUNITY_FRONTIER[lng])
        ])
				.then(axios.spread((...resp) => {
					const respData = resp.map(d => d.data);
					const csvData = respData.map((respItem, respIndex) => {
						const csv = respItem.split("\r\n").map(d => d.split("\t"));

						const data = csv.slice(1).reduce((all, d) => {
							all.push(d[0]);
							return all;
						}, []);
						return data;
					});

					res.json({
						[titleDict["introduction"][lng]]: csvData[0],
						[titleDict["complexity"][lng]]: csvData[1],
						[titleDict["eci"][lng]]: csvData[2],
						[titleDict["pci"][lng]]: csvData[3],
						[titleDict["aci"][lng]]: csvData[4],
            [titleDict["proximity"][lng]]: csvData[5],
						[titleDict["relatedness"][lng]]: csvData[6],
						[titleDict["rca"][lng]]: csvData[7],
						[titleDict["productSpace"][lng]]: csvData[8],
						[titleDict["industrySpace"][lng]]: csvData[9],
						[titleDict["possibilityFrontier"][lng]]: csvData[10]
					});
				}));
		} catch (e) {
			//console.log(e);
			return [];
		}
  })
};
