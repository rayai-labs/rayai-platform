-- name: GetSandbox :one
SELECT id, user_id, status, created_at, updated_at
FROM sandbox
WHERE id = $1;

-- name: GetSandboxesByUser :many
SELECT id, user_id, status, created_at, updated_at
FROM sandbox
WHERE user_id = $1
ORDER BY created_at DESC;

-- name: CreateSandbox :one
INSERT INTO sandbox (user_id, status)
VALUES ($1, $2)
RETURNING id, user_id, status, created_at, updated_at;

-- name: UpdateSandboxStatus :one
UPDATE sandbox
SET status = $2, updated_at = NOW()
WHERE id = $1
RETURNING id, user_id, status, created_at, updated_at;

-- name: DeleteSandbox :exec
DELETE FROM sandbox
WHERE id = $1;

-- name: GetActiveSandboxesByUser :many
SELECT id, user_id, status, created_at, updated_at
FROM sandbox
WHERE user_id = $1 AND status = 'active'
ORDER BY created_at DESC;

-- name: CountSandboxesByUser :one
SELECT COUNT(*) as count
FROM sandbox
WHERE user_id = $1;
