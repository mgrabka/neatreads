CREATE TABLE collections (
    id serial PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
    name varchar(50) NOT NULL,
    UNIQUE(user_id, name)
);

CREATE POLICY "Authenticated can insert a new collection." ON collections FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update their own collections." ON collections FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Collections are viewable by everyone." ON collections FOR SELECT USING (true);
CREATE POLICY "Users can delete their own collections." ON collections FOR DELETE USING (auth.uid() = user_id);

CREATE TABLE collections_content (
    id serial PRIMARY KEY,
    collection_id int NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    book_id varchar(20) NOT NULL,
    UNIQUE(book_id, collection_id)
);

CREATE INDEX idx_collections_content_collection_id ON collections_content(collection_id);
CREATE INDEX idx_collections_content_book_id ON collections_content(book_id);


CREATE POLICY "Authenticated can insert a new collection content." ON collections_content FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update their own collection content." ON collections_content FOR UPDATE USING (auth.uid() = (SELECT user_id FROM collections WHERE id = collection_id));
CREATE POLICY "Collection content is viewable by everyone." ON collections_content FOR SELECT USING (true);
CREATE POLICY "Users can delete their own collections." ON collections_content FOR DELETE USING (auth.uid() = (SELECT user_id FROM collections WHERE id = collection_id));

CREATE OR REPLACE FUNCTION get_book_counts_by_collection(p_user_id uuid)
RETURNS TABLE(collection_id int, book_count bigint) AS
$$
BEGIN
    RETURN QUERY
    SELECT
        c.id AS collection_id,
        COALESCE(COUNT(cc.book_id), 0) AS book_count
    FROM
        collections c
    LEFT JOIN
        collections_content cc ON c.id = cc.collection_id
    WHERE
        c.user_id = p_user_id
    GROUP BY
        c.id;
END;
$$ LANGUAGE plpgsql;
