CREATE TABLE IF NOT EXISTS api_usage_limits (
  bucket_key TEXT PRIMARY KEY NOT NULL,
  window_start_ms INTEGER NOT NULL,
  count INTEGER NOT NULL CHECK (count > 0),
  expires_at_ms INTEGER NOT NULL
) WITHOUT ROWID;

CREATE INDEX IF NOT EXISTS api_usage_limits_expires_at
  ON api_usage_limits (expires_at_ms);
