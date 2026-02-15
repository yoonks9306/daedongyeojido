-- Add score column to comments table for upvote/downvote tracking
ALTER TABLE comments ADD COLUMN IF NOT EXISTS score integer NOT NULL DEFAULT 0;

-- Comment votes table (upvote = 1, downvote = -1)
CREATE TABLE IF NOT EXISTS comment_votes (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  comment_id bigint NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  vote smallint NOT NULL CHECK (vote IN (-1, 1)),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(comment_id, user_id)
);

-- Enable RLS
ALTER TABLE comment_votes ENABLE ROW LEVEL SECURITY;

-- Allow authenticated reads
CREATE POLICY "Anyone can read comment votes" ON comment_votes
  FOR SELECT USING (true);

-- RPC to atomically recalculate comment score
CREATE OR REPLACE FUNCTION recalculate_comment_score(cid bigint)
RETURNS integer AS $$
DECLARE
  new_score integer;
BEGIN
  SELECT COALESCE(SUM(vote), 0) INTO new_score
  FROM comment_votes WHERE comment_id = cid;

  UPDATE comments SET score = new_score WHERE id = cid;

  RETURN new_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
