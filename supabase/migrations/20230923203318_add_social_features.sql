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
CREATE POLICY "Users can update their own profiles." ON profiles FOR UPDATE USING (auth.uid() = user_id);

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
