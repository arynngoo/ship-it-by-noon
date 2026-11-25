require('dotenv').config();
const path = require('path');
const express = require('express');
const sql = require('mssql');

const app = express();
app.use(express.static(path.join(__dirname, '..', 'web')));

const pool = sql.connect({
  server: process.env.DB_SERVER,
  port: Number(process.env.DB_PORT || 1433),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  options: { encrypt: true, trustServerCertificate: true }
});

app.get('/api/progress', async (req, res) => {
  try {
    const result = await (await pool).request()
      .input('exercise', sql.NVarChar(100), req.query.exercise || '')
      .query(`
        SELECT s.session_date, MAX(st.weight_lbs) AS best_weight
        FROM sets st
        JOIN sessions s ON s.session_id = st.session_id
        JOIN exercises e ON e.exercise_id = st.exercise_id
        WHERE e.name = @exercise
        GROUP BY s.session_date
        ORDER BY s.session_date DESC`);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Running at http://localhost:${port}`));
