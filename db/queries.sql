DECLARE @exercise NVARCHAR(100) = N'Bench Press';

SELECT s.session_date, MAX(st.weight_lbs) AS best_weight
FROM sets st
JOIN sessions s ON s.session_id = st.session_id
JOIN exercises e ON e.exercise_id = st.exercise_id
WHERE e.name = @exercise
GROUP BY s.session_date
ORDER BY s.session_date DESC;
