-- name: GetAPIKey :one
SELECT id, user_id, name, key_hash, created_at, last_used_at
FROM api_key
WHERE id = $1;

-- name: GetAPIKeysByUser :many
SELECT id, user_id, name, key_hash, created_at, last_used_at
FROM api_key
WHERE user_id = $1
ORDER BY created_at DESC;

-- name: CreateAPIKey :one
INSERT INTO api_key (user_id, name, key_hash)
VALUES ($1, $2, $3)
RETURNING id, user_id, name, key_hash, created_at, last_used_at;

-- name: UpdateAPIKeyLastUsed :one
UPDATE api_key
SET last_used_at = NOW()
WHERE id = $1
RETURNING id, user_id, name, key_hash, created_at, last_used_at;

-- name: DeleteAPIKey :exec
DELETE FROM api_key
WHERE id = $1;

-- name: GetAPIKeyByHash :one
SELECT id, user_id, name, key_hash, created_at, last_used_at
FROM api_key
WHERE key_hash = $1;
