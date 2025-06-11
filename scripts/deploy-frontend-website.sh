#!/bin/bash
set -xeuo pipefail

# Log all output to a file for debugging
debug_log="/tmp/deploy-frontend-website-debug.log"
exec > >(tee -a "$debug_log") 2>&1

echo "[DEBUG] Starting deploy-frontend-website.sh at $(date) as user $(whoami)"

# Source environment variables from our dedicated env file
echo "[DEBUG] Checking for /etc/gdl.env..."
if [ -f /etc/gdl.env ]; then
  set -o allexport
  echo "[DEBUG] Sourcing /etc/gdl.env"
  source /etc/gdl.env
  set +o allexport
else
  echo "[DEBUG] /etc/gdl.env not found. Skipping."
fi

echo "[DEBUG] Changing directory to /home/ec2-user/repo"
cd /home/ec2-user/repo

# Install dependencies
echo "[DEBUG] Setting NVM_DIR and checking for nvm.sh"
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
    echo "[DEBUG] Sourcing $NVM_DIR/nvm.sh"
    . "$NVM_DIR/nvm.sh"
else
    echo "[DEBUG] nvm.sh not found at $NVM_DIR/nvm.sh"
fi

echo "[DEBUG] Running pnpm install"
pnpm install

# Update env.ts with the CMS private IP
echo "[DEBUG] Checking CMS_PRIVATE_IP: $CMS_PRIVATE_IP"
if [ -n "$CMS_PRIVATE_IP" ]; then
  echo "[DEBUG] Found CMS_PRIVATE_IP: $CMS_PRIVATE_IP. Updating env.ts."
  sed -i "s|http://localhost:1337|http://${CMS_PRIVATE_IP}|g" apps/frontend-website/env.ts
else
  echo "[ERROR] CMS_PRIVATE_IP is not set. Cannot update env.ts. Deployment will fail."
  exit 1
fi

# Build the frontend app for production
echo "[DEBUG] Building the frontend app for production..."
pnpm -F few run build

# Restart frontend (kill old, start new)
echo "[DEBUG] Killing any existing frontend processes"
pkill -f "pnpm -F few run dev" || true
pkill -f "pnpm -F few run start" || true
echo "[DEBUG] Starting frontend in production mode"
pnpm -F few run start > $HOME/few.log 2>&1 &

echo "[DEBUG] deploy-frontend-website.sh completed at $(date)"
