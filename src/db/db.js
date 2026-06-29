const { Pool } = require('pg');

// We create a PostgreSQL connection pool using the DATABASE_URL environment variable.
// A connection pool manages multiple database connections for us, reusing them to
// improve performance and handle concurrent database requests efficiently.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * Execute an SQL query against the database pool.
 * This is a helper function that takes an SQL query string and optional parameters,
 * runs the query using one of the pool's idle connections, and returns the result.
 * 
 * @param {string} text - The SQL query string (e.g. 'SELECT * FROM students')
 * @param {Array} params - The parameter values to safely replace placeholders (e.g. $1, $2)
 * @returns {Promise<object>} The database query result
 */
const query = async (text, params) => {
  try {
    return await pool.query(text, params);
  } catch (error) {
    console.error('❌ Database Query Error:', error.message);
    throw error;
  }
};

module.exports = {
  query,
  pool,
};
