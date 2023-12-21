/**
    The object that this file exports is used to set configurations for canon
    and it's sub-modules.
*/
module.exports = {
  db: [
    {
      host: "localhost",
      name: "datamexico",
      user: "postgres",
      pass: "postgres",
      tables: [
        require("@datawheel/canon-core/models"),
        require("@datawheel/canon-cms/models")
      ]
    }
  ]
};
