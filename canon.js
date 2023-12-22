/**
    The object that this file exports is used to set configurations for canon
    and it's sub-modules.
*/
module.exports = {
  db: [
    {
      host: PGHOST,
      name: PGDATABASE,
      user: PGUSER,
      pass: PGPASSWORD,
      tables: [
        require("@datawheel/canon-core/models"),
        require("@datawheel/canon-cms/models")
      ]
    }
  ]
};