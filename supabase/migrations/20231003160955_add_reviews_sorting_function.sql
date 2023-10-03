CREATE OR REPLACE FUNCTION get_sorted_reviews(book_id_param varchar(20), offset_param integer)
RETURNS TABLE(id integer, rating_id integer, user_id uuid, body text, rating numeric(2,1), likes_count bigint, created_at timestamp with time zone) AS $$
BEGIN
   RETURN QUERY 
   SELECT r.id, r.rating_id, ra.user_id, r.body, ra.rating, COUNT(rl.id)::bigint AS likes_count, r.created_at
   FROM reviews r
   JOIN ratings ra ON r.rating_id = ra.id
   LEFT JOIN reviews_likes rl ON r.id = rl.review_id
   WHERE ra.book_id = book_id_param
   GROUP BY r.id, ra.user_id, ra.rating
   ORDER BY likes_count DESC, r.created_at DESC
   LIMIT 10 OFFSET offset_param;
END;
$$ LANGUAGE plpgsql;
