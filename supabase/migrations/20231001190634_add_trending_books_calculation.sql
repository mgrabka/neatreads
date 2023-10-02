CREATE OR REPLACE FUNCTION get_trending_books() RETURNS TABLE (
    book_id VARCHAR(20),
    bayesian_avg FLOAT8
) AS $$
DECLARE
    global_avg_rating FLOAT8;
    avg_count FLOAT8;
BEGIN
    SELECT AVG(rating) INTO global_avg_rating FROM ratings;

    SELECT AVG(count_reviews) INTO avg_count FROM 
        (SELECT ratings.book_id, COUNT(*) as count_reviews FROM ratings GROUP BY ratings.book_id) AS BookStats;

    RETURN QUERY
    SELECT
        r.book_id,
        (avg_count * global_avg_rating + SUM(r.rating)) / (avg_count + COUNT(r.*)) as bayesian_avg
    FROM
        ratings r
    GROUP BY
        r.book_id
    ORDER BY
        bayesian_avg DESC
    LIMIT 6;
END;
$$ LANGUAGE plpgsql;