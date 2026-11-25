CREATE TABLE exercises (
  exercise_id INT IDENTITY(1,1) PRIMARY KEY,
  name NVARCHAR(100) NOT NULL UNIQUE,
  muscle_group NVARCHAR(50) NOT NULL
);

CREATE TABLE sessions (
  session_id INT IDENTITY(1,1) PRIMARY KEY,
  session_date DATE NOT NULL
);

CREATE TABLE sets (
  set_id INT IDENTITY(1,1) PRIMARY KEY,
  session_id INT NOT NULL REFERENCES sessions(session_id),
  exercise_id INT NOT NULL REFERENCES exercises(exercise_id),
  weight_lbs INT NOT NULL,
  reps INT NOT NULL
);
