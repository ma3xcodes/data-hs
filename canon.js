/**
    The object that this file exports is used to set configurations for canon
    and it's sub-modules.
*/
module.exports = {
  db: [
    {
      host: process.env.PGHOST,
      name: process.env.PGDATABASE,
      user: process.env.PGUSER,
      pass: process.env.PGPASSWORD,
      tables: [
        require("@datawheel/canon-core/models"),
        require("@datawheel/canon-cms/models")
      ]
    }
  ]
};