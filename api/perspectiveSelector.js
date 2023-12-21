const axios = require("axios");

const BASE_URL = "/api/perspective_selector/:lng";

const GEOGRAPHICAL = {
  es: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT8zHFMBB6ydrsW-EgGZ1_Jz7PWxWRdOX0o6Rab9HeAczXzfUpss3D0eXkVWNxEGPVo_dMKW4Ux5SGc/pub?gid=0&single=true&output=tsv",
  en: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT8zHFMBB6ydrsW-EgGZ1_Jz7PWxWRdOX0o6Rab9HeAczXzfUpss3D0eXkVWNxEGPVo_dMKW4Ux5SGc/pub?gid=2100199548&single=true&output=tsv"
};

const INDUSTRY = {
  es: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT8zHFMBB6ydrsW-EgGZ1_Jz7PWxWRdOX0o6Rab9HeAczXzfUpss3D0eXkVWNxEGPVo_dMKW4Ux5SGc/pub?gid=1388881514&single=true&output=tsv",
  en: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT8zHFMBB6ydrsW-EgGZ1_Jz7PWxWRdOX0o6Rab9HeAczXzfUpss3D0eXkVWNxEGPVo_dMKW4Ux5SGc/pub?gid=746536573&single=true&output=tsv"
};

const PRODUCT = {
  es: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT8zHFMBB6ydrsW-EgGZ1_Jz7PWxWRdOX0o6Rab9HeAczXzfUpss3D0eXkVWNxEGPVo_dMKW4Ux5SGc/pub?gid=712654429&single=true&output=tsv",
  en: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT8zHFMBB6ydrsW-EgGZ1_Jz7PWxWRdOX0o6Rab9HeAczXzfUpss3D0eXkVWNxEGPVo_dMKW4Ux5SGc/pub?gid=700140801&single=true&output=tsv"
};

module.exports = function(app) {
  app.get(BASE_URL, async(req, res) => {
    const lng = req.params.lng;

    try {
      await axios
        .all([
          axios.get(GEOGRAPHICAL[lng]),
          axios.get(INDUSTRY[lng]),
          axios.get(PRODUCT[lng])
        ]).then(axios.spread((...resp) => {
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
            geo: csvData[0],
            industry: csvData[1],
            product: csvData[2]
          });
        }));
    }
    catch (e) {
      console.log(e);
      return [];
    }
  });
};
