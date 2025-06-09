#!/bin/bash
set -e

# Source environment variables from /etc/environment
if [ -f /etc/environment ]; then
  set -o allexport
  source /etc/environment
  set +o allexport
fi

cd /home/ec2-user/repo

# Install dependencies
export NVM_DIR="$HOME/.nvm"
# Check if nvm.sh exists and source it
if [ -s "$NVM_DIR/nvm.sh" ]; then
    . "$NVM_DIR/nvm.sh"
fi

pnpm install

# Update env.ts with the CMS private IP
# Note: CMS_PRIVATE_IP is sourced from /etc/environment
if [ -n "$CMS_PRIVATE_IP" ]; then
  sed -i "s|http://localhost:1337|http://${CMS_PRIVATE_IP}:1337|g" apps/frontend-website/env.ts
else
  echo "Warning: CMS_PRIVATE_IP is not set. Skipping env update."
fi


# Restart frontend (kill old, start new)
pkill -f "pnpm -F few run dev" || true
pnpm -F few run dev > $HOME/few.log 2>&1 &
