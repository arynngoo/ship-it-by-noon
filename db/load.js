require('dotenv').config();
const fs = require('fs');
const path = require('path');
const sql = require('mssql');

const exercises = [
  ['Bench Press', 'Chest'], ['Squat', 'Legs'], ['Deadlift', 'Back'], ['Overhead Press', 'Shoulders'],
  ['Barbell Row', 'Back'], ['Incline Bench', 'Chest'], ['Leg Press', 'Legs'], ['Pull-up', 'Back'],
  ['Bicep Curl', 'Arms'], ['Tricep Pushdown', 'Arms']
];

const sessions = [
  '2026-09-01', '2026-09-04', '2026-09-08', '2026-09-11', '2026-09-15', '2026-09-18', '2026-09-22',
  '2026-09-25', '2026-09-29', '2026-10-02', '2026-10-06', '2026-10-09', '2026-10-13', '2026-10-16',
  '2026-10-20', '2026-10-23', '2026-10-27', '2026-10-30', '2026-11-03', '2026-11-06'
];

const sets = [
  [1, 1, 135, 8], [1, 2, 185, 5], [2, 1, 140, 6], [2, 3, 225, 5], [3, 1, 140, 8],
  [4, 2, 195, 5], [5, 1, 145, 5], [6, 3, 235, 5], [7, 1, 145, 7], [8, 4, 85, 8],
  [9, 1, 150, 5], [10, 2, 205, 4], [11, 1, 150, 6], [12, 5, 115, 8], [13, 1, 155, 4],
  [14, 3, 245, 3], [15, 1, 155, 5], [16, 6, 115, 8], [17, 1, 160, 3], [18, 2, 215, 3],
  [19, 1, 155, 6], [20, 1, 165, 2]
];

(async () => {
  const pool = await sql.connect({
    server: process.env.DB_SERVER,
    port: Number(process.env.DB_PORT || 1433),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    options: { encrypt: true, trustServerCertificate: true }
  });

  await pool.request().query(`
    DROP TABLE IF EXISTS sets;
    DROP TABLE IF EXISTS sessions;
    DROP TABLE IF EXISTS exercises;`);
  await pool.request().query(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));

  for (const [name, group] of exercises) {
    await pool.request()
      .input('name', sql.NVarChar(100), name)
      .input('group', sql.NVarChar(50), group)
      .query('INSERT INTO exercises (name, muscle_group) VALUES (@name, @group)');
  }
  for (const d of sessions) {
    await pool.request().input('d', sql.Date, d).query('INSERT INTO sessions (session_date) VALUES (@d)');
  }
  for (const [s, e, w, r] of sets) {
    await pool.request()
      .input('s', sql.Int, s).input('e', sql.Int, e).input('w', sql.Int, w).input('r', sql.Int, r)
      .query('INSERT INTO sets (session_id, exercise_id, weight_lbs, reps) VALUES (@s, @e, @w, @r)');
  }

  console.log(`Loaded ${exercises.length} exercises, ${sessions.length} sessions, ${sets.length} sets`);
  await pool.close();
})().catch(err => {
  console.log('Error: ' + err.message);
  process.exitCode = 1;
});
