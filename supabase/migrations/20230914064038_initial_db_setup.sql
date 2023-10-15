CREATE TABLE ratings (
    id serial PRIMARY KEY,
    book_id varchar(20) NOT NULL,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rating numeric(2,1) NOT NULL CHECK ((rating * 2) = FLOOR(rating * 2) AND rating >= 1 AND rating <= 5),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE(user_id, book_id) 
);

CREATE INDEX idx_ratings_book_id ON ratings(book_id);
CREATE INDEX idx_ratings_user_id ON ratings(user_id);

ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can insert ratings." ON ratings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update their own ratings." ON ratings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own ratings." ON ratings FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Ratings are viewable by everyone." ON ratings FOR SELECT USING (true);

CREATE TABLE reviews (
    id serial PRIMARY KEY,
    rating_id serial NOT NULL REFERENCES ratings(id) ON DELETE CASCADE,
    body text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE(rating_id)
);

CREATE INDEX idx_reviews_rating_id ON reviews(rating_id);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can insert reviews." ON reviews FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update their own reviews." ON reviews FOR UPDATE USING (auth.uid() = (SELECT user_id FROM ratings WHERE id = rating_id));
CREATE POLICY "Users can delete their own reviews." ON reviews FOR DELETE USING (auth.uid() = (SELECT user_id FROM ratings WHERE id = rating_id));
CREATE POLICY "Reviews are viewable by everyone." ON reviews FOR SELECT USING (true);

CREATE TYPE reading_status AS ENUM ('Want to Read', 'Currently Reading', 'Read');

CREATE TABLE reading_statuses (
    id serial PRIMARY KEY,
    book_id varchar(20) NOT NULL, 
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    "status" reading_status NOT NULL DEFAULT 'Want to Read',
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE(user_id, book_id)
);

CREATE INDEX idx_reading_statuses_user_id ON reading_statuses(user_id);

ALTER TABLE reading_statuses ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION get_reading_status_counts(p_user_id uuid)
RETURNS TABLE (read integer, currently_reading integer, want_to_read integer) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COALESCE(CAST(SUM(CASE WHEN status = 'Read' THEN 1 ELSE 0 END) AS INTEGER), 0) AS read,
        COALESCE(CAST(SUM(CASE WHEN status = 'Currently Reading' THEN 1 ELSE 0 END) AS INTEGER), 0) AS currently_reading,
        COALESCE(CAST(SUM(CASE WHEN status = 'Want to Read' THEN 1 ELSE 0 END) AS INTEGER), 0) AS want_to_read
    FROM reading_statuses
    WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;


CREATE POLICY "Authenticated users can insert reading statuses." ON reading_statuses FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update their own reading statuses." ON reading_statuses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reading statuses." ON reading_statuses FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Reading statuses are viewable by everyone." ON reading_statuses FOR SELECT USING (true);

CREATE TABLE reviews_likes (
    id serial PRIMARY KEY,
    review_id serial NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE(review_id, user_id)
);

CREATE INDEX idx_reviews_likes_review_id ON reviews_likes(review_id);
CREATE INDEX idx_reviews_likes_user_id ON reviews_likes(user_id);

ALTER TABLE reviews_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can insert likes." ON reviews_likes FOR INSERT TO authenticated WITH CHECK (true);
-- CREATE POLICY "Users can update their own likes." ON review_likes FOR UPDATE USING (auth.uid() = (SELECT user_id FROM ratings WHERE id = rating_id));
CREATE POLICY "Users can delete their own likes." ON reviews_likes FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Likes are viewable by everyone." ON reviews_likes FOR SELECT USING (true);
