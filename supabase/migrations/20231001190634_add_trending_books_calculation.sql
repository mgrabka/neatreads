CREATE OR REPLACE FUNCTION get_trending_books(time_frame TEXT) RETURNS TABLE (
    book_id VARCHAR(20),
    bayesian_avg FLOAT8
) AS $$
DECLARE
    global_avg_rating FLOAT8;
    avg_count FLOAT8;
    time_filter TIMESTAMP;
BEGIN
    IF time_frame = 'all_time' THEN
        time_filter := '-infinity'::TIMESTAMP;
    ELSIF time_frame = 'this_month' THEN
        time_filter := date_trunc('MONTH', CURRENT_DATE);
    ELSIF time_frame = 'this_week' THEN
        time_filter := date_trunc('WEEK', CURRENT_DATE);
    ELSE
        RAISE EXCEPTION 'Invalid time frame';
    END IF;

    SELECT AVG(rating) INTO global_avg_rating FROM ratings WHERE created_at >= time_filter;

    SELECT AVG(count_reviews) INTO avg_count FROM 
        (SELECT ratings.book_id, COUNT(*) as count_reviews FROM ratings WHERE created_at >= time_filter GROUP BY ratings.book_id) AS BookStats;

    RETURN QUERY
    SELECT
        r.book_id,
        (avg_count * global_avg_rating + SUM(r.rating)) / (avg_count + COUNT(r.*)) as bayesian_avg
    FROM
        ratings r
    WHERE
        r.created_at >= time_filter
    GROUP BY
        r.book_id
    ORDER BY
        bayesian_avg DESC
    LIMIT 6;
END;
$$ LANGUAGE plpgsql;