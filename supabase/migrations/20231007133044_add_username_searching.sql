CREATE EXTENSION pg_trgm;

CREATE OR REPLACE FUNCTION search_users(
  search_username TEXT,
  result_limit INT
)
RETURNS TABLE(user_id uuid, username varchar(15)) AS $$
BEGIN
  RETURN QUERY
  SELECT profiles.user_id, profiles.username
  FROM profiles
  WHERE profiles.username % search_username
  ORDER BY profiles.username <-> search_username
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql;