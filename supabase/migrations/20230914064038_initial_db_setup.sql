CREATE SCHEMA library;

GRANT USAGE ON SCHEMA library TO PUBLIC;

CREATE TABLE library.ratings (
    id serial PRIMARY KEY,
    book_id varchar(20) NOT NULL,
    user_id uuid NOT NULL REFERENCES auth.users(id),
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE(user_id, book_id) 
);

CREATE INDEX idx_ratings_book_id ON library.ratings(book_id);
CREATE INDEX idx_ratings_user_id ON library.ratings(user_id);

ALTER TABLE library.ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY insert_rating ON library.ratings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY update_own_rating ON library.ratings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY delete_own_rating ON library.ratings FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY select_all_ratings ON library.ratings FOR SELECT USING (true);

GRANT SELECT ON TABLE library.ratings TO PUBLIC;
GRANT INSERT, UPDATE, DELETE ON TABLE library.ratings TO authenticated;

CREATE TABLE library.comments (
    id serial PRIMARY KEY,
    rating_id bigint NOT NULL REFERENCES library.ratings(id),
    body text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE(rating_id)
);

CREATE INDEX idx_comments_rating_id ON library.comments(rating_id);

ALTER TABLE library.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY insert_comment ON library.comments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY update_own_comment ON library.comments FOR UPDATE USING (auth.uid() = (SELECT user_id FROM library.ratings WHERE id = rating_id));
CREATE POLICY delete_own_comment ON library.comments FOR DELETE USING (auth.uid() = (SELECT user_id FROM library.ratings WHERE id = rating_id));
CREATE POLICY select_all_comments ON library.comments FOR SELECT USING (true);

GRANT SELECT ON TABLE library.comments TO PUBLIC;
GRANT INSERT, UPDATE, DELETE ON TABLE library.comments TO authenticated;

CREATE TYPE reading_status AS ENUM ('Currently Reading', 'Have Read', 'Want to Read');

CREATE TABLE library.reading_statuses (
    id serial PRIMARY KEY,
    book_id varchar(20) NOT NULL, 
    user_id uuid NOT NULL REFERENCES auth.users(id),
    "status" reading_status NOT NULL DEFAULT 'Want to Read',
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE(user_id, book_id)
);

CREATE INDEX idx_reading_statuses_user_id ON library.reading_statuses(user_id);

ALTER TABLE library.reading_statuses ENABLE ROW LEVEL SECURITY;

CREATE POLICY insert_status ON library.reading_statuses FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY update_own_status ON library.reading_statuses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY delete_own_status ON library.reading_statuses FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY select_all_statuses ON library.reading_statuses FOR SELECT USING (true);

GRANT SELECT ON TABLE library.reading_statuses TO PUBLIC;
GRANT INSERT, UPDATE, DELETE ON TABLE library.reading_statuses TO authenticated;