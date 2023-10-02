CREATE TYPE activity_type AS ENUM ('followed', 'rated', 'reviewed', 'wants to read', 'is currently reading', 'read');

CREATE TABLE activities (
    id serial PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    did_what activity_type NOT NULL,
    did_to_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    did_to_book_id varchar(20),
    rating_value numeric(2,1),
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can insert activities." ON activities FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update their own activities." ON activities FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Activities are viewable by everyone." ON activities FOR SELECT USING (true);

CREATE OR REPLACE FUNCTION handle_rating_activity()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO activities(user_id, did_what, did_to_book_id, rating_value)
        VALUES (NEW.user_id, 'rated', NEW.book_id, NEW.rating); 
        RETURN NEW;
    END IF;
    IF TG_OP = 'DELETE' THEN
        DELETE FROM activities
        WHERE user_id = OLD.user_id AND did_to_book_id = OLD.book_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_add_rating_activity
AFTER INSERT OR UPDATE OR DELETE ON ratings
FOR EACH ROW
EXECUTE FUNCTION handle_rating_activity();

CREATE OR REPLACE FUNCTION handle_review_activity()
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
    IF TG_OP = 'DELETE' THEN
        DELETE FROM activities
        WHERE user_id = v_user_id AND did_to_book_id = v_book_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_add_review_activity
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION handle_review_activity();

CREATE OR REPLACE FUNCTION handle_follow_activity()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO activities(user_id, did_what, did_to_user_id)
        VALUES (NEW.follower_id, 'followed', NEW.followed_id); 
        RETURN NEW;
    END IF;
    IF TG_OP = 'DELETE' THEN
        DELETE FROM activities
        WHERE user_id = OLD.follower_id AND did_to_user_id = OLD.followed_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_follow_activity
AFTER INSERT OR DELETE ON follows
FOR EACH ROW
EXECUTE FUNCTION handle_follow_activity();

CREATE OR REPLACE FUNCTION add_reading_status_activity()
RETURNS TRIGGER AS $$
DECLARE
    last_activity_time TIMESTAMP;
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        SELECT created_at INTO last_activity_time
        FROM activities
        WHERE user_id = NEW.user_id AND did_to_book_id = NEW.book_id
        AND did_what IN ('wants to read', 'is currently reading', 'read')
        ORDER BY created_at DESC
        LIMIT 1;

        IF last_activity_time IS NULL OR now() - last_activity_time >= interval '1 hour' THEN
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
        ELSE
            UPDATE activities
            SET did_what = (CASE 
                       WHEN NEW.status = 'Want to Read' THEN 'wants to read'
                       WHEN NEW.status = 'Currently Reading' THEN 'is currently reading'
                       WHEN NEW.status = 'Read' THEN 'read'
                       ELSE NULL
                   END)::activity_type
            WHERE user_id = NEW.user_id 
            AND did_to_book_id = NEW.book_id
            AND created_at = last_activity_time;
        END IF;   
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_add_reading_status_activity
AFTER INSERT OR UPDATE ON reading_statuses
FOR EACH ROW
EXECUTE FUNCTION add_reading_status_activity();