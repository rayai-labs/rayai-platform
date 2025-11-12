-- name: GetProfile :one
SELECT id, email, full_name, avatar_url, provider, provider_id, created_at, updated_at
FROM profile
WHERE id = $1;

-- name: GetProfileByEmail :one
SELECT id, email, full_name, avatar_url, provider, provider_id, created_at, updated_at
FROM profile
WHERE email = $1;

-- name: CreateProfile :one
INSERT INTO profile (id, email, full_name, avatar_url, provider, provider_id)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING id, email, full_name, avatar_url, provider, provider_id, created_at, updated_at;

-- name: UpdateProfile :one
UPDATE profile
SET
    full_name = COALESCE($2, full_name),
    avatar_url = COALESCE($3, avatar_url),
    updated_at = NOW()
WHERE id = $1
RETURNING id, email, full_name, avatar_url, provider, provider_id, created_at, updated_at;

-- name: DeleteProfile :exec
DELETE FROM profile
WHERE id = $1;

-- name: ListProfiles :many
SELECT id, email, full_name, avatar_url, provider, provider_id, created_at, updated_at
FROM profile
ORDER BY created_at DESC
LIMIT $1 OFFSET $2;
