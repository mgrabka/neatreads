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

CREATE POLICY "Authenticated users can insert reading statuses." ON reading_statuses FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update their own reading statuses." ON reading_statuses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reading statuses." ON reading_statuses FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Reading statuses are viewable by everyone." ON reading_statuses FOR SELECT USING (true);