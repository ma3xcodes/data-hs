/** @param {import("express").Application} app */
module.exports = function(app) {
  app.get("/api/perspective_selector_data/getMembers", async(req, res) => {
    const {locale = "es"} = req.query;

    const {perspectiveSelectorData} = app.settings.cache;

    if (perspectiveSelectorData) {
      return res.json(perspectiveSelectorData[locale]);
    }
    return res.json({});
  });
};
