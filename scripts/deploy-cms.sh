#!/bin/bash
set -xeuo pipefail

# Log all output to a file for debugging
debug_log="/tmp/deploy-cms-debug.log"
exec > >(tee -a "$debug_log") 2>&1

echo "[DEBUG] Starting deploy-cms.sh at $(date) as user $(whoami)"

echo "[DEBUG] Changing directory to /home/ec2-user/repo"
cd /home/ec2-user/repo

# Install dependencies
echo "[DEBUG] Setting NVM_DIR and checking for nvm.sh"
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
    echo "[DEBUG] Sourcing $NVM_DIR/nvm.sh"
    # shellcheck source=/dev/null
    source "$NVM_DIR/nvm.sh"
else
    echo "[DEBUG] nvm.sh not found at $NVM_DIR/nvm.sh"
fi

# Check environment and configure .env file
ENV_NAME_FILE="/etc/gdl-env-name"
if [ -f "$ENV_NAME_FILE" ] && [ "$(cat $ENV_NAME_FILE)" = "prod" ]; then
    echo "[DEBUG] Production environment detected. Configuring for RDS."

    if ! command -v aws &> /dev/null || ! command -v jq &> /dev/null; then
        echo "[ERROR] AWS CLI or jq is not installed." >&2
        exit 1
    fi

    # Source the env file created by UserData to get CMS_DB_SECRET_NAME
    GDD_ENV_FILE="/etc/profile.d/gdl-env.sh"
    if [ -f "$GDD_ENV_FILE" ]; then
        # shellcheck source=/dev/null
        source "$GDD_ENV_FILE"
    fi

    if [ -z "${CMS_DB_SECRET_NAME:-}" ]; then
        echo "[ERROR] CMS_DB_SECRET_NAME environment variable is not set. Check UserData script in CDK." >&2
        exit 1
    fi

    echo "[DEBUG] Fetching DB credentials from Secrets Manager using secret name: $CMS_DB_SECRET_NAME"
    DB_SECRET=$(aws secretsmanager get-secret-value --secret-id "$CMS_DB_SECRET_NAME" --query SecretString --output text)

    if [ -z "$DB_SECRET" ]; then
        echo "[ERROR] Failed to retrieve DB secret from Secrets Manager." >&2
        exit 1
    fi

    DATABASE_HOST=$(echo "$DB_SECRET" | jq -r .host)
    DATABASE_PORT=$(echo "$DB_SECRET" | jq -r .port)
    DATABASE_USERNAME=$(echo "$DB_SECRET" | jq -r .username)
    DATABASE_PASSWORD=$(echo "$DB_SECRET" | jq -r .password)
    DATABASE_NAME=$(echo "$DB_SECRET" | jq -r .dbname)

    echo "[DEBUG] Creating .env file for production (RDS)"
    # IMPORTANT: You should manage your app's secret keys securely, not hardcode them.
    # Consider using another secret in Secrets Manager for them.
    cat > apps/cms/.env <<EOF
HOST=0.0.0.0
PORT=1337
APP_KEYS="toBeModified1,toBeModified2"
API_TOKEN_SALT=tobemodified
ADMIN_JWT_SECRET=tobemodified
TRANSFER_TOKEN_SALT=tobemodified
JWT_SECRET=tobemodified
DATABASE_CLIENT=postgres
DATABASE_HOST=${DATABASE_HOST}
DATABASE_PORT=${DATABASE_PORT}
DATABASE_NAME=${DATABASE_NAME:-strapi}
DATABASE_USERNAME=${DATABASE_USERNAME}
DATABASE_PASSWORD=${DATABASE_PASSWORD}
DATABASE_SSL=true
PGSSLMODE=no-verify
CLIENT_URL=
PREVIEW_SECRET=Zlx9EJFRSmJc0o0j8HanWeB==
EOF

else
    echo "[DEBUG] Not a production environment. Using existing .env or example."
    if [ ! -f "apps/cms/.env" ]; then
        echo "[DEBUG] Creating .env from .env.example"
        cp apps/cms/.env.example apps/cms/.env
    fi
fi

echo "[DEBUG] Running pnpm install"
pnpm install

# Build the admin panel
echo "[DEBUG] Building CMS admin panel"
pnpm -F cms run build

# Restart CMS (kill old, start new)
echo "[DEBUG] Killing any existing cms processes"
pkill -f "pnpm -F cms run start" || true

echo "[DEBUG] Starting CMS"
pnpm -F cms run start > "$HOME/cms.log" 2>&1 &

echo "[DEBUG] deploy-cms.sh completed at $(date)"
