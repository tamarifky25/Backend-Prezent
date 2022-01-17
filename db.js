const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "admin25",
  database: "Prezent",
  host: "localhost",
  port: 5432
});

module.exports = pool;