/**
    The object that this file exports is used to set configurations for canon
    and it's sub-modules.
*/
module.exports = {
  db: [
    {
      host: "monorail.proxy.rlwy.net",
      name: "railway",
      user: "postgres",
      pass: "AGEBGB4-DB-3Dc4FCBBCEd2gG-ecgdE3",
      tables: [
        require("@datawheel/canon-core/models"),
        require("@datawheel/canon-cms/models")
      ]
    }
  ]
};