#!/bin/bash
set -e

cd /home/ec2-user/repo

# Install dependencies
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
pnpm install

# Update env
sed -i 's|http://localhost:1337|http://<CMS_PRIVATE_IP>:1337|g' apps/frontend-website/env.ts

# Restart frontend (kill old, start new)
pkill -f "pnpm -F few run dev" || true
pnpm -F few run dev > $HOME/few.log 2>&1 &
