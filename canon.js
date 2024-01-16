/**
    The object that this file exports is used to set configurations for canon
    and it's sub-modules.
    postgresql://postgres:AGEBGB4-DB-3Dc4FCBBCEd2gG-ecgdE3@postgres.railway.internal:5432/railway
    postgresql://postgres:AGEBGB4-DB-3Dc4FCBBCEd2gG-ecgdE3@monorail.proxy.rlwy.net:46295/railway
*/
module.exports = {
  db: [
    {
      host: "localhost",
      name: "datamexico",
      user: "postgres",
      pass: "postgres",
      port: 5432,
      tables: [
        require("@datawheel/canon-core/models"),
        require("@datawheel/canon-cms/models")
      ]
    }
  ]
};