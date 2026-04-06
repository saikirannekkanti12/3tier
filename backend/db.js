const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || "postgres-service",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "mydb",
  port: process.env.DB_PORT || 5432,
});

module.exports = pool;
