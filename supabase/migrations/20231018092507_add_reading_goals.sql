CREATE TABLE reading_goals (
    id serial PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    "year" integer NOT NULL,
    goal integer NOT NULL DEFAULT 5,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE(user_id, "year")
);

CREATE POLICY "Everyone can insert a new reading goal" ON reading_goals FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own reading goals." ON reading_goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Reading goals are viewable by everyone." ON reading_goals FOR SELECT USING (true);

CREATE OR REPLACE FUNCTION create_reading_goal() RETURNS TRIGGER AS $$
BEGIN
    RAISE NOTICE 'Trigger create_reading_goal activated for user ID %', NEW.id;
    
    INSERT INTO public.reading_goals (user_id, "year")
    VALUES (NEW.id, date_part('year', now()));

    RAISE NOTICE 'Inserted reading goal for user ID % in year %', NEW.id, date_part('year', now());

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_insert_reading_goal
AFTER INSERT ON auth.users
FOR EACH ROW 
EXECUTE FUNCTION create_reading_goal();