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
    source "$NVM_DIR/nvm.sh"
else
    echo "[DEBUG] nvm.sh not found at $NVM_DIR/nvm.sh"
fi

echo "[DEBUG] Running pnpm install"
pnpm install

# Create the .env file from the example if it doesn't exist
if [ ! -f "apps/cms/.env" ]; then
    echo "[DEBUG] Creating .env from .env.example"
    cp apps/cms/.env.example apps/cms/.env
fi

# Build the admin panel
echo "[DEBUG] Building CMS admin panel"
pnpm -F cms run build

# Restart CMS (kill old, start new)
echo "[DEBUG] Killing any existing cms processes"
pkill -f "pnpm -F cms run start" || true

echo "[DEBUG] Starting CMS"
pnpm -F cms run start > $HOME/cms.log 2>&1 &

echo "[DEBUG] deploy-cms.sh completed at $(date)"
