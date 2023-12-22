/**
    The object that this file exports is used to set configurations for canon
    and it's sub-modules.
*/
module.exports = {
  db: [
    {
      host: process.env.PGHOST,
      name: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      pass: process.env.POSTGRES_PASSWORD,
      tables: [
        require("@datawheel/canon-core/models"),
        require("@datawheel/canon-cms/models")
      ]
    }
  ]
};