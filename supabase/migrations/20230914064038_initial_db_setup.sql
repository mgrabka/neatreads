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

CREATE TABLE profiles (
    id serial PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    username varchar(15) NOT NULL UNIQUE,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE(user_id)
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Everyone can insert a new profile" ON profiles FOR INSERT WITH CHECK (true);

CREATE TABLE follows (
    id serial PRIMARY KEY,
    follower_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    followed_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    UNIQUE(follower_id, followed_id)
);

ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

ALTER TABLE follows
ADD CONSTRAINT "Users must not be able to follow themselves."
CHECK (follower_id <> followed_id);

CREATE POLICY "Authenticated users can follow others." ON follows FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update their own outcoming follows." ON follows FOR UPDATE USING (auth.uid() = follower_id);
CREATE POLICY "Users can delete their own outcoming follows." ON follows FOR DELETE USING (auth.uid() = follower_id);
CREATE POLICY "Follows are viewable by everyone." ON follows FOR SELECT USING (true);

CREATE TYPE activity_type AS ENUM ('followed', 'rated', 'reviewed', 'wants to read', 'is currently reading', 'read');

CREATE TABLE activities (
    id serial PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    did_what activity_type NOT NULL,
    did_to_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    did_to_book_id varchar(20),
    rating_value numeric(2,1),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE(user_id, did_what, did_to_user_id),
    UNIQUE(user_id, did_what, did_to_book_id)
);

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can insert activities." ON activities FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update their own activities." ON activities FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Activities are viewable by everyone." ON activities FOR SELECT USING (true);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_modtime_profiles
AFTER UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_modtime_reading_statuses
AFTER UPDATE ON reading_statuses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_modtime_ratings
AFTER UPDATE ON ratings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_modtime_reviews
AFTER UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION add_rating_activity()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO activities(user_id, did_what, did_to_book_id, rating_value)
        VALUES (NEW.user_id, 'rated', NEW.book_id, NEW.rating); 
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_add_rating_activity
AFTER INSERT OR UPDATE ON ratings
FOR EACH ROW
EXECUTE FUNCTION add_rating_activity();

CREATE OR REPLACE FUNCTION add_review_activity()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id uuid;
    v_book_id varchar(20);
BEGIN
    SELECT user_id, book_id INTO v_user_id, v_book_id
    FROM ratings
    WHERE id = NEW.rating_id;

    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO activities(user_id, did_what, did_to_book_id)
        VALUES (v_user_id, 'reviewed', v_book_id); 
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_add_review_activity
AFTER INSERT OR UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION add_review_activity();

CREATE OR REPLACE FUNCTION add_follow_activity()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO activities(user_id, did_what, did_to_user_id)
        VALUES (NEW.follower_id, 'reviewed', NEW.followed_id); 
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_add_follow_activity
AFTER INSERT ON follows
FOR EACH ROW
EXECUTE FUNCTION add_follow_activity();

CREATE OR REPLACE FUNCTION add_reading_status_activity()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO activities(user_id, did_what, did_to_book_id)
        VALUES (
            NEW.user_id, 
            (CASE 
                WHEN NEW.status = 'Want to Read' THEN 'wants to read'
                WHEN NEW.status = 'Currently Reading' THEN 'is currently reading'
                WHEN NEW.status = 'Read' THEN 'read'
                ELSE NULL
            END)::activity_type, 
            NEW.book_id
        ); 
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_add_reading_status_activity
AFTER INSERT OR UPDATE ON reading_statuses
FOR EACH ROW
EXECUTE FUNCTION add_reading_status_activity();


